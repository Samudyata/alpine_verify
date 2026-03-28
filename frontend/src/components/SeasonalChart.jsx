import Plot from './PlotlyChart';
import { useMemo } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function generateSeasonalData(elevationBand) {
  const years = [];
  const zData = [];

  const peakMonths = [11, 0, 1, 2, 3]; // Nov-Mar have most snow
  const declineRate = [0.01, 0.015, 0.025][elevationBand]; // decline rate per year

  for (let y = 2000; y <= 2024; y++) {
    years.push(y);
    const row = [];
    for (let m = 0; m < 12; m++) {
      let base = 0;
      if (peakMonths.includes(m)) {
        base = [0.9, 0.95, 1.0, 0.85, 0.5][peakMonths.indexOf(m)];
      } else if (m === 4) {
        base = 0.3; // May
      } else if (m === 10) {
        base = 0.4; // October
      }

      // Apply decline over years (more in spring months)
      const springFactor = (m === 2 || m === 3 || m === 4) ? 2.5 : 1;
      const decline = declineRate * (y - 2000) * springFactor;
      const noise = Math.sin(y * 7 + m * 3) * 0.05;
      row.push(Math.max(0, Math.min(1, base - decline + noise)));
    }
    zData.push(row);
  }

  return { years, zData };
}

export default function SeasonalChart({ elevationBand }) {
  const data = useMemo(() => generateSeasonalData(elevationBand), [elevationBand]);

  return (
    <Plot
      data={[
        {
          z: data.zData,
          x: months,
          y: data.years,
          type: 'heatmap',
          colorscale: [
            [0, '#F8FAFC'],
            [0.3, '#BAE6FD'],
            [0.6, '#38BDF8'],
            [1, '#1D4ED8'],
          ],
          colorbar: {
            title: { text: 'Snow Cover', side: 'right' },
            tickvals: [0, 0.5, 1],
            ticktext: ['None', 'Partial', 'Full'],
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
        font: { family: 'Inter, sans-serif', color: '#475569' },
        xaxis: { title: 'Month' },
        yaxis: { title: 'Year', autorange: 'reversed' },
        annotations: [
          {
            x: 'Mar',
            y: 2020,
            text: 'March snow<br>declining fastest',
            showarrow: true,
            arrowhead: 2,
            arrowcolor: '#DC2626',
            font: { size: 11, color: '#DC2626' },
            ax: 60,
            ay: 0,
          },
        ],
      }}
      config={{ responsive: true }}
      style={{ width: '100%' }}
    />
  );
}
