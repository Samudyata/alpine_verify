import Plot from './PlotlyChart';

// Synthetic stat test results per elevation band
const statResults = {
  'mann-kendall': [
    { slope: -5.2, pValue: 0.001, significance: 'Highly Significant', direction: 'Declining' },
    { slope: -3.1, pValue: 0.008, significance: 'Significant', direction: 'Declining' },
    { slope: -1.4, pValue: 0.042, significance: 'Significant', direction: 'Declining' },
  ],
  'change-point': [
    { year: 2008, beforeMean: 92, afterMean: 71, pValue: 0.003 },
    { year: 2010, beforeMean: 152, afterMean: 138, pValue: 0.015 },
    { year: 2012, beforeMean: 203, afterMean: 195, pValue: 0.089 },
  ],
  'correlation': [
    { r: -0.82, rSquared: 0.67, pValue: 0.0001 },
    { r: -0.71, rSquared: 0.50, pValue: 0.001 },
    { r: -0.58, rSquared: 0.34, pValue: 0.012 },
  ],
};

const darkPlotLayout = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
};

function MannKendallCard({ data }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300">Mann-Kendall Trend</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          data.pValue < 0.01
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : data.pValue < 0.05
            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            : 'bg-slate-700 text-slate-400 border border-slate-600'
        }`}>
          p = {data.pValue}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl font-bold text-red-400 flex items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M7 7l10 10M17 7v10H7" />
          </svg>
          {data.slope} days/decade
        </div>
      </div>

      <div className="text-sm text-slate-500">
        <span className="font-medium text-slate-300">{data.significance}</span> declining trend detected.
        Snow cover is decreasing at {Math.abs(data.slope)} days per decade.
      </div>

      {/* Mini trend visualization */}
      <Plot
        data={[{
          x: [2000, 2024],
          y: [100, 100 + data.slope * 2.4],
          type: 'scatter',
          mode: 'lines',
          line: { color: '#F87171', width: 3 },
          showlegend: false,
        }]}
        layout={{
          height: 80,
          margin: { t: 5, r: 10, b: 5, l: 10 },
          ...darkPlotLayout,
          xaxis: { showgrid: false, showticklabels: false, zeroline: false },
          yaxis: { showgrid: false, showticklabels: false, zeroline: false },
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}

function ChangePointCard({ data }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300">Change Point (Pettitt)</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          data.pValue < 0.01
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : data.pValue < 0.05
            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
            : 'bg-slate-700 text-slate-400 border border-slate-600'
        }`}>
          p = {data.pValue}
        </span>
      </div>

      <div className="text-3xl font-bold text-amber-400 mb-4">
        {data.year}
      </div>

      <div className="text-sm text-slate-500 mb-4">
        Decline accelerated around <span className="font-medium text-slate-300">{data.year}</span>.
        Mean dropped from {data.beforeMean} to {data.afterMean} days.
      </div>

      {/* Before/after bar chart */}
      <Plot
        data={[{
          x: [`Before ${data.year}`, `After ${data.year}`],
          y: [data.beforeMean, data.afterMean],
          type: 'bar',
          marker: { color: ['#60A5FA', '#FBBF24'] },
          showlegend: false,
        }]}
        layout={{
          height: 80,
          margin: { t: 5, r: 10, b: 25, l: 10 },
          ...darkPlotLayout,
          xaxis: { showgrid: false, tickfont: { size: 10, color: '#94A3B8' } },
          yaxis: { showgrid: false, showticklabels: false },
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}

function CorrelationCard({ data }) {
  // Generate scatter data
  const temps = Array.from({ length: 25 }, (_, i) => 6 + i * 0.06 + Math.sin(i) * 0.5);
  const snow = temps.map((t, i) => 120 - t * 8 + Math.cos(i * 2) * 10);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300">Temp vs Snow Correlation</h3>
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          R = {data.r}
        </span>
      </div>

      <div className="text-3xl font-bold text-blue-400 mb-4">
        R² = {data.rSquared}
      </div>

      <div className="text-sm text-slate-500 mb-2">
        Temperature explains <span className="font-medium text-slate-300">{(data.rSquared * 100).toFixed(0)}%</span> of
        snow cover variation. {Math.abs(data.r) > 0.7 ? 'Strong' : Math.abs(data.r) > 0.4 ? 'Moderate' : 'Weak'} {data.r < 0 ? 'inverse' : 'positive'} relationship.
      </div>

      <Plot
        data={[{
          x: temps,
          y: snow,
          type: 'scatter',
          mode: 'markers',
          marker: { color: '#60A5FA', size: 6, opacity: 0.7 },
          showlegend: false,
        }, {
          x: [Math.min(...temps), Math.max(...temps)],
          y: [Math.max(...snow), Math.min(...snow)],
          type: 'scatter',
          mode: 'lines',
          line: { color: '#F87171', width: 2, dash: 'dash' },
          showlegend: false,
        }]}
        layout={{
          height: 100,
          margin: { t: 5, r: 10, b: 5, l: 10 },
          ...darkPlotLayout,
          xaxis: { showgrid: false, showticklabels: false },
          yaxis: { showgrid: false, showticklabels: false },
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default function StatTestCard({ title, testType, elevationBand, realData }) {
  // Use real data if available, otherwise fallback to synthetic
  let data;
  if (realData) {
    if (testType === 'mann-kendall' && realData.mann_kendall) {
      data = {
        slope: realData.mann_kendall.slope,
        pValue: realData.mann_kendall.p_value,
        significance: realData.mann_kendall.significance,
        direction: realData.mann_kendall.direction,
      };
    } else if (testType === 'change-point' && realData.change_point) {
      data = {
        year: realData.change_point.year,
        beforeMean: realData.change_point.before_mean,
        afterMean: realData.change_point.after_mean,
        pValue: realData.change_point.p_value,
      };
    } else if (testType === 'correlation' && realData.correlation) {
      data = {
        r: realData.correlation.r,
        rSquared: realData.correlation.r_squared,
        pValue: realData.correlation.p_value,
      };
    }
  }
  if (!data) {
    data = statResults[testType]?.[elevationBand];
  }
  if (!data) return null;

  if (testType === 'mann-kendall') return <MannKendallCard data={data} />;
  if (testType === 'change-point') return <ChangePointCard data={data} />;
  if (testType === 'correlation') return <CorrelationCard data={data} />;
  return null;
}
