# AlpineVerify Slide Deck — Exact Content
## File name: AIB_03_00_SLIDES_ASU.pptx
## Design: https://www.canva.com/d/vV24XIvUUw4omiV

---

## SLIDE 1: TITLE COVER

**Title (large, bold, centered):**
AlpineVerify: Satellite Truth vs. Climate Fiction

**Subtitle (smaller, below title):**
Using 25 years of ERA5 satellite data to fact-check climate disinformation in the European Alps

**Bottom-left box:**
SpaceHACK for Sustainability 2026

**Bottom-center box:**
Team Members: Samudyata, Chinmayi, Shambhavi

**Bottom-right box:**
Track: AIB — Climate Change and the Alpine Information Battle
Institution: Arizona State University (ASU)

**Top-right:**
Team: #3

**Design note:** Use the template's space/earth background. Keep it clean.

---

## SLIDE 2: THE PROBLEM

**Title:** The Alpine Information Battle

**Layout:** Two columns or stacked sections

**Left/Top — The Claims (use a quote-style box or callout):**

> "Snow levels in the Alps have remained stable over the past decades"

> "This winter had record snowfall, so climate change is not real"

> "Glacier retreat is a natural cycle, not caused by warming"

*(Style these as fake headline cards or social media posts to make them visually striking)*

**Right/Bottom — Why It Matters:**

- These claims spread online unchallenged — journalists lack tools to verify them against real satellite data
- 170M+ people across Europe depend on Alpine snowmelt for drinking water, agriculture, and hydropower
- Misinformation delays action on water security, infrastructure planning, and climate adaptation
- The AIB track asks: can Earth Observation data fight this information battle?

**Key Takeaway Box (bold, bottom):**
"The problem isn't data availability — it's data accessibility for non-scientists"

**Design note:** Make the disinformation claims visually prominent — red or orange tint, quotation marks, maybe a "fake news" style. The contrast between the claims and the real stakes should be striking.

---

## SLIDE 3: TEAM & APPROACH

**Title:** Our Team & Approach

**Left side — Team Table:**

| Name | Year | Major | Role |
|------|------|-------|------|
| Samudyata | Grad | Computer Engineering | Data Pipeline & Backend |
| Chinmayi | Grad | Data Science, Analytics & Engg | Visualizations in Frontend |
| Shambhavi | Grad | Data Science, Analytics & Engg | UI/UX & Page Design |

**Right side — Pipeline Diagram (visual flowchart with arrows):**

```
[ERA5 Satellite Data]
15 stations, 3 elevation bands
25 years (2000-2024)
        |
        v
[Python Data Pipeline]
Mann-Kendall, Pettitt,
Pearson, ARIMA
        |
        v
[React Web App]
Interactive Fact Checker,
3D visualizations,
Projections to 2050
```

**Below — Dataset Info (smaller text):**
- Data: ECMWF ERA5 reanalysis via Open-Meteo Historical Weather API
- 15 stations: Innsbruck, Bolzano, Garmisch, Grenoble, Salzburg (Low Alps <1500m) | Davos, St. Moritz, Lech, Zermatt, Cortina (Mid Alps 1500-2500m) | Jungfraujoch, Zugspitze, Sonnblick, Weissfluhjoch, Col du Lautaret (High Alps >2500m)
- Citation: Hersbach et al. (2020), Q.J.R. Meteorol. Soc., DOI: 10.1002/qj.3803

**Design note:** The pipeline diagram should use boxes with arrows between them. Make it visual, not just text. Color-code: blue for data, orange for processing, green for output.

---

## SLIDE 4: EXECUTIVE SUMMARY

**Title:** What We Found — At a Glance

**Top half — Four BIG stat boxes (centered, large font, colored numbers):**

| -21.6 | 69% | 2013 | 118 |
|-------|-----|------|-----|
| days/decade snow loss at low elevations (p = 0.005) | of snow variation explained by temperature (R = -0.828) | Year decline accelerated (Pettitt change point, p = 0.007) | Projected snow days by 2050 at low elevations |

*(Make the numbers HUGE — like 72pt bold. The labels below each should be 14-16pt.)*

**Bottom half — Three sections:**

