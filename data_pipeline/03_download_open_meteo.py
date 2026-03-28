"""
Step 3 (Alternative): Download real climate data from Open-Meteo API.

NO API KEY REQUIRED. Uses Open-Meteo's free historical weather API
which provides ERA5-based reanalysis data.

This gives us real temperature + snowfall data for Alpine stations.
"""

import os
import json
import time
import requests
import numpy as np
import pandas as pd
import pymannkendall as mk
from scipy import stats
from statsmodels.tsa.arima.model import ARIMA
import warnings

warnings.filterwarnings("ignore")

FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "processed")
os.makedirs(FRONTEND_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# Representative Alpine stations at different elevations
STATIONS = {
    "Low Alps (< 1500m)": [
        {"name": "Innsbruck", "lat": 47.26, "lon": 11.39, "elev": 574},
        {"name": "Bolzano", "lat": 46.50, "lon": 11.35, "elev": 262},
        {"name": "Garmisch", "lat": 47.50, "lon": 11.10, "elev": 708},
        {"name": "Grenoble", "lat": 45.19, "lon": 5.72, "elev": 212},
        {"name": "Salzburg", "lat": 47.80, "lon": 13.04, "elev": 430},
    ],
    "Mid Alps (1500-2500m)": [
        {"name": "Davos", "lat": 46.81, "lon": 9.84, "elev": 1560},
        {"name": "St. Moritz", "lat": 46.50, "lon": 9.84, "elev": 1822},
        {"name": "Lech", "lat": 47.21, "lon": 10.14, "elev": 1450},
        {"name": "Zermatt", "lat": 46.02, "lon": 7.75, "elev": 1620},
        {"name": "Cortina", "lat": 46.54, "lon": 12.14, "elev": 1224},
    ],
    "High Alps (> 2500m)": [
        {"name": "Jungfraujoch", "lat": 46.55, "lon": 7.98, "elev": 3463},
        {"name": "Zugspitze", "lat": 47.42, "lon": 10.99, "elev": 2962},
        {"name": "Sonnblick", "lat": 47.05, "lon": 12.96, "elev": 3106},
        {"name": "Weissfluhjoch", "lat": 46.83, "lon": 9.81, "elev": 2690},
        {"name": "Col du Lautaret", "lat": 45.04, "lon": 6.40, "elev": 2058},
    ],
}

# Open-Meteo variables
DAILY_VARS = ["temperature_2m_mean", "temperature_2m_min", "snowfall_sum", "precipitation_sum"]


def fetch_station_data(lat, lon, name):
    """Fetch daily data from Open-Meteo historical API."""
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": "2000-01-01",
        "end_date": "2024-12-31",
        "daily": DAILY_VARS,
        "timezone": "auto",
    }

    print(f"  Fetching {name} ({lat}, {lon})...")
    time.sleep(2)  # Rate limit: wait 2s between requests
    resp = requests.get(url, params=params, timeout=60)

    if resp.status_code != 200:
        print(f"  WARNING: Failed to fetch {name}: {resp.status_code}")
        return None

    data = resp.json()
    if "daily" not in data:
        print(f"  WARNING: No daily data for {name}")
        return None

    df = pd.DataFrame(data["daily"])
    df["date"] = pd.to_datetime(df["time"])
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.dayofyear
    return df


def compute_annual_snow_days_from_daily(df):
    """
    Compute snow cover days using a simple degree-day snowpack model.
    Accumulate snowfall, melt based on temperature above 0°C.
    Count days where snowpack > 0.
    """
    df = df.sort_values("date").copy()
    snowfall = df["snowfall_sum"].fillna(0).values  # cm
    temp = df["temperature_2m_mean"].fillna(5).values  # °C

    # Simple snowpack model
    MELT_RATE = 0.4  # cm melt per degree above 0°C per day
    snowpack = np.zeros(len(df))
    current_pack = 0.0

    for i in range(len(df)):
        # Add snowfall
        current_pack += snowfall[i]
        # Melt if warm
        if temp[i] > 0:
            melt = MELT_RATE * temp[i]
            current_pack = max(0, current_pack - melt)
        snowpack[i] = current_pack

    df["snowpack"] = snowpack
    df["has_snow"] = snowpack > 0.5  # > 0.5cm = snow covered

    yearly = df.groupby("year")["has_snow"].sum().reset_index()
    yearly.columns = ["year", "snow_days"]
    return yearly


def run_mann_kendall_test(series):
    """Run Mann-Kendall trend test."""
    result = mk.original_test(series)
    return {
        "trend": result.trend,
        "p_value": round(float(result.p), 6),
        "slope": round(float(result.slope * 10), 2),
        "significance": (
            "Highly Significant" if result.p < 0.01
            else "Significant" if result.p < 0.05
            else "Not Significant"
        ),
        "direction": "Declining" if result.slope < 0 else "Increasing",
    }


