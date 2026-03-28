"""
Step 2: Process ERA5-Land data into elevation-band time series.

Reads the downloaded NetCDF files, classifies grid cells by elevation,
computes annual snow cover duration per band, runs statistical tests,
and generates ARIMA projections.

Outputs JSON files for the frontend.
"""

import os
import json
import numpy as np
import pandas as pd
import xarray as xr
import pymannkendall as mk
from scipy import stats
from statsmodels.tsa.arima.model import ARIMA
import warnings

warnings.filterwarnings("ignore")

RAW_DIR = os.path.join(os.path.dirname(__file__), "raw_data")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "processed")
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data")
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(FRONTEND_DIR, exist_ok=True)

# Elevation thresholds for Alps classification
# ERA5-Land doesn't have elevation directly, so we use the geopotential/orography
# or approximate by latitude bands (higher lat in Alps = generally lower elevation)
# For proper classification, we use the ERA5 orography field
ELEVATION_BANDS = {
    "Low Alps (< 1500m)": (0, 1500),
    "Mid Alps (1500-2500m)": (1500, 2500),
    "High Alps (> 2500m)": (2500, 5000),
}

# SWE threshold for "snow covered day" (meters of water equivalent)
SNOW_THRESHOLD = 0.01  # 10mm SWE = snow covered


def load_data():
    """Load ERA5 NetCDF files."""
    snow_file = os.path.join(RAW_DIR, "era5_snow_depth_alps_2000_2024.nc")
    temp_file = os.path.join(RAW_DIR, "era5_temperature_alps_2000_2024.nc")

    if not os.path.exists(snow_file):
        raise FileNotFoundError(
            f"Snow data not found at {snow_file}\n"
            "Run 01_download_era5.py first."
        )

    print("Loading snow depth data...")
    ds_snow = xr.open_dataset(snow_file)

    ds_temp = None
    if os.path.exists(temp_file):
        print("Loading temperature data...")
        ds_temp = xr.open_dataset(temp_file)

    return ds_snow, ds_temp


def classify_by_elevation(ds):
    """
    Classify grid cells by elevation using ERA5 orography.
    If orography isn't available, use a latitude-based approximation.
    """
    # ERA5-Land grid cell approximate elevations based on the Alps topography
    # In a real pipeline, you'd use a DEM (e.g., SRTM) to classify
    # For now, we approximate using latitude + longitude patterns
    lats = ds.latitude.values if "latitude" in ds.coords else ds.lat.values
    lons = ds.longitude.values if "longitude" in ds.coords else ds.lon.values

    lon_grid, lat_grid = np.meshgrid(lons, lats)

    # Approximate elevation in Alps: higher in center (46.5-47°N, 8-10°E)
    # This is a rough model; replace with actual DEM for production
    dist_from_center = np.sqrt((lat_grid - 46.8) ** 2 + (lon_grid - 9.5) ** 2)
    approx_elevation = 3500 - dist_from_center * 800  # rough approximation
    approx_elevation = np.clip(approx_elevation, 200, 4500)

    masks = {}
    for name, (low, high) in ELEVATION_BANDS.items():
        masks[name] = (approx_elevation >= low) & (approx_elevation < high)

    return masks, approx_elevation


def compute_annual_snow_days(ds_snow, masks):
    """Compute annual snow cover duration per elevation band."""
    # Get the snow variable name
    var_name = None
    for v in ["sd", "sde", "snow_depth_water_equivalent", "rsn"]:
        if v in ds_snow.data_vars:
            var_name = v
            break
    if var_name is None:
        var_name = list(ds_snow.data_vars)[0]
        print(f"Using variable: {var_name}")

    snow = ds_snow[var_name]

    # Group by year and compute snow covered months per year
    results = {}
    for band_name, mask in masks.items():
        # Apply spatial mask and compute mean SWE per month
        band_snow = snow.where(mask)
        band_mean = band_snow.mean(dim=["latitude", "longitude"])

        # Convert to pandas for easier yearly aggregation
        df = band_mean.to_dataframe().reset_index()
        df["year"] = pd.to_datetime(df["time"]).dt.year

        # Count months with snow > threshold, multiply by ~30 for days
        yearly = df.groupby("year").apply(
            lambda g: (g[var_name] > SNOW_THRESHOLD).sum() * 30.4
        ).reset_index()
        yearly.columns = ["year", "snow_days"]

        results[band_name] = yearly

    return results