**Results:**
Low-elevation Alpine snow cover is declining at 21.6 days per decade — statistically highly significant. The decline accelerated after 2013, with mean snow cover dropping from 162 to 127 days. Temperature is the primary driver (R = -0.828). Mid and high elevations remain stable, confirming an elevation-dependent pattern.

**Opportunities for Further Exploration:**
- Connect to Copernicus CDS for gridded satellite imagery
- Add NLP-powered claim matching for free-text input
- Expand to Pyrenees, Carpathians, Himalayas

**Lessons Learned:**
- Started with CDS API — hit rate limits, pivoted to Open-Meteo (same ERA5 data, no key restrictions)
- ARIMA required careful tuning for 25-year series
- High Alps showing 365 days/year looked like a bug — confirmed as real year-round snow above 2500m

---

## SLIDE 5: VIZ 1 — 3D SNOW SURFACE

**Title:** 25 Years of Alpine Snow in One View

**IMAGE (takes ~60% of slide):**
Screenshot of the 3D Surface Plot from alpineverify.vercel.app (Snow Trends page, scroll to bottom)

**Caption (below image, italic):**
"Interactive 3D surface plot: Year (2000-2024) x Month (Jan-Dec) x Snow Water Equivalent. Built with Plotly.js from real monthly snowfall data across 15 ERA5 Alpine stations. Users can drag to rotate and scroll to zoom."

**Key Takeaway Box (bold, bottom-right):**
"Winter peaks (yellow/green) are visibly lower in recent years — the surface flattens toward 2024, showing declining snowfall across the Alpine region"

**Data Source (small, bottom):**
ERA5 Reanalysis via Open-Meteo | 15 Alpine stations across 3 elevation bands

---

## SLIDE 6: VIZ 2 — ELEVATION TREND CHARTS

**Title:** Elevation Tells the Whole Story

**IMAGES (3 screenshots side by side, ~50% of slide):**
- Low Alps trend chart (blue, declining) — from Snow Trends page, "Low Alps" tab
- Mid Alps trend chart (green, flat) — "Mid Alps" tab
- High Alps trend chart (purple, flat at 365) — "High Alps" tab

**Captions (below each chart):**

Low Alps (<1500m):
"-21.6 days/decade (p = 0.005). Clear decline. Change point at 2013. Snow dropped from 162 to 127 days."

Mid Alps (1500-2500m):
"+3.0 days/decade (p = 0.76). Not significant. High variability but no clear trend direction."

High Alps (>2500m):
"0.0 days/decade (p = 0.22). Year-round snow at ~365 days. Completely stable."

**Key Takeaway Box:**
"Snow loss is concentrated where temperature crosses the freezing threshold. The higher you go, the safer the snow — but low elevations are where people live, farm, and ski."

**Data Source:**
ERA5 Reanalysis via Open-Meteo | Red dashed line = Sen's slope trend | Yellow line = Pettitt change point

---

## SLIDE 7: VIZ 3 — STATISTICAL EVIDENCE

**Title:** Three Independent Tests, One Conclusion

**IMAGE (~50% of slide):**
Screenshot of the 3 Statistical Evidence cards from the Snow Trends page (Mann-Kendall, Pettitt, Correlation)

**Caption:**
"Statistical evidence dashboard for Low Alps (<1500m). Each card shows a different test on the same 25-year time series with p-values and mini-visualizations."

**Below image — Three column explanations:**

**Mann-Kendall Trend Test:**
Non-parametric trend test — the gold standard for environmental time series. Confirms decline of -21.6 days/decade. p = 0.005449 means 99.5% confidence this is not random noise.

**Pettitt Change Point Test:**
Detects 2013 as the year decline accelerated. Mean snow cover: 161.9 days before 2013 vs 126.6 days after — a loss of 35 days in one decade. p = 0.0068.

**Pearson Temperature Correlation:**
R = -0.828 (strong inverse relationship). R-squared = 0.685, meaning temperature alone explains 69% of all snow cover variation. As Alpine temperatures rose ~1.5 degrees C, snow declined proportionally.

---

## SLIDE 8: VIZ 4 — SEASONAL HEATMAP

