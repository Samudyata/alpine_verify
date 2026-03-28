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

function MannKendallCard({ data }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Mann-Kendall Trend</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          data.pValue < 0.01
            ? 'bg-red-50 text-red-600'
            : data.pValue < 0.05
            ? 'bg-yellow-50 text-yellow-600'
            : 'bg-gray-50 text-gray-600'
        }`}>
          p = {data.pValue}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl font-bold text-red-600 flex items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M7 7l10 10M17 7v10H7" />
          </svg>
          {data.slope} days/decade
        </div>
      </div>

      <div className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{data.significance}</span> declining trend detected.
        Snow cover is decreasing at {Math.abs(data.slope)} days per decade.
      </div>

      {/* Mini trend visualization */}
      <Plot
        data={[{
          x: [2000, 2024],
          y: [100, 100 + data.slope * 2.4],
          type: 'scatter',
          mode: 'lines',
          line: { color: '#DC2626', width: 3 },
          showlegend: false,
        }]}
        layout={{
          height: 80,
          margin: { t: 5, r: 10, b: 5, l: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
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
        <h3 className="text-sm font-semibold text-slate-700">Change Point (Pettitt)</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          data.pValue < 0.01
            ? 'bg-red-50 text-red-600'
            : data.pValue < 0.05
            ? 'bg-yellow-50 text-yellow-600'
            : 'bg-gray-50 text-gray-600'
        }`}>
          p = {data.pValue}
        </span>
      </div>

      <div className="text-3xl font-bold text-amber-600 mb-4">
        {data.year}
      </div>

      <div className="text-sm text-slate-500 mb-4">
        Decline accelerated around <span className="font-medium text-slate-700">{data.year}</span>.
        Mean dropped from {data.beforeMean} to {data.afterMean} days.
      </div>

      {/* Before/after bar chart */}
      <Plot
        data={[{
          x: [`Before ${data.year}`, `After ${data.year}`],
          y: [data.beforeMean, data.afterMean],
          type: 'bar',
          marker: { color: ['#3B82F6', '#F59E0B'] },
          showlegend: false,
        }]}
        layout={{
          height: 80,
          margin: { t: 5, r: 10, b: 25, l: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          xaxis: { showgrid: false, tickfont: { size: 10 } },
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
        <h3 className="text-sm font-semibold text-slate-700">Temp vs Snow Correlation</h3>
        <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-600">
          R = {data.r}
        </span>
      </div>

      <div className="text-3xl font-bold text-blue-600 mb-4">
        R² = {data.rSquared}
      </div>

      <div className="text-sm text-slate-500 mb-2">
        Temperature explains <span className="font-medium text-slate-700">{(data.rSquared * 100).toFixed(0)}%</span> of
        snow cover variation. Strong inverse relationship.
      </div>

      <Plot
        data={[{
          x: temps,
          y: snow,
          type: 'scatter',
          mode: 'markers',
          marker: { color: '#2563EB', size: 6, opacity: 0.7 },
          showlegend: false,
        }, {
          x: [Math.min(...temps), Math.max(...temps)],
          y: [Math.max(...snow), Math.min(...snow)],
          type: 'scatter',
          mode: 'lines',
          line: { color: '#DC2626', width: 2, dash: 'dash' },
          showlegend: false,
        }]}
        layout={{
          height: 100,
          margin: { t: 5, r: 10, b: 5, l: 10 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          xaxis: { showgrid: false, showticklabels: false },
          yaxis: { showgrid: false, showticklabels: false },
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}

export default function StatTestCard({ title, testType, elevationBand }) {
  const data = statResults[testType]?.[elevationBand];
  if (!data) return null;

  if (testType === 'mann-kendall') return <MannKendallCard data={data} />;
  if (testType === 'change-point') return <ChangePointCard data={data} />;
  if (testType === 'correlation') return <CorrelationCard data={data} />;
  return null;
}