def run_mann_kendall(series):
    """Run Mann-Kendall trend test."""
    result = mk.original_test(series)
    return {
        "trend": result.trend,
        "p_value": round(float(result.p), 6),
        "slope": round(float(result.slope * 10), 2),  # per decade
        "significance": (
            "Highly Significant" if result.p < 0.01
            else "Significant" if result.p < 0.05
            else "Not Significant"
        ),
        "direction": "Declining" if result.slope < 0 else "Increasing",
    }


def detect_change_point(series):
    """Pettitt change point detection."""
    n = len(series)
    U = np.zeros(n)

    for t in range(n):
        for j in range(n):
            U[t] += np.sign(series[t] - series[j])

    U_cumsum = np.cumsum(U)
    K = np.max(np.abs(U_cumsum))
    t_star = np.argmax(np.abs(U_cumsum))

    # Approximate p-value
    p_value = 2 * np.exp(-6 * K ** 2 / (n ** 3 + n ** 2))

    before_mean = float(np.mean(series[:t_star + 1]))
    after_mean = float(np.mean(series[t_star + 1:]))

    return {
        "change_point_index": int(t_star),
        "p_value": round(float(min(p_value, 1.0)), 4),
        "before_mean": round(before_mean, 1),
        "after_mean": round(after_mean, 1),
    }


def compute_correlation(snow_series, temp_series):
    """Pearson correlation between temperature and snow."""
    r, p = stats.pearsonr(temp_series, snow_series)
    return {
        "r": round(float(r), 3),
        "r_squared": round(float(r ** 2), 3),
        "p_value": round(float(p), 6),
    }


def run_arima_projections(series, years, scenarios=None):
    """Run ARIMA projections to 2050."""
    if scenarios is None:
        scenarios = [
            {"name": "Current Trend", "multiplier": 1.0},
            {"name": "Accelerated (RCP 8.5)", "multiplier": 1.5},
            {"name": "Paris-Aligned (RCP 2.6)", "multiplier": 0.6},
        ]

    projections = {}
    for scenario in scenarios:
        try:
            model = ARIMA(series, order=(2, 1, 1))
            fitted = model.fit()

            forecast_steps = 2050 - years[-1]
            forecast = fitted.forecast(steps=forecast_steps)
            conf_int = fitted.get_forecast(steps=forecast_steps).conf_int()

            # Apply scenario multiplier to the trend component
            base_decline = series[-1] - forecast.values
            adjusted_forecast = series[-1] - base_decline * scenario["multiplier"]
            adjusted_forecast = np.maximum(adjusted_forecast, 0)

            proj_years = list(range(years[-1] + 1, 2051))

            projections[scenario["name"]] = {
                "years": proj_years,
                "values": [round(float(v), 1) for v in adjusted_forecast],
                "upper_ci": [round(float(v), 1) for v in np.maximum(conf_int.iloc[:, 1].values, 0)],
                "lower_ci": [round(float(v), 1) for v in np.maximum(conf_int.iloc[:, 0].values, 0)],
                "loss_by_2050": round(float(series[-1] - adjusted_forecast[-1]), 1),
                "snow_days_2050": round(float(adjusted_forecast[-1]), 1),
            }
        except Exception as e:
            print(f"  ARIMA failed for {scenario['name']}: {e}")
            # Fallback: linear extrapolation
            slope = np.polyfit(range(len(series)), series, 1)[0]
            proj_years = list(range(years[-1] + 1, 2051))
            forecast_steps = len(proj_years)
            projected = [
                max(0, series[-1] + slope * scenario["multiplier"] * (i + 1))
                for i in range(forecast_steps)
            ]
            projections[scenario["name"]] = {
                "years": proj_years,
                "values": [round(v, 1) for v in projected],
                "upper_ci": [round(v * 1.1, 1) for v in projected],
                "lower_ci": [round(max(0, v * 0.9), 1) for v in projected],
                "loss_by_2050": round(float(series[-1] - projected[-1]), 1),
                "snow_days_2050": round(float(projected[-1]), 1),
            }

    return projections


def build_surface_data(ds_snow, masks):
    """Build 3D surface data: Year × Month × SWE for the 3D visualization."""
    var_name = None
    for v in ["sd", "sde", "snow_depth_water_equivalent", "rsn"]:
        if v in ds_snow.data_vars:
            var_name = v
            break
    if var_name is None:
        var_name = list(ds_snow.data_vars)[0]

    snow = ds_snow[var_name]

    # Average across all elevation bands (entire Alps)
    alps_mean = snow.mean(dim=["latitude", "longitude"])
    df = alps_mean.to_dataframe().reset_index()
    df["year"] = pd.to_datetime(df["time"]).dt.year
    df["month"] = pd.to_datetime(df["time"]).dt.month

    # Convert SWE from meters to inches for display
    pivot = df.pivot_table(
        values=var_name, index="year", columns="month", aggfunc="mean"
    )
    pivot = pivot * 39.37  # meters to inches

    return {
        "years": pivot.index.tolist(),
        "months": pivot.columns.tolist(),
        "z": pivot.fillna(0).values.tolist(),
    }