**Title:** Which Months Are Losing Snow?

**IMAGE (~55% of slide):**
Screenshot of the Seasonal Decomposition Heatmap from the Snow Trends page

**Caption:**
"Heatmap: monthly snow cover by year (2000-2024). Brighter blue = more snow, dark = less/no snow. Real monthly snowfall averages from Low Alps ERA5 stations."

**Annotations (describe arrow placements for the person building slides):**
- Arrow pointing to Jun-Aug dark columns: "Summer — no snow (expected)"
- Arrow pointing to May column getting darker over years: "May: spring snow ending earlier each decade"
- Arrow pointing to Oct-Nov: "Fall snow arriving later — shoulder season shrinking"
- Arrow pointing to Jan-Mar comparing 2000s vs 2020s: "Peak winter showing less intensity recently"

**Key Takeaway Box:**
"Winter isn't just getting shorter — it's shrinking from both ends. Spring snow ends earlier, fall snow arrives later, compressing the viable season."

**Data Source:**
Real monthly snowfall data from ERA5 stations

---

## SLIDE 9: VIZ 5 — ARIMA PROJECTIONS

**Title:** What the Future Holds

**IMAGE (~45% of slide):**
Screenshot of the Projection chart from the Projections page (Low Alps, Current Trend) showing observed + projected + 95% CI

**Caption:**
"ARIMA(1,1,1) forecast for Low Alps snow cover. White = observed (2000-2024). Blue dashed = projected. Shaded = 95% confidence interval. 'Now' line at 2024."

**Scenario Comparison Table (bold numbers):**

| Scenario | Snow Days in 2050 | Change from Now |
|----------|------------------|-----------------|
| Current Trend | **118 days** | -9 days |
| Accelerated (RCP 8.5) | **122 days** | -13 days |
| Paris-Aligned (RCP 2.6) | **114 days** | -6 days |

**Text:**
Under ALL three scenarios, low-elevation Alpine areas face fewer than 4 months of viable snow by 2050. Mid Alps project 311 days (moderate decline). High Alps remain at 366 days (year-round, stable). The divergence between elevation bands will only widen.

The ARIMA model was fitted on real ERA5 station data. RCP scenarios apply IPCC-based multipliers to the base projection.

**Data Source:**
ARIMA forecast on ERA5 data | statsmodels library | 3 IPCC scenario multipliers

---

## SLIDE 10: VIZ 6 — FACT CHECKER

**Title:** Enter Any Claim. Get a Verdict.

**IMAGES (3 screenshots tiled — each showing a verdict from the Fact Checker page):**

1. Claim: "Snow levels in the Alps have remained stable"
   Result: REFUTED | 99% confidence

2. Claim: "Snow decline is driven by rising temperatures"
   Result: SUPPORTED | 69% confidence

3. Claim: "This winter had record snowfall so climate change is not real"
   Result: REFUTED | 97% confidence

**Captions under each:**
1. "Verdict based on Mann-Kendall p = 0.005 and -21.6 days/decade measured decline"
2. "Verdict based on Pearson R = -0.828, temperature explains 69% of snow variation"
3. "Individual weather events don't negate 25-year climate trends (p = 0.005)"

**Text:**
AlpineVerify's Fact Checker matches claims against real statistical results from our ERA5 analysis. Each verdict includes: a confidence level from actual p-values, a plain-English explanation with specific numbers, and an evidence chart from real station data. Source citations appear at the bottom of every result. No GIS expertise required — built for journalists, educators, and policymakers.

**Footer:**
Try it live: alpineverify.vercel.app/fact-checker

---

## SLIDE 11: IMPACT

**Title:** Why This Matters — The Real-World Impact

**Layout: 5 sections with bold headers, icon-style layout**

**For Journalists & Media:**
Climate reporters can verify any claim about Alpine snow in seconds. AlpineVerify provides citation-ready charts with source attribution — p-values, station names, methodology. Ready to embed in articles. No more "he said, she said" — let the satellites settle it.

**For Policymakers & Government:**
The EU Climate Law and European Green Deal require evidence-based monitoring. Our statistical analysis directly supports Alpine Convention obligations and national climate adaptation plans. The 2013 change point gives a concrete, policy-relevant timeline for when things got worse.