def pettitt_test(series):
    """Pettitt change point detection."""
    n = len(series)
    if n < 5:
        return {"change_point_index": 0, "year": 0, "p_value": 1.0, "before_mean": 0, "after_mean": 0}

    # Compute U statistic matrix
    U = np.zeros(n, dtype=float)
    for t in range(n):
        for j in range(n):
            U[t] += np.sign(series[t] - series[j])

    U_cumsum = np.cumsum(U)
    K = np.max(np.abs(U_cumsum))
    t_star = int(np.argmax(np.abs(U_cumsum)))
    p_value = 2 * np.exp(-6 * K ** 2 / (n ** 3 + n ** 2))

    return {
        "change_point_index": t_star,
        "p_value": round(float(min(p_value, 1.0)), 4),
        "before_mean": round(float(np.mean(series[: t_star + 1])), 1),
        "after_mean": round(float(np.mean(series[t_star + 1 :])), 1),
    }


def run_arima(series, years):
    """ARIMA projection to 2050."""
    scenarios = [
        {"name": "Current Trend", "multiplier": 1.0},
        {"name": "Accelerated (RCP 8.5)", "multiplier": 1.5},
        {"name": "Paris-Aligned (RCP 2.6)", "multiplier": 0.6},
    ]

    projections = {}
    for sc in scenarios:
        try:
            s = pd.Series(series, index=pd.RangeIndex(len(series)))
            model = ARIMA(s, order=(1, 1, 1))
            fitted = model.fit()
            forecast_steps = 2050 - years[-1]
            fc = fitted.get_forecast(steps=forecast_steps)
            mean_fc = fc.predicted_mean.to_numpy() if hasattr(fc.predicted_mean, 'to_numpy') else np.array(fc.predicted_mean)
            ci = fc.conf_int()
            ci_upper = ci.iloc[:, 1].to_numpy() if hasattr(ci.iloc[:, 1], 'to_numpy') else np.array(ci.iloc[:, 1])
            ci_lower = ci.iloc[:, 0].to_numpy() if hasattr(ci.iloc[:, 0], 'to_numpy') else np.array(ci.iloc[:, 0])

            # Apply scenario multiplier: scale departure from last observed value
            departure = mean_fc - series[-1]
            adjusted = series[-1] + departure * sc["multiplier"]
            adjusted = np.maximum(adjusted, 0)

            proj_years = list(range(years[-1] + 1, 2051))
            projections[sc["name"]] = {
                "years": proj_years,
                "values": [round(float(v), 1) for v in adjusted],
                "upper_ci": [round(float(max(0, v)), 1) for v in ci_upper],
                "lower_ci": [round(float(max(0, v)), 1) for v in ci_lower],
                "loss_by_2050": round(float(series[-1] - adjusted[-1]), 1),
                "snow_days_2050": round(float(adjusted[-1]), 1),
            }
        except Exception as e:
            print(f"    ARIMA failed for {sc['name']}: {e}, using linear fallback")
            slope = np.polyfit(range(len(series)), series, 1)[0]
            proj_years = list(range(years[-1] + 1, 2051))
            projected = [max(0, series[-1] + slope * sc["multiplier"] * (i + 1)) for i in range(len(proj_years))]
            projections[sc["name"]] = {
                "years": proj_years,
                "values": [round(v, 1) for v in projected],
                "upper_ci": [round(v * 1.15, 1) for v in projected],
                "lower_ci": [round(max(0, v * 0.85), 1) for v in projected],
                "loss_by_2050": round(float(series[-1] - projected[-1]), 1),
                "snow_days_2050": round(float(projected[-1]), 1),
            }

    return projections


def build_surface_data(all_station_data):
    """Build 3D surface: Year × Month × snowfall across all stations."""
    all_dfs = []
    for band_stations in all_station_data.values():
        for df in band_stations:
            if df is not None and "snowfall_sum" in df.columns:
                all_dfs.append(df[["year", "month", "snowfall_sum"]].copy())

    if not all_dfs:
        return None

    combined = pd.concat(all_dfs)
    # Monthly total snowfall averaged across stations
    pivot = combined.pivot_table(values="snowfall_sum", index="year", columns="month", aggfunc="mean")
    # Convert cm to inches
    pivot = pivot.fillna(0) * 0.3937

    return {
        "years": pivot.index.tolist(),
        "months": pivot.columns.tolist(),
        "z": [[round(v, 2) for v in row] for row in pivot.values.tolist()],
    }