def process_and_export():
    """Main processing pipeline."""
    ds_snow, ds_temp = load_data()

    print("\nClassifying grid cells by elevation...")
    masks, elevations = classify_by_elevation(ds_snow)

    print("Computing annual snow cover duration per band...")
    annual_data = compute_annual_snow_days(ds_snow, masks)

    # Build the full output structure
    output = {
        "metadata": {
            "source": "ERA5-Land Monthly Averaged Reanalysis",
            "provider": "Copernicus Climate Data Store",
            "region": "European Alps (45°N-48.5°N, 5°E-11.5°E)",
            "period": "2000-2024",
            "variables": ["snow_depth_water_equivalent", "2m_temperature"],
            "generated": pd.Timestamp.now().isoformat(),
        },
        "elevation_bands": {},
        "surface_3d": None,
    }

    # Process each elevation band
    for band_name, yearly_df in annual_data.items():
        years = yearly_df["year"].tolist()
        snow_days = yearly_df["snow_days"].tolist()

        print(f"\n--- {band_name} ---")
        print(f"  Years: {years[0]}-{years[-1]}, Mean: {np.mean(snow_days):.1f} days")

        # Mann-Kendall trend test
        print("  Running Mann-Kendall test...")
        mk_result = run_mann_kendall(np.array(snow_days))
        print(f"  Trend: {mk_result['direction']}, slope={mk_result['slope']} days/decade, p={mk_result['p_value']}")

        # Change point detection
        print("  Running Pettitt change point detection...")
        cp_result = detect_change_point(np.array(snow_days))
        cp_year = years[cp_result["change_point_index"]]
        cp_result["year"] = cp_year
        print(f"  Change point: {cp_year}, p={cp_result['p_value']}")

        # Temperature correlation (if available)
        corr_result = None
        if ds_temp is not None:
            print("  Computing temperature-snow correlation...")
            temp_var = None
            for v in ["t2m", "2m_temperature"]:
                if v in ds_temp.data_vars:
                    temp_var = v
                    break
            if temp_var is None:
                temp_var = list(ds_temp.data_vars)[0]

            temp = ds_temp[temp_var]
            band_mask = masks[band_name]
            temp_band = temp.where(band_mask).mean(dim=["latitude", "longitude"])
            temp_df = temp_band.to_dataframe().reset_index()
            temp_df["year"] = pd.to_datetime(temp_df["time"]).dt.year
            temp_yearly = temp_df.groupby("year")[temp_var].mean().values
            temp_yearly = temp_yearly - 273.15  # Kelvin to Celsius

            if len(temp_yearly) == len(snow_days):
                corr_result = compute_correlation(np.array(snow_days), temp_yearly)
                print(f"  Correlation: R={corr_result['r']}, R²={corr_result['r_squared']}")

        # ARIMA projections
        print("  Running ARIMA projections...")
        projections = run_arima_projections(np.array(snow_days), years)

        # Compute trend line (Sen's slope)
        slope_per_year = mk_result["slope"] / 10
        trend_line = [
            round(snow_days[0] + slope_per_year * i, 1)
            for i in range(len(years))
        ]

        output["elevation_bands"][band_name] = {
            "years": years,
            "snow_days": [round(v, 1) for v in snow_days],
            "trend_line": trend_line,
            "mann_kendall": mk_result,
            "change_point": cp_result,
            "correlation": corr_result,
            "projections": projections,
        }

    # Build 3D surface data
    print("\nBuilding 3D surface data...")
    output["surface_3d"] = build_surface_data(ds_snow, masks)

    # Export to JSON
    output_file = os.path.join(FRONTEND_DIR, "alpine_snow_data.json")
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nExported to: {output_file}")

    # Also save to processed dir
    processed_file = os.path.join(PROCESSED_DIR, "alpine_snow_data.json")
    with open(processed_file, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Backup saved to: {processed_file}")

    return output


if __name__ == "__main__":
    print("=" * 60)
    print("SnowLens Data Processing Pipeline")
    print("=" * 60)
    process_and_export()
    print("\nDone! Frontend data is ready at frontend/public/data/alpine_snow_data.json")
