import Plot from './PlotlyChart';
import { useMemo } from 'react';

// Generate 3D surface data: Year × Day of Year × Snow Water Equivalent
// Combines all elevation bands into one surface showing overall Alpine snow patterns
function generateSurfaceData() {
  const years = [];
  for (let y = 1990; y <= 2025; y++) years.push(y);

  const daysOfYear = [];
  for (let d = 1; d <= 365; d += 5) daysOfYear.push(d); // every 5 days for smoothness

  const z = []; // z[year_idx][day_idx] = SWE value

  for (let yi = 0; yi < years.length; yi++) {
    const row = [];
    const year = years[yi];
    const yearDecline = (year - 1990) * 0.4; // gradual decline over decades

    for (let di = 0; di < daysOfYear.length; di++) {
      const day = daysOfYear[di];

      // Snow season peaks in winter (day ~30-60), minimal in summer (day ~180-250)
      // Use a seasonal curve based on day of year
      let seasonal = 0;

      if (day <= 120) {
        // Jan-Apr: high snow, peak around day 60
        seasonal = 55 + 20 * Math.exp(-((day - 60) ** 2) / 2000);
      } else if (day <= 150) {
        // May: rapid melt
        seasonal = 55 * Math.exp(-((day - 120) ** 2) / 800);
      } else if (day <= 270) {
        // Jun-Sep: minimal snow
        seasonal = 2 + 3 * Math.sin((day - 150) * 0.01);
      } else if (day <= 320) {
        // Oct-Nov: snow building up
        seasonal = 5 + 30 * (1 - Math.exp(-((day - 270) ** 2) / 3000));
      } else {
        // Dec: full winter
        seasonal = 40 + 15 * ((day - 320) / 45);
      }

      // Add year-over-year decline (more in spring, less in deep winter)
      const springFactor = (day >= 60 && day <= 150) ? 2.0 : 1.0;
      const decline = yearDecline * springFactor;

      // Add realistic noise (different per year-day combo)
      const noise = Math.sin(year * 7.3 + day * 0.13) * 4
        + Math.cos(year * 3.1 + day * 0.07) * 3
        + Math.sin((year - 1990) * 0.8 + day * 0.05) * 2;

      // Acceleration after 2005
      const accel = year > 2005 ? (year - 2005) * 0.15 * springFactor : 0;

      const swe = Math.max(0, seasonal - decline - accel + noise);
      row.push(swe);
    }
    z.push(row);
  }

  return { years, daysOfYear, z };
}

export default function SnowSurface3D({ realData }) {
  const { years, daysOfYear, z } = useMemo(() => {
    if (realData && realData.years && realData.z) {
      return {
        years: realData.years,
        daysOfYear: realData.months || realData.daysOfYear,
        z: realData.z,
      };
    }
    return generateSurfaceData();
  }, [realData]);

  return (
    <Plot
      data={[
        {
          type: 'surface',
          x: daysOfYear,
          y: years,
          z: z,
          colorscale: [
            [0, '#1a0533'],
            [0.1, '#3b0f70'],
            [0.25, '#2a5fa5'],
            [0.4, '#21918c'],
            [0.55, '#5ec962'],
            [0.7, '#a8db34'],
            [0.85, '#dce319'],
            [1.0, '#fde725'],
          ],
          colorbar: {
            title: {
              text: 'Snow Water<br>Equivalent (in)',
              font: { color: '#94A3B8', size: 11, family: 'Georgia, serif' },
            },
            tickfont: { color: '#94A3B8', size: 10 },
            len: 0.6,
            thickness: 18,
            outlinewidth: 0,
          },
          contours: {
            z: {
              show: true,
              usecolormap: true,
              highlightcolor: '#ffffff20',
              project: { z: false },
            },
          },
          lighting: {
            ambient: 0.6,
            diffuse: 0.7,
            specular: 0.3,
            roughness: 0.5,
          },
          hovertemplate:
            'Year: %{y}<br>Day: %{x}<br>SWE: %{z:.1f} in<extra></extra>',
        },
      ]}
      layout={{
        height: 550,
        margin: { t: 10, r: 10, b: 10, l: 10 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { family: 'Georgia, Times New Roman, serif', color: '#94A3B8' },
        scene: {
          bgcolor: 'rgba(0,0,0,0)',
          xaxis: {
            title: { text: 'Day of Year', font: { size: 12 } },
            gridcolor: '#ffffff15',
            showbackground: true,
            backgroundcolor: 'rgba(15, 23, 42, 0.3)',
            color: '#94A3B8',
            tickvals: [1, 50, 100, 150, 200, 250, 300, 350],
          },
          yaxis: {
            title: { text: 'Year', font: { size: 12 } },
            gridcolor: '#ffffff15',
            showbackground: true,
            backgroundcolor: 'rgba(15, 23, 42, 0.3)',
            color: '#94A3B8',
            dtick: 5,
          },
          zaxis: {
            title: { text: 'SWE (in)', font: { size: 12 } },
            gridcolor: '#ffffff15',
            showbackground: true,
            backgroundcolor: 'rgba(15, 23, 42, 0.3)',
            color: '#94A3B8',
          },
          camera: {
            eye: { x: -1.6, y: -1.8, z: 0.8 },
            up: { x: 0, y: 0, z: 1 },
          },
          aspectratio: { x: 1.2, y: 1.5, z: 0.6 },
        },
      }}
      config={{
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['toImage', 'orbitRotation'],
      }}
      style={{ width: '100%' }}
    />
  );
}
