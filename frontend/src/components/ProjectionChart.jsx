import Plot from './PlotlyChart';
import { useMemo } from 'react';

function generateProjectionData(elevationBand, scenario) {
  const params = [
    { base: 85, decline: 1.1 },   // Low
    { base: 145, decline: 0.6 },  // Mid
    { base: 200, decline: 0.35 }, // High
  ][elevationBand];

  const scenarioMultiplier = [1.0, 1.5, 0.6][scenario];

  // Historical (2000-2024)
  const histYears = [];
  const histValues = [];
  for (let y = 2000; y <= 2024; y++) {
    histYears.push(y);
    const trend = params.base - params.decline * (y - 2000);
    const noise = (Math.sin(y * 3.7) + Math.cos(y * 2.3)) * 6;
    histValues.push(Math.max(0, trend + noise));
  }

  // Projected (2025-2050)
  const projYears = [];
  const projValues = [];
  const upperCI = [];
  const lowerCI = [];
  const lastHist = histValues[histValues.length - 1];
  const projDecline = params.decline * scenarioMultiplier;

  for (let y = 2025; y <= 2050; y++) {
    projYears.push(y);
    const val = lastHist - projDecline * (y - 2024);
    projValues.push(Math.max(0, val));
    const uncertainty = (y - 2024) * 1.5;
    upperCI.push(Math.max(0, val + uncertainty));
    lowerCI.push(Math.max(0, val - uncertainty));
  }

  return { histYears, histValues, projYears, projValues, upperCI, lowerCI };
}

const scenarioColors = ['#2563EB', '#DC2626', '#16A34A'];
const scenarioNames = ['Current Trend', 'Accelerated (RCP 8.5)', 'Paris-Aligned (RCP 2.6)'];

export default function ProjectionChart({ elevationBand, scenario }) {
  const data = useMemo(
    () => generateProjectionData(elevationBand, scenario),
    [elevationBand, scenario]
  );

  const color = scenarioColors[scenario];

  return (
    <Plot
      data={[
        // Confidence interval (fill between upper and lower)
        {
          x: [...data.projYears, ...data.projYears.slice().reverse()],
          y: [...data.upperCI, ...data.lowerCI.slice().reverse()],
          fill: 'toself',
          fillcolor: `${color}15`,
          line: { color: 'transparent' },
          name: '95% CI',
          showlegend: true,
          type: 'scatter',
        },
        // Historical
        {
          x: data.histYears,
          y: data.histValues,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Observed (2000-2024)',
          line: { color: '#475569', width: 2 },
          marker: { size: 4, color: '#475569' },
        },
        // Projection
        {
          x: data.projYears,
          y: data.projValues,
          type: 'scatter',
          mode: 'lines',
          name: `Projected - ${scenarioNames[scenario]}`,
          line: { color, width: 3, dash: 'dash' },
        },
      ]}
      layout={{
        height: 450,
        margin: { t: 30, r: 30, b: 50, l: 60 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'Inter, sans-serif', color: '#475569' },
        xaxis: {
          title: 'Year',
          gridcolor: '#F1F5F9',
          range: [1998, 2052],
        },
        yaxis: {
          title: 'Snow Cover Duration (days)',
          gridcolor: '#F1F5F9',
        },
        legend: {
          orientation: 'h',
          y: -0.15,
          x: 0.5,
          xanchor: 'center',
        },
        shapes: [
          {
            type: 'line',
            x0: 2024,
            x1: 2024,
            y0: 0,
            y1: 1,
            yref: 'paper',
            line: { color: '#94A3B8', width: 1, dash: 'dot' },
          },
        ],
        annotations: [
          {
            x: 2024,
            y: 1.02,
            yref: 'paper',
            text: 'Now',
            showarrow: false,
            font: { size: 11, color: '#94A3B8' },
          },
        ],
      }}
      config={{ responsive: true }}
      style={{ width: '100%' }}
    />
  );
}
