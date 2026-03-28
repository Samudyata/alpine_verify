# SnowLens

**Where Satellite Data Meets Climate Truth** — A web-based climate fact-checking tool that uses 25 years of ERA5 satellite data to verify claims about Alpine snow cover.

Built for [SpaceHACK for Sustainability 2026](https://spacehack.space/) | Track AIB: Climate Change and the Alpine Information Battle

[![Live Demo](https://img.shields.io/badge/demo-alpineverify.vercel.app-blue?style=for-the-badge)](https://alpineverify.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![SpaceHACK 2026](https://img.shields.io/badge/SpaceHACK-2026-orange?style=for-the-badge)](#)

---

## Overview

SnowLens transforms 25 years of ERA5 reanalysis data (2000-2024) from 15 Alpine weather stations into an interactive dashboard that lets anyone fact-check climate claims about Alpine snow cover. Type a claim, get a verdict backed by real statistical evidence.

---

## Features

### Snow Cover Trends
Interactive time series for 3 elevation bands (Low <1500 m, Mid 1500-2500 m, High >2500 m) with Mann-Kendall trend tests, Sen's slope, and Pettitt change point detection.

### 3D Snow Surface
Interactive Plotly 3D surface showing Year x Month x Snow Water Equivalent across all elevation bands.

### Seasonal Decomposition
Heatmap of monthly snow cover patterns revealing shoulder season shrinkage over the 25-year record.

### Projections to 2050
Exponential decay model under 3 scenarios: Current Trend, RCP 8.5, and Paris-Aligned RCP 2.6.

### Fact Checker
Enter any climate claim and receive a **SUPPORTED** or **REFUTED** verdict with real p-values, evidence charts, and source citations.

### Key Findings Summary
Results overview with stakeholder impact analysis for tourism, water resources, and ecosystems.

---

## Key Findings

| Elevation Band | Trend | Significance |
|---|---|---|
| **Low Alps** (<1500 m) | -21.6 days/decade | p = 0.005, highly significant |
| **Mid Alps** (1500-2500 m) | +3.0 days/decade | p = 0.76, not significant |
| **High Alps** (>2500 m) | Stable at 365 days | Year-round snow cover |

- **Change point detected at 2013** — snow days in the Low Alps dropped from 162 to 127 days
- **Temperature explains 69% of snow variation** (Pearson R = -0.828)
- **Projection (Low Alps by 2050):** 76 snow days (current trend), 57 under RCP 8.5

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS v4 + Plotly.js |
| Data Pipeline | Python (Open-Meteo ERA5 API, statistical analysis, JSON export) |
| Statistical Tests | pymannkendall, scipy.stats (Pettitt, Pearson), exponential decay projection |
| Deployment | Vercel |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Run the data pipeline (optional)

```bash
cd data_pipeline
pip install -r requirements.txt
python 01_download_era5.py
python 02_process_data.py
python 03_download_open_meteo.py
```

---

## Project Structure

```
AlpineVerify/
├── frontend/             # React app (Vite + Tailwind + Plotly.js)
│   ├── src/              # Components, pages, and assets
│   ├── public/           # Static files and processed data
│   └── vite.config.js
├── data_pipeline/        # Python scripts for data download & processing
│   ├── 01_download_era5.py
│   ├── 02_process_data.py
│   ├── 03_download_open_meteo.py
│   ├── raw_data/         # Downloaded ERA5 data
│   └── processed/        # Analysis outputs (JSON)
├── create_slides.js      # PPTX generator for presentation
└── README.md
```

---

## Data Sources

- **ECMWF ERA5 Reanalysis** via [Open-Meteo Historical Weather API](https://open-meteo.com/)
- 15 Alpine weather stations across 3 elevation bands
- 25 years of daily data (2000-2024)

> Hersbach, H. et al. (2020). The ERA5 global reanalysis. *Q.J.R. Meteorol. Soc.*, 146(730), 1999-2049. DOI: [10.1002/qj.3803](https://doi.org/10.1002/qj.3803)

---

## SDG Alignment

- **SDG 6** — Clean Water and Sanitation: Alpine snowpack is a critical freshwater reservoir for downstream communities.
- **SDG 13** — Climate Action: Quantifying snow cover decline directly supports climate awareness and informed policy.
- **SDG 15** — Life on Land: Monitoring ecosystem impacts of reduced snow cover on Alpine biodiversity.

---

## Team

**Team #3 — Arizona State University**

| Name | Program | Role |
|---|---|---|
| **Samudyata** | Computer Engineering (Grad) | Data Pipeline & Backend |
| **Chinmayi** | Data Science, Analytics & Engineering (Grad) | Visualizations in Frontend |
| **Shambhavi** | Data Science, Analytics & Engineering (Grad) | UI/UX & Page Design |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
