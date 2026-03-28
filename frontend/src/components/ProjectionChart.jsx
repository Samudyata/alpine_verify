import Plot from './PlotlyChart';
import { useMemo } from 'react';

// Synthetic fallback
function generateFallbackData(elevationBand, scenario) {
  const params = [
    { base: 85, decline: 1.1 },
    { base: 145, decline: 0.6 },
    { base: 200, decline: 0.35 },
  ][elevationBand];
  const scenarioMultiplier = [1.0, 1.5, 0.6][scenario];
  const histYears = [], histValues = [];
  for (let y = 2000; y <= 2024; y++) {
    histYears.push(y);
    const trend = params.base - params.decline * (y - 2000);
    const noise = (Math.sin(y * 3.7) + Math.cos(y * 2.3)) * 6;
    histValues.push(Math.max(0, trend + noise));
  }
  const projYears = [], projValues = [], upperCI = [], lowerCI = [];
  const lastHist = histValues[histValues.length - 1];
  const projDecline = params.decline * scenarioMultiplier;
  for (let y = 2025; y <= 2050; y++) {
    projYears.push(y);
    const val = lastHist - projDecline * (y - 2024);
    projValues.push(Math.max(0, val));
    const unc = (y - 2024) * 1.5;
    upperCI.push(Math.max(0, val + unc));
    lowerCI.push(Math.max(0, val - unc));
  }
  return { histYears, histValues, projYears, projValues, upperCI, lowerCI };
}

const scenarioColors = ['#60A5FA', '#F87171', '#4ADE80'];
const scenarioNames = ['Current Trend', 'Accelerated (RCP 8.5)', 'Paris-Aligned (RCP 2.6)'];

export default function ProjectionChart({ elevationBand, scenario, realData }) {
  const data = useMemo(() => {
    if (realData?.years && realData?.projections) {
      const scName = scenarioNames[scenario];
      const proj = realData.projections[scName];
      if (proj) {
        return {
          histYears: realData.years,
          histValues: realData.snow_days,
          projYears: proj.years,
          projValues: proj.values,
          upperCI: proj.upper_ci,
          lowerCI: proj.lower_ci,
        };
      }
    }
    return generateFallbackData(elevationBand, scenario);
  }, [elevationBand, scenario, realData]);

  const color = scenarioColors[scenario];
  const isReal = !!(realData?.projections);

  return (
    <div>
      <Plot
        data={[
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
          {
            x: data.histYears,
            y: data.histValues,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Observed (2000-2024)',
            line: { color: '#94A3B8', width: 2 },
            marker: { size: 4, color: '#94A3B8' },
          },
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
          font: { family: 'Georgia, Times New Roman, serif', color: '#94A3B8' },
          xaxis: { title: 'Year', gridcolor: '#1E293B', range: [1998, 2052], color: '#94A3B8' },
          yaxis: { title: 'Snow Cover Duration (days)', gridcolor: '#1E293B', color: '#94A3B8' },
          legend: { orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center', font: { color: '#94A3B8' } },
          shapes: [{ type: 'line', x0: 2024, x1: 2024, y0: 0, y1: 1, yref: 'paper', line: { color: '#475569', width: 1, dash: 'dot' } }],
          annotations: [{ x: 2024, y: 1.02, yref: 'paper', text: 'Now', showarrow: false, font: { size: 11, color: '#94A3B8' } }],
        }}
        config={{ responsive: true }}
        style={{ width: '100%' }}
      />
      <p className={`text-xs mt-2 text-center ${isReal ? 'text-green-400' : 'text-yellow-400'}`}>
        {isReal ? 'ARIMA projection based on real ERA5 station data' : 'Demo projection — run data pipeline for real data'}
      </p>
    </div>
  );
}