**For Water Security — 170M+ People:**
Alpine snowmelt feeds the Rhine, Danube, Po, and Rhone rivers. Our projections show low-elevation snow dropping to 118 days by 2050, threatening hydropower (60% of Alpine energy), agriculture, and municipal water for 170M+ Europeans.

**For the Ski Industry:**
Low-elevation resorts (<1500m) face less than 4 months of viable snow by 2050. This helps the 70B+ euro European ski industry make data-driven decisions about snowmaking investment, diversification, and facility planning.

**Answering "So What?" for Satellite Data:**
ERA5 reanalysis is the only source providing consistent, gap-free, 25-year coverage across remote Alpine locations. Ground stations have missing data and inconsistent coverage. Satellite-assimilated reanalysis combines the best of both — and AlpineVerify makes it accessible to everyone, not just climate scientists.

**Design note:** Use icons or colored sidebar markers for each section. Make headers bold and prominent. This slide is text-heavy by necessity — use layout to make it scannable (maybe 2-column or card-style boxes).

---

## SLIDE 12: NEXT STEPS

**Title:** Where AlpineVerify Goes Next

**Layout: Three sections with headers**

**Immediate Enhancements:**
- Connect to Copernicus Climate Data Store (CDS) for gridded satellite imagery — pixel-level spatial resolution across the entire Alpine arc (API key already configured)
- Add NLP-powered claim matching — free-text input using natural language processing
- Integrate MODIS snow cover imagery for visual satellite map overlays

**Expansion:**
- Extend to other mountain regions: Pyrenees, Carpathians, Scandinavian mountains, Himalayas
- Add more elevation bands and increase station density
- Incorporate precipitation type classification (rain vs. snow transition)

**Partnerships & Deployment:**
- Partner with fact-checking organizations: AFP Fact Check, Climate Feedback, Full Fact
- Build a journalist API for embedding verdicts directly into news articles
- Collaborate with the European Environment Agency for official monitoring alignment

**UN Sustainable Development Goals (show SDG icons in a row):**
- SDG 13: Climate Action — evidence-based climate communication
- SDG 6: Clean Water — snowmelt projections for water security
- SDG 15: Life on Land — Alpine ecosystem monitoring
- SDG 4: Quality Education — free interactive teaching tool

**Links:**
Live: alpineverify.vercel.app
Code: github.com/Samudyata/AlpineVerify

---

## SLIDE 13: THANK YOU

**Center of slide — Big bold quote:**
"-21.6 days per decade. R = -0.828. p = 0.005."

**Below quote:**
"These aren't opinions. This is what the satellites see."

**Below that:**
AlpineVerify — Making climate evidence accessible to everyone.

**Links:**
Live Demo: alpineverify.vercel.app
Source Code: github.com/Samudyata/AlpineVerify

**Bottom:**
Team #3 | Samudyata, Chinmayi, Shambhavi | Arizona State University
SpaceHACK for Sustainability 2026 | Track: AIB

---

## SCREENSHOTS NEEDED FROM THE APP

Take these from https://alpineverify.vercel.app/:

1. **Homepage hero** (for Slide 1 background option) — full page screenshot
2. **3D Surface Plot** (Slide 5) — Snow Trends page, scroll to the 3D surface, rotate to a good angle
3. **Low Alps Trend Chart** (Slide 6) — Snow Trends page, Low Alps tab selected
4. **Mid Alps Trend Chart** (Slide 6) — Mid Alps tab
5. **High Alps Trend Chart** (Slide 6) — High Alps tab
6. **Statistical Evidence Cards** (Slide 7) — Snow Trends page, scroll to the 3 stat cards
7. **Seasonal Heatmap** (Slide 8) — Snow Trends page, scroll to Seasonal Decomposition
8. **Projection Chart** (Slide 9) — Projections page, Low Alps + Current Trend selected
9. **Fact Checker: "Snow stable"** (Slide 10) — Fact Checker page, first claim result
10. **Fact Checker: "Temperature driven"** (Slide 10) — second claim
11. **Fact Checker: "Record snowfall"** (Slide 10) — third claim
