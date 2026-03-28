import Plot from './PlotlyChart';
import { useMemo } from 'react';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Synthetic fallback
function generateFallbackData(elevationBand) {
  const years = [];
  const zData = [];
  const peakMonths = [11, 0, 1, 2, 3];
  const declineRate = [0.01, 0.015, 0.025][elevationBand];
  for (let y = 2000; y <= 2024; y++) {
    years.push(y);
    const row = [];
    for (let m = 0; m < 12; m++) {
      let base = 0;
      if (peakMonths.includes(m)) base = [0.9, 0.95, 1.0, 0.85, 0.5][peakMonths.indexOf(m)];
      else if (m === 4) base = 0.3;
      else if (m === 10) base = 0.4;
      const springFactor = (m === 2 || m === 3 || m === 4) ? 2.5 : 1;
      const decline = declineRate * (y - 2000) * springFactor;
      const noise = Math.sin(y * 7 + m * 3) * 0.05;
      row.push(Math.max(0, Math.min(1, base - decline + noise)));
    }
    zData.push(row);
  }
  return { years, zData };
}

export default function SeasonalChart({ elevationBand, realSurfaceData }) {
  const { years, zData, isReal } = useMemo(() => {
    if (realSurfaceData?.years && realSurfaceData?.z) {
      // Real data: normalize to 0-1 range for heatmap
      const allVals = realSurfaceData.z.flat().filter(v => v > 0);
      const maxVal = Math.max(...allVals, 1);
      const normalized = realSurfaceData.z.map(row =>
        row.map(v => Math.min(1, v / maxVal))
      );
      return { years: realSurfaceData.years, zData: normalized, isReal: true };
    }
    return { ...generateFallbackData(elevationBand), isReal: false };
  }, [elevationBand, realSurfaceData]);

  return (
    <div>
      <Plot
        data={[
          {
            z: zData,
            x: monthNames,
            y: years,
            type: 'heatmap',
            colorscale: [
              [0, '#0F172A'],
              [0.3, '#1E3A5F'],
              [0.6, '#3B82F6'],
              [1, '#93C5FD'],
            ],
            colorbar: {
              title: { text: 'Snow Cover', side: 'right', font: { color: '#94A3B8' } },
              tickvals: [0, 0.5, 1],
              ticktext: ['None', 'Partial', 'Full'],
              tickfont: { color: '#94A3B8' },
            },
            hoverongaps: false,
            hovertemplate: 'Year: %{y}<br>Month: %{x}<br>Coverage: %{z:.0%}<extra></extra>',
          },
        ]}
        layout={{
          height: 500,
          margin: { t: 30, r: 80, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { family: 'Georgia, Times New Roman, serif', color: '#94A3B8' },
          xaxis: { title: 'Month', color: '#94A3B8' },
          yaxis: { title: 'Year', autorange: 'reversed', color: '#94A3B8' },
        }}
        config={{ responsive: true }}
        style={{ width: '100%' }}
      />
      <p className={`text-xs mt-2 text-center ${isReal ? 'text-green-400' : 'text-yellow-400'}`}>
        {isReal ? 'Real monthly snowfall data from ERA5 stations' : 'Demo data — run data pipeline for real seasonal patterns'}
      </p>
    </div>
  );
}
