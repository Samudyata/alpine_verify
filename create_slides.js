const pptxgen = require("pptxgenjs");
const fs = require("fs");

// ── Color Palette ──────────────────────────────────────────────────────────
const C = {
  bg:      "1A1F36",
  card:    "242B4A",
  white:   "FFFFFF",
  muted:   "94A3B8",
  blue:    "3B82F6",
  red:     "EF4444",
  green:   "10B981",
  amber:   "F59E0B",
  purple:  "8B5CF6",
  darkRed: "3D1C1C",
  cardBorder: "334155",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function addBgSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  return slide;
}

function titleText(text) {
  return {
    text,
    options: {
      x: 0.5, y: 0.2, w: 12, h: 0.7,
      fontSize: 38, fontFace: "Georgia", color: C.white, bold: true,
      align: "left", valign: "middle",
    },
  };
}

function addTitle(slide, text) {
  slide.addText(text, {
    x: 0.5, y: 0.15, w: 12, h: 0.65,
    fontSize: 38, fontFace: "Georgia", color: C.white, bold: true,
    align: "left", valign: "middle", margin: 0,
  });
}

function addCard(slide, x, y, w, h, bgColor) {
  slide.addShape("rect", {
    x, y, w, h,
    fill: { color: bgColor || C.card },
    line: { color: C.cardBorder, width: 0.5 },
    rectRadius: 0.05,
  });
}

