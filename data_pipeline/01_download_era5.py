"""
Step 1: Download ERA5-Land reanalysis data from Copernicus CDS.

Prerequisites:
  1. Create free account at https://cds.climate.copernicus.eu/
  2. Go to your profile → API key
  3. Create ~/.cdsapirc with:
       url: https://cds.climate.copernicus.eu/api
       key: <your-uid>:<your-api-key>
  4. pip install -r requirements.txt

This downloads monthly snow depth + 2m temperature for the European Alps
(45°N-48.5°N, 5°E-11.5°E) from 2000-2024.

Variables:
  - snow_depth_water_equivalent (SWE in meters)
  - 2m_temperature (K)
"""

import cdsapi
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "raw_data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Alps bounding box: 45°N-48.5°N, 5°E-11.5°E
AREA = [48.5, 5.0, 45.0, 11.5]  # [North, West, South, East]

YEARS = [str(y) for y in range(2000, 2025)]
MONTHS = [f"{m:02d}" for m in range(1, 13)]

client = cdsapi.Client()


def download_snow_depth():
    """Download monthly mean snow depth water equivalent."""
    output_file = os.path.join(OUTPUT_DIR, "era5_snow_depth_alps_2000_2024.nc")
    if os.path.exists(output_file):
        print(f"Snow depth file already exists: {output_file}")
        return output_file

    print("Downloading ERA5-Land snow depth water equivalent (2000-2024)...")
    print("This may take 10-30 minutes depending on CDS queue...")

    client.retrieve(
        "reanalysis-era5-land-monthly-means",
        {
            "product_type": "monthly_averaged_reanalysis",
            "variable": "snow_depth_water_equivalent",
            "year": YEARS,
            "month": MONTHS,
            "time": "00:00",
            "area": AREA,
            "data_format": "netcdf",
        },
        output_file,
    )
    print(f"Downloaded: {output_file}")
    return output_file


def download_temperature():
    """Download monthly mean 2m temperature."""
    output_file = os.path.join(OUTPUT_DIR, "era5_temperature_alps_2000_2024.nc")
    if os.path.exists(output_file):
        print(f"Temperature file already exists: {output_file}")
        return output_file

    print("Downloading ERA5-Land 2m temperature (2000-2024)...")
    print("This may take 10-30 minutes depending on CDS queue...")

    client.retrieve(
        "reanalysis-era5-land-monthly-means",
        {
            "product_type": "monthly_averaged_reanalysis",
            "variable": "2m_temperature",
            "year": YEARS,
            "month": MONTHS,
            "time": "00:00",
            "area": AREA,
            "data_format": "netcdf",
        },
        output_file,
    )
    print(f"Downloaded: {output_file}")
    return output_file


if __name__ == "__main__":
    print("=" * 60)
    print("ERA5-Land Data Download for AlpineVerify")
    print("Region: European Alps (45°N-48.5°N, 5°E-11.5°E)")
    print("Period: 2000-2024, monthly means")
    print("=" * 60)

    snow_file = download_snow_depth()
    temp_file = download_temperature()

    print("\nDone! Run 02_process_data.py next.")