def main():
    print("=" * 60)
    print("AlpineVerify — Open-Meteo Data Pipeline (NO API KEY)")
    print("Downloading real ERA5-based reanalysis data...")
    print("=" * 60)

    all_station_data = {}
    output = {
        "metadata": {
            "source": "Open-Meteo Historical Weather API (ERA5 reanalysis)",
            "provider": "Open-Meteo.com / ECMWF ERA5",
            "region": "European Alps — representative stations",
            "period": "2000-2024",
            "variables": ["temperature_2m_mean", "snowfall_sum", "snow_depth"],
            "stations": {
                band: [s["name"] for s in stations]
                for band, stations in STATIONS.items()
            },
            "generated": pd.Timestamp.now().isoformat(),
        },
        "elevation_bands": {},
        "surface_3d": None,
    }

    for band_name, stations in STATIONS.items():
        print(f"\n{'='*50}")
        print(f"Band: {band_name}")
        print(f"{'='*50}")

        band_dfs = []
        for station in stations:
            df = fetch_station_data(station["lat"], station["lon"], station["name"])
            band_dfs.append(df)

        all_station_data[band_name] = band_dfs

        # Compute average snow days across stations in this band
        yearly_all = []
        temp_yearly_all = []
        for df in band_dfs:
            if df is None:
                continue
            yearly = compute_annual_snow_days_from_daily(df)
            if yearly is not None:
                yearly_all.append(yearly.set_index("year")["snow_days"])

            if "temperature_2m_mean" in df.columns:
                temp_yr = df.groupby("year")["temperature_2m_mean"].mean()
                temp_yearly_all.append(temp_yr)

        if not yearly_all:
            print(f"  No data for {band_name}, skipping")
            continue

        # Average across stations
        snow_df = pd.concat(yearly_all, axis=1).mean(axis=1).reset_index()
        snow_df.columns = ["year", "snow_days"]
        # Filter to complete years
        snow_df = snow_df[(snow_df["year"] >= 2000) & (snow_df["year"] <= 2024)]

        years = snow_df["year"].tolist()
        snow_days = snow_df["snow_days"].tolist()

        print(f"\n  Years: {years[0]}-{years[-1]}")
        print(f"  Mean snow days: {np.mean(snow_days):.1f}")
        print(f"  First 5yr avg: {np.mean(snow_days[:5]):.1f}")
        print(f"  Last 5yr avg: {np.mean(snow_days[-5:]):.1f}")

        # Statistical tests
        series = np.array(snow_days)

        print("  Running Mann-Kendall test...")
        mk_result = run_mann_kendall_test(series)
        print(f"    {mk_result['direction']}: {mk_result['slope']} days/decade, p={mk_result['p_value']}")

        print("  Running Pettitt change point test...")
        cp_result = pettitt_test(series)
        cp_result["year"] = years[cp_result["change_point_index"]]
        print(f"    Change point: {cp_result['year']}, p={cp_result['p_value']}")

        # Temperature correlation
        corr_result = None
        if temp_yearly_all:
            temp_avg = pd.concat(temp_yearly_all, axis=1).mean(axis=1)
            temp_avg = temp_avg.reindex(years)
            if temp_avg.notna().sum() > 5:
                valid = temp_avg.dropna()
                valid_snow = [snow_days[years.index(y)] for y in valid.index if y in years]
                if len(valid_snow) == len(valid):
                    corr_result = {
                        "r": round(float(stats.pearsonr(valid.values, valid_snow)[0]), 3),
                        "r_squared": round(float(stats.pearsonr(valid.values, valid_snow)[0] ** 2), 3),
                        "p_value": round(float(stats.pearsonr(valid.values, valid_snow)[1]), 6),
                    }
                    print(f"    Temp correlation: R={corr_result['r']}, R²={corr_result['r_squared']}")

        # ARIMA projections
        print("  Running ARIMA projections to 2050...")
        projections = run_arima(series, years)

        # Trend line (Sen's slope)
        slope_per_year = mk_result["slope"] / 10
        trend_line = [round(snow_days[0] + slope_per_year * i, 1) for i in range(len(years))]

        output["elevation_bands"][band_name] = {
            "years": years,
            "snow_days": [round(v, 1) for v in snow_days],
            "trend_line": trend_line,
            "mann_kendall": mk_result,
            "change_point": cp_result,
            "correlation": corr_result,
            "projections": projections,
        }

    # Build 3D surface
    print("\nBuilding 3D surface data...")
    surface = build_surface_data(all_station_data)
    output["surface_3d"] = surface

    # Export
    output_file = os.path.join(FRONTEND_DIR, "alpine_snow_data.json")
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nExported to: {output_file}")

    processed_file = os.path.join(PROCESSED_DIR, "alpine_snow_data.json")
    with open(processed_file, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Backup: {processed_file}")

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for band, data in output["elevation_bands"].items():
        mk_r = data["mann_kendall"]
        print(f"\n{band}:")
        print(f"  Trend: {mk_r['slope']} days/decade ({mk_r['significance']})")
        print(f"  Change point: {data['change_point']['year']}")
        if data["correlation"]:
            print(f"  Temp correlation: R={data['correlation']['r']}")
        for sc_name, proj in data["projections"].items():
            print(f"  {sc_name}: {proj['snow_days_2050']} days by 2050 (loss: {proj['loss_by_2050']})")


if __name__ == "__main__":
    main()