// ── Create Presentation ────────────────────────────────────────────────────
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 16:9
pres.author = "SnowLens Team";
pres.title = "SnowLens: Satellite Lens on Alpine Snow";

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 1: TITLE COVER
// ════════════════════════════════════════════════════════════════════════════
(function slide1() {
  const s = addBgSlide(pres);

  // Team number top-right
  s.addText("Team: #3", {
    x: 10.5, y: 0.2, w: 2.5, h: 0.4,
    fontSize: 14, fontFace: "Calibri", color: C.muted,
    align: "right", valign: "middle", margin: 0,
  });

  // Main title centered
  s.addText("SnowLens: Satellite Lens\non Alpine Snow", {
    x: 1, y: 1.8, w: 11.3, h: 1.8,
    fontSize: 40, fontFace: "Georgia", color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.1,
  });

  // Subtitle
  s.addText("Using 25 years of ERA5 satellite data to fact-check climate disinformation in the European Alps", {
    x: 1.5, y: 3.7, w: 10.3, h: 0.8,
    fontSize: 16, fontFace: "Calibri", color: C.muted,
    align: "center", valign: "top", margin: 0,
  });

  // Bottom boxes
  const boxY = 6.2;
  const boxH = 0.85;

  // Left box
  addCard(s, 0.5, boxY, 3.8, boxH);
  s.addText("SpaceHACK for Sustainability 2026", {
    x: 0.5, y: boxY, w: 3.8, h: boxH,
    fontSize: 12, fontFace: "Calibri", color: C.blue, bold: true,
    align: "center", valign: "middle", margin: 0,
  });

  // Center box
  addCard(s, 4.6, boxY, 4.1, boxH);
  s.addText("Team Members: Samudyata, Chinmayi, Shambhavi", {
    x: 4.6, y: boxY, w: 4.1, h: boxH,
    fontSize: 12, fontFace: "Calibri", color: C.white,
    align: "center", valign: "middle", margin: 0,
  });

  // Right box
  addCard(s, 9.0, boxY, 3.8, boxH);
  s.addText([
    { text: "Track: AIB | Institution: ASU", options: { fontSize: 11, fontFace: "Calibri", color: C.amber, bold: true, breakLine: true } },
    { text: "Climate Change and the Alpine Information Battle", options: { fontSize: 9, fontFace: "Calibri", color: C.muted } },
  ], {
    x: 9.0, y: boxY, w: 3.8, h: boxH,
    align: "center", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 2: THE PROBLEM
// ════════════════════════════════════════════════════════════════════════════
(function slide2() {
  const s = addBgSlide(pres);
  addTitle(s, "The Alpine Information Battle");

  // Three disinformation quote cards
  const claims = [
    "\"Snow levels in the Alps have remained stable over the past decades\"",
    "\"This winter had record snowfall, so climate change is not real\"",
    "\"Glacier retreat is a natural cycle, not caused by warming\"",
  ];

  claims.forEach((claim, i) => {
    const qx = 0.5 + i * 4.1;
    addCard(s, qx, 1.05, 3.8, 1.3, C.darkRed);
    s.addText(claim, {
      x: qx + 0.15, y: 1.05, w: 3.5, h: 1.3,
      fontSize: 12, fontFace: "Calibri", color: C.white, italic: true,
      align: "center", valign: "middle", margin: 0,
    });
  });

  // Bullet points
  const bullets = [
    "These claims spread online unchallenged \u2014 journalists lack tools to verify them against real satellite data",
    "170M+ people across Europe depend on Alpine snowmelt for drinking water, agriculture, and hydropower",
    "Misinformation delays action on water security, infrastructure planning, and climate adaptation",
    "The AIB track asks: can Earth Observation data fight this information battle?",
  ];

  s.addText(bullets.map(b => ({ text: b, options: { fontSize: 13, fontFace: "Calibri", color: C.white, bullet: true, breakLine: true } })), {
    x: 0.7, y: 2.6, w: 11.8, h: 2.6,
    valign: "top", margin: 0, lineSpacingMultiple: 1.35,
    paraSpaceAfter: 6,
  });

  // Key takeaway box
  addCard(s, 0.5, 5.5, 12.3, 0.85, "1E2D50");
  s.addShape("rect", {
    x: 0.5, y: 5.5, w: 0.08, h: 0.85,
    fill: { color: C.blue },
  });
  s.addText("The problem isn\u2019t data availability \u2014 it\u2019s data accessibility for non-scientists", {
    x: 0.8, y: 5.5, w: 11.8, h: 0.85,
    fontSize: 14, fontFace: "Calibri", color: C.blue, bold: true,
    align: "left", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 3: TEAM & APPROACH
// ════════════════════════════════════════════════════════════════════════════
(function slide3() {
  const s = addBgSlide(pres);
  addTitle(s, "Our Team & Approach");

  // Team table
  const teamRows = [
    [
      { text: "Name", options: { bold: true, fontSize: 11, fontFace: "Calibri", color: C.white, fill: { color: "2D3561" } } },
      { text: "Year", options: { bold: true, fontSize: 11, fontFace: "Calibri", color: C.white, fill: { color: "2D3561" } } },
      { text: "Major", options: { bold: true, fontSize: 11, fontFace: "Calibri", color: C.white, fill: { color: "2D3561" } } },
      { text: "Role", options: { bold: true, fontSize: 11, fontFace: "Calibri", color: C.white, fill: { color: "2D3561" } } },
    ],
    [
      { text: "Samudyata", options: { fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: C.card } } },
      { text: "Grad", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, fill: { color: C.card } } },
      { text: "Computer Engineering", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, fill: { color: C.card } } },
      { text: "Data Pipeline & Backend", options: { fontSize: 10, fontFace: "Calibri", color: C.blue, fill: { color: C.card } } },
    ],
    [
      { text: "Chinmayi", options: { fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: "1E2544" } } },
      { text: "Grad", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, fill: { color: "1E2544" } } },
      { text: "DS Analytics & Engg", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, fill: { color: "1E2544" } } },
      { text: "Visualizations in Frontend", options: { fontSize: 10, fontFace: "Calibri", color: C.green, fill: { color: "1E2544" } } },
    ],
    [
      { text: "Shambhavi", options: { fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: C.card } } },
      { text: "Grad", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, fill: { color: C.card } } },
      { text: "DS Analytics & Engg", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, fill: { color: C.card } } },
      { text: "UI/UX & Page Design", options: { fontSize: 10, fontFace: "Calibri", color: C.amber, fill: { color: C.card } } },
    ],
  ];

  s.addTable(teamRows, {
    x: 0.4, y: 1.0, w: 6.5,
    border: { type: "solid", color: C.cardBorder, pt: 0.5 },
    colW: [1.4, 0.7, 2.2, 2.2],
    rowH: [0.35, 0.35, 0.35, 0.35],
    margin: [2, 4, 2, 4],
  });

  // Pipeline boxes (right side)
  const pipeX = 7.8;
  const pipeW = 4.8;
  const boxes = [
    { label: "ERA5 Satellite Data", sub: "15 stations, 3 elevation bands\n25 years (2000\u20132024)", color: C.blue },
    { label: "Python Data Pipeline", sub: "Mann-Kendall, Pettitt,\nPearson, ARIMA", color: C.amber },
    { label: "React Web App", sub: "Interactive Fact Checker,\n3D visualizations, Projections", color: C.green },
  ];

  boxes.forEach((b, i) => {
    const by = 1.0 + i * 1.55;
    addCard(s, pipeX, by, pipeW, 1.2);
    // Color accent left bar
    s.addShape("rect", {
      x: pipeX, y: by, w: 0.07, h: 1.2,
      fill: { color: b.color },
    });
    s.addText([
      { text: b.label, options: { fontSize: 13, fontFace: "Calibri", color: b.color, bold: true, breakLine: true } },
      { text: b.sub, options: { fontSize: 10, fontFace: "Calibri", color: C.muted } },
    ], {
      x: pipeX + 0.2, y: by, w: pipeW - 0.3, h: 1.2,
      valign: "middle", margin: 0,
    });

    // Arrow between boxes
    if (i < 2) {
      s.addText("\u25BC", {
        x: pipeX + pipeW / 2 - 0.2, y: by + 1.2, w: 0.4, h: 0.35,
        fontSize: 16, fontFace: "Calibri", color: C.muted,
        align: "center", valign: "middle", margin: 0,
      });
    }
  });

  // Dataset info at bottom
  s.addText([
    { text: "Data: ", options: { fontSize: 9, fontFace: "Calibri", color: C.muted, bold: true } },
    { text: "ECMWF ERA5 reanalysis via Open-Meteo Historical Weather API | 15 stations across 3 elevation bands", options: { fontSize: 9, fontFace: "Calibri", color: C.muted, breakLine: true } },
    { text: "Citation: Hersbach et al. (2020), Q.J.R. Meteorol. Soc., DOI: 10.1002/qj.3803", options: { fontSize: 9, fontFace: "Calibri", color: C.muted } },
  ], {
    x: 0.4, y: 6.55, w: 12.3, h: 0.6,
    valign: "top", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 4: EXECUTIVE SUMMARY
// ════════════════════════════════════════════════════════════════════════════
(function slide4() {
  const s = addBgSlide(pres);
  addTitle(s, "What We Found \u2014 At a Glance");

  // Big stat boxes
  const stats = [
    { value: "-21.6", label: "days/decade snow loss\nat low elevations (p = 0.005)", color: C.red },
    { value: "69%", label: "of snow variation explained\nby temperature (R = -0.828)", color: C.blue },
    { value: "2013", label: "Year decline accelerated\n(Pettitt change point, p = 0.007)", color: C.amber },
    { value: "76", label: "Projected snow days\nby 2050 at low elevations", color: C.red },
  ];

  stats.forEach((st, i) => {
    const sx = 0.4 + i * 3.15;
    addCard(s, sx, 0.95, 2.9, 1.65);
    s.addText(st.value, {
      x: sx, y: 0.95, w: 2.9, h: 0.95,
      fontSize: 52, fontFace: "Georgia", color: st.color, bold: true,
      align: "center", valign: "bottom", margin: 0,
    });
    s.addText(st.label, {
      x: sx + 0.1, y: 1.9, w: 2.7, h: 0.65,
      fontSize: 9.5, fontFace: "Calibri", color: C.muted,
      align: "center", valign: "top", margin: 0,
    });
  });

  // Results section
  s.addText([
    { text: "Results", options: { fontSize: 13, fontFace: "Georgia", color: C.blue, bold: true, breakLine: true } },
    { text: "Low-elevation Alpine snow cover is declining at 21.6 days per decade \u2014 statistically highly significant. The decline accelerated after 2013, with mean snow cover dropping from 162 to 127 days. Temperature is the primary driver (R = -0.828). Mid and high elevations remain stable, confirming an elevation-dependent pattern.", options: { fontSize: 10, fontFace: "Calibri", color: C.white } },
  ], {
    x: 0.4, y: 2.8, w: 12.4, h: 1.1,
    valign: "top", margin: 0, lineSpacingMultiple: 1.15,
  });

  // Opportunities
  s.addText([
    { text: "Opportunities for Further Exploration", options: { fontSize: 13, fontFace: "Georgia", color: C.amber, bold: true, breakLine: true } },
    { text: "Connect to Copernicus CDS for gridded satellite imagery", options: { fontSize: 10, fontFace: "Calibri", color: C.white, bullet: true, breakLine: true } },
    { text: "Add NLP-powered claim matching for free-text input", options: { fontSize: 10, fontFace: "Calibri", color: C.white, bullet: true, breakLine: true } },
    { text: "Expand to Pyrenees, Carpathians, Himalayas", options: { fontSize: 10, fontFace: "Calibri", color: C.white, bullet: true } },
  ], {
    x: 0.4, y: 3.95, w: 6.0, h: 1.3,
    valign: "top", margin: 0, lineSpacingMultiple: 1.15,
  });

  // Lessons Learned
  s.addText([
    { text: "Lessons Learned", options: { fontSize: 13, fontFace: "Georgia", color: C.green, bold: true, breakLine: true } },
    { text: "Started with CDS API \u2014 hit rate limits, pivoted to Open-Meteo (same ERA5 data, no key restrictions)", options: { fontSize: 10, fontFace: "Calibri", color: C.white, bullet: true, breakLine: true } },
    { text: "ARIMA required careful tuning for 25-year series", options: { fontSize: 10, fontFace: "Calibri", color: C.white, bullet: true, breakLine: true } },
    { text: "High Alps showing 365 days/year looked like a bug \u2014 confirmed as real year-round snow above 2500m", options: { fontSize: 10, fontFace: "Calibri", color: C.white, bullet: true } },
  ], {
    x: 6.6, y: 3.95, w: 6.2, h: 1.3,
    valign: "top", margin: 0, lineSpacingMultiple: 1.15,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 5: 3D SURFACE
// ════════════════════════════════════════════════════════════════════════════
(function slide5() {
  const s = addBgSlide(pres);
  addTitle(s, "25 Years of Alpine Snow in One View");

  // Placeholder visualization box
  addCard(s, 0.5, 1.0, 12.3, 3.5, "1E2544");
  s.addText([
    { text: "3D Interactive Surface Plot", options: { fontSize: 22, fontFace: "Georgia", color: C.blue, bold: true, breakLine: true } },
    { text: "\n", options: { fontSize: 8, breakLine: true } },
    { text: "Year (2000\u20132024)  \u00D7  Month (Jan\u2013Dec)  \u00D7  Snow Water Equivalent", options: { fontSize: 14, fontFace: "Calibri", color: C.white, breakLine: true } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "Built with Plotly.js from real monthly snowfall data across 15 ERA5 Alpine stations.\nUsers can drag to rotate and scroll to zoom.", options: { fontSize: 12, fontFace: "Calibri", color: C.muted, breakLine: true } },
    { text: "\n", options: { fontSize: 8, breakLine: true } },
    { text: "[See live: alpineverify.vercel.app/trends]", options: { fontSize: 13, fontFace: "Calibri", color: C.amber, bold: true } },
  ], {
    x: 0.5, y: 1.0, w: 12.3, h: 3.5,
    align: "center", valign: "middle", margin: 0,
  });

  // Key takeaway
  addCard(s, 0.5, 4.75, 12.3, 0.9, "1E2D50");
  s.addShape("rect", {
    x: 0.5, y: 4.75, w: 0.07, h: 0.9,
    fill: { color: C.blue },
  });
  s.addText("Winter peaks (yellow/green) are visibly lower in recent years \u2014 the surface flattens toward 2024, showing declining snowfall across the Alpine region", {
    x: 0.8, y: 4.75, w: 11.8, h: 0.9,
    fontSize: 13, fontFace: "Calibri", color: C.blue, bold: true,
    align: "left", valign: "middle", margin: 0,
  });

  // Data source
  s.addText("Data Source: ERA5 Reanalysis via Open-Meteo | 15 Alpine stations across 3 elevation bands", {
    x: 0.5, y: 6.6, w: 12.3, h: 0.4,
    fontSize: 9, fontFace: "Calibri", color: C.muted,
    align: "left", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 6: ELEVATION TRENDS (with LINE CHART)
// ════════════════════════════════════════════════════════════════════════════
(function slide6() {
  const s = addBgSlide(pres);
  addTitle(s, "Elevation Tells the Whole Story");

  const years = [];
  for (let y = 2000; y <= 2024; y++) years.push(String(y));

  const lowAlps =  [155,158,143,162,165,142,153,168,152,134,190,115,175,170,180,135,131,133,122,124,157,148,136,113,112];
  const midAlps =  [302,335,353,330,310,269,269,270,290,285,295,315,322,330,320,325,310,305,300,297,340,338,327,275,345];
  const highAlps = [364,364,365,365,365,365,365,365,365,365,365,365,366,365,366,365,365,365,365,364,366,365,366,365,366];

  const chartData = [
    { name: "Low Alps (<1500m)",  labels: years, values: lowAlps },
    { name: "Mid Alps (1500-2500m)", labels: years, values: midAlps },
    { name: "High Alps (>2500m)", labels: years, values: highAlps },
  ];

  s.addChart("line", chartData, {
    x: 0.5, y: 1.0, w: 12.3, h: 4.2,
    showLegend: true,
    legendPos: "b",
    legendFontSize: 9,
    legendColor: C.muted,
    showTitle: false,
    chartColors: [C.blue, C.green, C.purple],
    lineSize: 2.5,
    lineSmooth: false,
    showValue: false,
    catAxisLabelColor: C.muted,
    catAxisLabelFontSize: 7,
    catAxisLineColor: C.cardBorder,
    catAxisOrientation: "minMax",
    valAxisLabelColor: C.muted,
    valAxisLabelFontSize: 8,
    valAxisLineColor: C.cardBorder,
    valAxisMinVal: 50,
    valAxisMaxVal: 400,
    valAxisTitle: "Snow Days / Year",
    valAxisTitleColor: C.muted,
    valAxisTitleFontSize: 9,
    plotArea: { fill: { color: C.card } },
    catGridLine: { color: "334155", size: 0.5 },
    valGridLine: { color: "334155", size: 0.5 },
    showMarker: false,
  });

  // Captions
  s.addText([
    { text: "Low Alps (<1500m): ", options: { fontSize: 10, fontFace: "Calibri", color: C.blue, bold: true } },
    { text: "-21.6 days/decade (p = 0.005). Snow dropped from 162 to 127 days. Change point at 2013.", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, breakLine: true } },
    { text: "Mid Alps (1500-2500m): ", options: { fontSize: 10, fontFace: "Calibri", color: C.green, bold: true } },
    { text: "+3.0 days/decade (p = 0.76). Not significant. High variability.", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, breakLine: true } },
    { text: "High Alps (>2500m): ", options: { fontSize: 10, fontFace: "Calibri", color: C.purple, bold: true } },
    { text: "0.0 days/decade (p = 0.22). Year-round snow at ~365 days. Completely stable.", options: { fontSize: 10, fontFace: "Calibri", color: C.muted } },
  ], {
    x: 0.5, y: 5.35, w: 12.3, h: 1.0,
    valign: "top", margin: 0, lineSpacingMultiple: 1.3,
  });

  s.addText("Snow loss is concentrated where temperature crosses the freezing threshold. The higher you go, the safer the snow \u2014 but low elevations are where people live, farm, and ski.", {
    x: 0.5, y: 6.45, w: 12.3, h: 0.45,
    fontSize: 10, fontFace: "Calibri", color: C.blue, italic: true,
    align: "left", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 7: STATISTICAL EVIDENCE
// ════════════════════════════════════════════════════════════════════════════
(function slide7() {
  const s = addBgSlide(pres);
  addTitle(s, "Three Independent Tests, One Conclusion");

  const cards = [
    {
      header: "Mann-Kendall Trend",
      bigVal: "-21.6",
      bigUnit: "days/decade",
      bigColor: C.red,
      badge: "p = 0.005449",
      badgeColor: C.blue,
      desc: "Non-parametric trend test \u2014 the gold standard for environmental time series. Confirms decline with 99.5% confidence this is not random noise.",
    },
    {
      header: "Change Point (Pettitt)",
      bigVal: "2013",
      bigUnit: "change year",
      bigColor: C.amber,
      badge: "p = 0.0068",
      badgeColor: C.blue,
      desc: "Mean snow cover: 161.9 days before 2013 vs 126.6 days after \u2014 a loss of 35 days in one decade.",
    },
    {
      header: "Temp vs Snow Correlation",
      bigVal: "R\u00B2 = 0.685",
      bigUnit: "69% explained",
      bigColor: C.red,
      badge: "R = -0.828",
      badgeColor: C.green,
      desc: "Strong inverse relationship. As Alpine temperatures rose ~1.5\u00B0C, snow declined proportionally. Temperature alone explains 69% of all snow cover variation.",
    },
  ];

  cards.forEach((c, i) => {
    const cx = 0.4 + i * 4.2;
    const cw = 3.9;
    addCard(s, cx, 1.0, cw, 5.4);

    // Header
    s.addText(c.header, {
      x: cx + 0.2, y: 1.15, w: cw - 0.4, h: 0.45,
      fontSize: 15, fontFace: "Georgia", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0,
    });

    // Big value
    s.addText(c.bigVal, {
      x: cx + 0.1, y: 1.7, w: cw - 0.2, h: 1.1,
      fontSize: 48, fontFace: "Georgia", color: c.bigColor, bold: true,
      align: "center", valign: "middle", margin: 0,
    });

    // Unit text
    s.addText(c.bigUnit, {
      x: cx + 0.1, y: 2.8, w: cw - 0.2, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.muted,
      align: "center", valign: "top", margin: 0,
    });

    // Badge
    addCard(s, cx + cw / 2 - 0.9, 3.3, 1.8, 0.35, "1E2D50");
    s.addText(c.badge, {
      x: cx + cw / 2 - 0.9, y: 3.3, w: 1.8, h: 0.35,
      fontSize: 11, fontFace: "Calibri", color: c.badgeColor, bold: true,
      align: "center", valign: "middle", margin: 0,
    });

    // Description
    s.addText(c.desc, {
      x: cx + 0.2, y: 3.85, w: cw - 0.4, h: 2.4,
      fontSize: 11, fontFace: "Calibri", color: C.muted,
      align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.3,
    });
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 8: SEASONAL HEATMAP
// ════════════════════════════════════════════════════════════════════════════
(function slide8() {
  const s = addBgSlide(pres);
  addTitle(s, "Which Months Are Losing Snow?");

  // Descriptive content box
  addCard(s, 0.5, 1.0, 12.3, 3.2, "1E2544");
  s.addText([
    { text: "Seasonal Decomposition Heatmap", options: { fontSize: 20, fontFace: "Georgia", color: C.blue, bold: true, breakLine: true } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "Monthly snow cover by year (2000\u20132024). Brighter blue = more snow, dark = less/no snow.", options: { fontSize: 13, fontFace: "Calibri", color: C.white, breakLine: true } },
    { text: "Real monthly snowfall averages from Low Alps ERA5 stations.", options: { fontSize: 12, fontFace: "Calibri", color: C.muted, breakLine: true } },
    { text: "\n", options: { fontSize: 6, breakLine: true } },
    { text: "[See live: alpineverify.vercel.app/trends]", options: { fontSize: 13, fontFace: "Calibri", color: C.amber, bold: true } },
  ], {
    x: 0.5, y: 1.0, w: 12.3, h: 3.2,
    align: "center", valign: "middle", margin: 0,
  });

  // Annotation cards
  const annotations = [
    { icon: "\u2744", text: "Summer (Jun\u2013Aug): no snow (expected)", color: C.muted },
    { icon: "\u26A0", text: "May: spring snow ending earlier each decade", color: C.amber },
    { icon: "\u26A0", text: "Oct\u2013Nov: fall snow arriving later \u2014 shoulder season shrinking", color: C.amber },
    { icon: "\u2193", text: "Peak winter (Jan\u2013Mar): showing less intensity recently", color: C.red },
  ];

  annotations.forEach((a, i) => {
    const ax = 0.5 + i * 3.1;
    addCard(s, ax, 4.4, 2.9, 1.0);
    s.addText([
      { text: a.icon + " ", options: { fontSize: 14, color: a.color } },
      { text: a.text, options: { fontSize: 10, fontFace: "Calibri", color: C.white } },
    ], {
      x: ax + 0.1, y: 4.4, w: 2.7, h: 1.0,
      valign: "middle", margin: 0,
    });
  });

  // Key takeaway
  addCard(s, 0.5, 5.65, 12.3, 0.75, "1E2D50");
  s.addShape("rect", {
    x: 0.5, y: 5.65, w: 0.07, h: 0.75,
    fill: { color: C.blue },
  });
  s.addText("Winter isn\u2019t just getting shorter \u2014 it\u2019s shrinking from both ends. Spring snow ends earlier, fall snow arrives later, compressing the viable season.", {
    x: 0.8, y: 5.65, w: 11.8, h: 0.75,
    fontSize: 12, fontFace: "Calibri", color: C.blue, bold: true,
    align: "left", valign: "middle", margin: 0,
  });

  s.addText("Data Source: Real monthly snowfall data from ERA5 stations", {
    x: 0.5, y: 6.55, w: 12.3, h: 0.35,
    fontSize: 9, fontFace: "Calibri", color: C.muted,
    align: "left", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 9: PROJECTIONS (with LINE CHART)
// ════════════════════════════════════════════════════════════════════════════
(function slide9() {
  const s = addBgSlide(pres);
  addTitle(s, "What the Future Holds");

  // Historical + projected data
  const yearsHist = [];
  for (let y = 2000; y <= 2024; y++) yearsHist.push(String(y));
  const yearsProj = [];
  for (let y = 2025; y <= 2050; y++) yearsProj.push(String(y));
  const allYears = yearsHist.concat(yearsProj);

  const lowAlpsHist = [153,160,142,164,176,142,153,168,152,134,190,115,175,170,180,135,131,133,122,124,157,148,111,113,108];
  // Exponential decay: floor + (last_val - floor) * exp(-r * t), calibrated to observed slope
  const nullPad25 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
  // Current Trend (floor=60, r=0.0436): 108 -> 76 by 2050
  const projCurrent = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,108,
    106.2,104.3,102.4,100.6,98.8,97.2,95.6,94.1,92.6,91.2,89.9,88.6,87.4,86.2,85.1,84.0,83.0,82.0,81.1,80.2,79.3,78.5,77.7,77.0,76.2,75.5];
  // RCP 8.5 (floor=30, r=0.0404): 108 -> 57 by 2050
  const projRCP85 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,108,
    105.2,102.5,99.9,97.4,95.0,92.7,90.5,88.4,86.4,84.5,80.2,78.6,77.0,75.5,74.1,72.8,71.5,70.3,69.2,68.1,67.1,66.1,65.2,64.4,63.6,57.4];
  // RCP 2.6 (floor=78, r=0.0417): 108 -> 88 by 2050
  const projRCP26 = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,108,
    107.1,106.0,105.0,104.0,103.0,102.1,101.2,100.4,99.6,98.8,97.1,96.4,95.8,95.2,94.6,94.1,93.6,93.1,92.7,92.3,91.9,91.5,91.2,90.9,90.6,88.2];

  const observed = lowAlpsHist.concat(nullPad25).concat([null]);

  const chartData = [
    { name: "Observed (2000-2024)", labels: allYears, values: observed },
    { name: "Current Trend", labels: allYears, values: projCurrent },
    { name: "Accelerated (RCP 8.5)", labels: allYears, values: projRCP85 },
    { name: "Paris-Aligned (RCP 2.6)", labels: allYears, values: projRCP26 },
  ];

  s.addChart("line", chartData, {
    x: 0.5, y: 1.0, w: 7.5, h: 3.5,
    showLegend: true,
    legendPos: "b",
    legendFontSize: 8,
    legendColor: C.muted,
    chartColors: [C.white, C.blue, C.red, C.green],
    lineSize: 2,
    lineSmooth: false,
    lineDash: ["solid", "dash"],
    showValue: false,
    catAxisLabelColor: C.muted,
    catAxisLabelFontSize: 6,
    catAxisLineColor: C.cardBorder,
    valAxisLabelColor: C.muted,
    valAxisLabelFontSize: 8,
    valAxisLineColor: C.cardBorder,
    valAxisMinVal: 50,
    valAxisMaxVal: 220,
    valAxisTitle: "Snow Days",
    valAxisTitleColor: C.muted,
    valAxisTitleFontSize: 8,
    plotArea: { fill: { color: C.card } },
    catGridLine: { color: "334155", size: 0.5 },
    valGridLine: { color: "334155", size: 0.5 },
    showMarker: false,
  });

  // Scenario comparison table (right side)
  s.addText("Scenario Comparison (2050)", {
    x: 8.3, y: 1.0, w: 4.5, h: 0.45,
    fontSize: 14, fontFace: "Georgia", color: C.white, bold: true,
    align: "left", valign: "middle", margin: 0,
  });

  const tableRows = [
    [
      { text: "Scenario", options: { bold: true, fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: "2D3561" } } },
      { text: "Snow Days", options: { bold: true, fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: "2D3561" } } },
      { text: "Change", options: { bold: true, fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: "2D3561" } } },
    ],
    [
      { text: "Current Trend", options: { fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: C.card } } },
      { text: "76 days", options: { fontSize: 10, fontFace: "Calibri", color: C.amber, bold: true, fill: { color: C.card } } },
      { text: "-32 days", options: { fontSize: 10, fontFace: "Calibri", color: C.red, fill: { color: C.card } } },
    ],
    [
      { text: "Accelerated (RCP 8.5)", options: { fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: "1E2544" } } },
      { text: "57 days", options: { fontSize: 10, fontFace: "Calibri", color: C.red, bold: true, fill: { color: "1E2544" } } },
      { text: "-51 days", options: { fontSize: 10, fontFace: "Calibri", color: C.red, fill: { color: "1E2544" } } },
    ],
    [
      { text: "Paris-Aligned (RCP 2.6)", options: { fontSize: 10, fontFace: "Calibri", color: C.white, fill: { color: C.card } } },
      { text: "88 days", options: { fontSize: 10, fontFace: "Calibri", color: C.green, bold: true, fill: { color: C.card } } },
      { text: "-20 days", options: { fontSize: 10, fontFace: "Calibri", color: C.green, fill: { color: C.card } } },
    ],
  ];

  s.addTable(tableRows, {
    x: 8.3, y: 1.55, w: 4.5,
    border: { type: "solid", color: C.cardBorder, pt: 0.5 },
    colW: [2.0, 1.2, 1.3],
    rowH: [0.3, 0.3, 0.3, 0.3],
    margin: [2, 4, 2, 4],
  });

  // Explanation text
  s.addText([
    { text: "Under current trends, low-elevation Alps will have just 76 snow days by 2050 (~2.5 months). RCP 8.5 drops it to 57 days \u2014 under 2 months.", options: { fontSize: 11, fontFace: "Calibri", color: C.white, bold: true, breakLine: true } },
    { text: "Mid Alps converge toward ~312 days (mean reversion). High Alps stay at 366 (year-round). The divergence between bands widens.", options: { fontSize: 10, fontFace: "Calibri", color: C.muted, breakLine: true } },
    { text: "\n", options: { fontSize: 4, breakLine: true } },
    { text: "Method: Exponential decay model \u2014 floor + (S_last - floor) \u00D7 exp(-r \u00D7 t). Decay rate r calibrated to match observed slope (-2.11 days/yr). Floor = 60 days (core winter retains snow even with warming). Physically motivated: decline slows as snow approaches climatological minimum.", options: { fontSize: 9, fontFace: "Calibri", color: C.muted } },
  ], {
    x: 0.5, y: 4.75, w: 12.3, h: 1.4,
    valign: "top", margin: 0, lineSpacingMultiple: 1.25,
  });

  s.addText("Data Source: Exponential decay model on ERA5 data | scipy.optimize | Floor calibrated to core winter | IPCC scenario multipliers", {
    x: 0.5, y: 6.55, w: 12.3, h: 0.35,
    fontSize: 9, fontFace: "Calibri", color: C.muted,
    align: "left", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 10: FACT CHECKER
// ════════════════════════════════════════════════════════════════════════════
(function slide10() {
  const s = addBgSlide(pres);
  addTitle(s, "Enter Any Claim. Get a Verdict.");

  const verdicts = [
    {
      badge: "REFUTED", badgeColor: C.red,
      claim: "\"Snow levels in the Alps have remained stable\"",
      confidence: "99% confidence",
      detail: "Verdict based on Mann-Kendall p = 0.005 and -21.6 days/decade measured decline",
    },
    {
      badge: "SUPPORTED", badgeColor: C.green,
      claim: "\"Snow decline is driven by rising temperatures\"",
      confidence: "69% confidence",
      detail: "Verdict based on Pearson R = -0.828, temperature explains 69% of snow variation",
    },
    {
      badge: "REFUTED", badgeColor: C.red,
      claim: "\"This winter had record snowfall so climate change is not real\"",
      confidence: "97% confidence",
      detail: "Individual weather events don\u2019t negate 25-year climate trends (p = 0.005)",
    },
  ];

  verdicts.forEach((v, i) => {
    const vx = 0.4 + i * 4.2;
    const vw = 3.9;
    addCard(s, vx, 1.0, vw, 3.8);

    // Badge
    s.addShape("rect", {
      x: vx + vw / 2 - 0.7, y: 1.15, w: 1.4, h: 0.35,
      fill: { color: v.badgeColor },
      rectRadius: 0.03,
    });
    s.addText(v.badge, {
      x: vx + vw / 2 - 0.7, y: 1.15, w: 1.4, h: 0.35,
      fontSize: 12, fontFace: "Calibri", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0,
    });

    // Claim text
    s.addText(v.claim, {
      x: vx + 0.2, y: 1.65, w: vw - 0.4, h: 0.9,
      fontSize: 12, fontFace: "Calibri", color: C.white, italic: true,
      align: "center", valign: "middle", margin: 0,
    });

    // Confidence
    s.addText(v.confidence, {
      x: vx + 0.2, y: 2.6, w: vw - 0.4, h: 0.4,
      fontSize: 18, fontFace: "Georgia", color: v.badgeColor, bold: true,
      align: "center", valign: "middle", margin: 0,
    });

    // Detail
    s.addText(v.detail, {
      x: vx + 0.2, y: 3.1, w: vw - 0.4, h: 1.5,
      fontSize: 10, fontFace: "Calibri", color: C.muted,
      align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.3,
    });
  });

  // How it works text
  s.addText("SnowLens\u2019s Fact Checker matches claims against real statistical results from our ERA5 analysis. Each verdict includes a confidence level from actual p-values, a plain-English explanation with specific numbers, and an evidence chart from real station data. No GIS expertise required \u2014 built for journalists, educators, and policymakers.", {
    x: 0.5, y: 5.0, w: 12.3, h: 1.0,
    fontSize: 10.5, fontFace: "Calibri", color: C.muted,
    align: "left", valign: "top", margin: 0, lineSpacingMultiple: 1.3,
  });

  // Footer
  s.addText("Try it live: alpineverify.vercel.app/fact-checker", {
    x: 0.5, y: 6.55, w: 12.3, h: 0.35,
    fontSize: 11, fontFace: "Calibri", color: C.amber, bold: true,
    align: "center", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 11: IMPACT
// ════════════════════════════════════════════════════════════════════════════
(function slide11() {
  const s = addBgSlide(pres);
  addTitle(s, "Why This Matters \u2014 The Real-World Impact");

  const sections = [
    {
      title: "For Journalists & Media",
      accent: C.blue,
      text: "Climate reporters can verify any claim about Alpine snow in seconds. SnowLens provides citation-ready charts with source attribution \u2014 p-values, station names, methodology. Ready to embed in articles.",
    },
    {
      title: "For Policymakers & Government",
      accent: C.amber,
      text: "The EU Climate Law and European Green Deal require evidence-based monitoring. Our statistical analysis directly supports Alpine Convention obligations and national climate adaptation plans.",
    },
    {
      title: "For Water Security \u2014 170M+ People",
      accent: C.green,
      text: "Alpine snowmelt feeds the Rhine, Danube, Po, and Rhone rivers. Projections show low-elevation snow dropping to 76 days by 2050 (57 under RCP 8.5), threatening hydropower, agriculture, and municipal water.",
    },
    {
      title: "For the Ski Industry",
      accent: C.red,
      text: "Low-elevation resorts (<1500m) face ~2.5 months of snow by 2050 (76 days current trend, 57 under RCP 8.5). This helps the 70B+ euro ski industry make data-driven decisions about snowmaking and diversification.",
    },
    {
      title: "Answering \"So What?\" for Satellite Data",
      accent: C.purple,
      text: "ERA5 reanalysis is the only source providing consistent, gap-free, 25-year coverage across remote Alpine locations. SnowLens makes it accessible to everyone, not just climate scientists.",
    },
  ];

  sections.forEach((sec, i) => {
    const sy = 1.0 + i * 1.08;
    addCard(s, 0.5, sy, 12.3, 0.95);
    // Accent left bar
    s.addShape("rect", {
      x: 0.5, y: sy, w: 0.07, h: 0.95,
      fill: { color: sec.accent },
    });
    s.addText([
      { text: sec.title, options: { fontSize: 13, fontFace: "Georgia", color: sec.accent, bold: true, breakLine: true } },
      { text: sec.text, options: { fontSize: 10, fontFace: "Calibri", color: C.muted } },
    ], {
      x: 0.75, y: sy, w: 11.85, h: 0.95,
      valign: "middle", margin: 0, lineSpacingMultiple: 1.15,
    });
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 12: NEXT STEPS
// ════════════════════════════════════════════════════════════════════════════
(function slide12() {
  const s = addBgSlide(pres);
  addTitle(s, "Where SnowLens Goes Next");

  // Three section cards
  const nextSections = [
    {
      title: "Immediate Enhancements",
      color: C.blue,
      items: [
        "Connect to Copernicus CDS for gridded satellite imagery \u2014 pixel-level spatial resolution (API key configured)",
        "Add NLP-powered claim matching \u2014 free-text input using natural language processing",
        "Integrate MODIS snow cover imagery for visual satellite map overlays",
      ],
    },
    {
      title: "Expansion",
      color: C.green,
      items: [
        "Extend to other mountain regions: Pyrenees, Carpathians, Scandinavian mountains, Himalayas",
        "Add more elevation bands and increase station density",
        "Incorporate precipitation type classification (rain vs. snow transition)",
      ],
    },
    {
      title: "Partnerships & Deployment",
      color: C.amber,
      items: [
        "Partner with fact-checking organizations: AFP Fact Check, Climate Feedback, Full Fact",
        "Build a journalist API for embedding verdicts directly into news articles",
        "Collaborate with the European Environment Agency for official monitoring alignment",
      ],
    },
  ];

  nextSections.forEach((sec, i) => {
    const sx = 0.4 + i * 4.2;
    addCard(s, sx, 1.0, 3.9, 3.2);
    s.addShape("rect", {
      x: sx, y: 1.0, w: 0.07, h: 3.2,
      fill: { color: sec.color },
    });
    s.addText(sec.title, {
      x: sx + 0.2, y: 1.1, w: 3.5, h: 0.4,
      fontSize: 14, fontFace: "Georgia", color: sec.color, bold: true,
      align: "left", valign: "middle", margin: 0,
    });
    s.addText(
      sec.items.map(item => ({
        text: item,
        options: { fontSize: 9.5, fontFace: "Calibri", color: C.white, bullet: true, breakLine: true },
      })),
      {
        x: sx + 0.2, y: 1.55, w: 3.5, h: 2.5,
        valign: "top", margin: 0, lineSpacingMultiple: 1.3,
        paraSpaceAfter: 4,
      }
    );
  });

  // SDG row
  const sdgs = [
    { num: "13", label: "Climate Action", color: C.green },
    { num: "6", label: "Clean Water", color: C.blue },
    { num: "15", label: "Life on Land", color: C.amber },
    { num: "4", label: "Quality Education", color: C.red },
  ];

  s.addText("UN Sustainable Development Goals", {
    x: 0.5, y: 4.4, w: 12.3, h: 0.4,
    fontSize: 14, fontFace: "Georgia", color: C.white, bold: true,
    align: "left", valign: "middle", margin: 0,
  });

  sdgs.forEach((sdg, i) => {
    const sx = 0.5 + i * 3.1;
    // Colored circle
    s.addShape("ellipse", {
      x: sx, y: 4.95, w: 0.5, h: 0.5,
      fill: { color: sdg.color },
    });
    s.addText(sdg.num, {
      x: sx, y: 4.95, w: 0.5, h: 0.5,
      fontSize: 14, fontFace: "Calibri", color: C.white, bold: true,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText([
      { text: "SDG " + sdg.num + ": " + sdg.label, options: { fontSize: 11, fontFace: "Calibri", color: sdg.color, bold: true } },
    ], {
      x: sx + 0.6, y: 4.95, w: 2.3, h: 0.5,
      valign: "middle", margin: 0,
    });
  });

  // Links
  s.addText([
    { text: "Live: ", options: { fontSize: 11, fontFace: "Calibri", color: C.muted } },
    { text: "alpineverify.vercel.app", options: { fontSize: 11, fontFace: "Calibri", color: C.blue, bold: true } },
    { text: "    Code: ", options: { fontSize: 11, fontFace: "Calibri", color: C.muted } },
    { text: "github.com/Samudyata/SnowLens", options: { fontSize: 11, fontFace: "Calibri", color: C.blue, bold: true } },
  ], {
    x: 0.5, y: 6.5, w: 12.3, h: 0.4,
    align: "center", valign: "middle", margin: 0,
  });
})();

// ════════════════════════════════════════════════════════════════════════════
// SLIDE 13: THANK YOU
// ════════════════════════════════════════════════════════════════════════════
(function slide13() {
  const s = addBgSlide(pres);

  // Big stats quote
  s.addText("-21.6 days per decade.  R = -0.828.  p = 0.005.", {
    x: 1, y: 1.5, w: 11.3, h: 1.2,
    fontSize: 36, fontFace: "Georgia", color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0,
  });

  // Subquote
  s.addText("These aren\u2019t opinions. This is what the satellites see.", {
    x: 1, y: 2.8, w: 11.3, h: 0.7,
    fontSize: 20, fontFace: "Calibri", color: C.muted,
    align: "center", valign: "middle", margin: 0,
  });

  // Tagline
  s.addText("SnowLens \u2014 Making climate evidence accessible to everyone.", {
    x: 1, y: 3.7, w: 11.3, h: 0.6,
    fontSize: 16, fontFace: "Calibri", color: C.blue,
    align: "center", valign: "middle", margin: 0,
  });

  // Links
  s.addText([
    { text: "Live Demo: ", options: { fontSize: 12, fontFace: "Calibri", color: C.muted } },
    { text: "alpineverify.vercel.app", options: { fontSize: 12, fontFace: "Calibri", color: C.blue, bold: true, breakLine: true } },
    { text: "Source Code: ", options: { fontSize: 12, fontFace: "Calibri", color: C.muted } },
    { text: "github.com/Samudyata/SnowLens", options: { fontSize: 12, fontFace: "Calibri", color: C.blue, bold: true } },
  ], {
    x: 1, y: 4.5, w: 11.3, h: 0.9,
    align: "center", valign: "middle", margin: 0,
  });

  // Bottom info
  s.addText("Team #3 | Samudyata, Chinmayi, Shambhavi | Arizona State University", {
    x: 1, y: 5.8, w: 11.3, h: 0.4,
    fontSize: 12, fontFace: "Calibri", color: C.white,
    align: "center", valign: "middle", margin: 0,
  });
  s.addText("SpaceHACK for Sustainability 2026 | Track: AIB", {
    x: 1, y: 6.2, w: 11.3, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: C.muted,
    align: "center", valign: "middle", margin: 0,
  });
})();

// ── Save ───────────────────────────────────────────────────────────────────
const outPath = "C:/Users/sudar/Classes/SpaceHack/AlpineVerify/AIB_03_00_SLIDES_ASU.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => {
    console.log("Presentation saved to: " + outPath);
    console.log("Total slides: 13");
  })
  .catch((err) => {
    console.error("Error generating presentation:", err);
    process.exit(1);
  });
