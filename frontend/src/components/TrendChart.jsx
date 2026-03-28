import Plot from './PlotlyChart';
import { useMemo } from 'react';

// Synthetic data - will be replaced by real CDS data
function generateTrendData(elevationBand) {
  const years = [];
  const values = [];
  const trendLine = [];

  // Base snow days and decline rate per elevation band
  const params = [
    { base: 85, decline: 1.1, noise: 8 },   // Low Alps
    { base: 145, decline: 0.6, noise: 10 },  // Mid Alps
    { base: 200, decline: 0.35, noise: 7 },  // High Alps
  ][elevationBand];

  for (let y = 2000; y <= 2024; y++) {
    years.push(y);
    const trend = params.base - params.decline * (y - 2000);
    const noise = (Math.sin(y * 3.7) + Math.cos(y * 2.3)) * params.noise;
    values.push(Math.max(0, trend + noise));
    trendLine.push(trend);
  }

  // Change point around 2010
  const changePointYear = 2010;

  return { years, values, trendLine, changePointYear };
}

export default function TrendChart({ elevationBand }) {
  const data = useMemo(() => generateTrendData(elevationBand), [elevationBand]);

  const slopePerDecade = useMemo(() => {
    const n = data.years.length;
    const first5 = data.values.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const last5 = data.values.slice(-5).reduce((a, b) => a + b, 0) / 5;
    return ((last5 - first5) / (n - 1) * 10).toFixed(1);
  }, [data]);

  return (
    <div>
      <Plot
        data={[
          {
            x: data.years,
            y: data.values,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Observed',
            line: { color: '#2563EB', width: 2 },
            marker: { size: 5, color: '#2563EB' },
          },
          {
            x: data.years,
            y: data.trendLine,
            type: 'scatter',
            mode: 'lines',
            name: 'Trend (Sen\'s slope)',
            line: { color: '#DC2626', width: 2, dash: 'dash' },
          },
        ]}
        layout={{
          height: 400,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { family: 'Inter, sans-serif', color: '#475569' },
          xaxis: {
            title: 'Year',
            gridcolor: '#F1F5F9',
            showgrid: true,
          },
          yaxis: {
            title: 'Snow Cover Duration (days)',
            gridcolor: '#F1F5F9',
            showgrid: true,
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
              x0: data.changePointYear,
              x1: data.changePointYear,
              y0: 0,
              y1: 1,
              yref: 'paper',
              line: { color: '#D97706', width: 2, dash: 'dot' },
            },
          ],
          annotations: [
            {
              x: data.changePointYear,
              y: 1.02,
              yref: 'paper',
              text: 'Change Point',
              showarrow: false,
              font: { size: 11, color: '#D97706' },
            },
            {
              x: 2020,
              y: data.values[data.values.length - 4],
              text: `${slopePerDecade} days/decade`,
              showarrow: true,
              arrowhead: 2,
              arrowcolor: '#DC2626',
              font: { size: 12, color: '#DC2626', weight: 'bold' },
              ax: 40,
              ay: -40,
            },
          ],
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
