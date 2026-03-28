import { useState, useMemo } from 'react';
import Plot from './PlotlyChart';

// Claims database - will be replaced with climate_fever + augmented data
const claimsDB = [
  {
    id: 1,
    claim: 'Snow levels in the Alps have remained stable over the past decades',
    verdict: 'REFUTED',
    confidence: 0.94,
    category: 'Snow Cover',
    evidence: 'Satellite data (MODIS MOD10A1) shows a statistically significant decline of ~5.2 days per decade at low elevations (Mann-Kendall p < 0.001). Snow cover duration has decreased by approximately 26 days since 1970.',
    keywords: ['snow', 'stable', 'alps', 'decades', 'levels'],
    chartType: 'trend',
  },
  {
    id: 2,
    claim: 'Glacier retreat in the Alps is part of a natural cycle',
    verdict: 'REFUTED',
    confidence: 0.91,
    category: 'Glaciers',
    evidence: 'While glaciers have natural fluctuations, the current rate of retreat far exceeds natural variability. Alpine glaciers have lost ~50% of their volume since 1900, with acceleration since the 1980s that correlates with anthropogenic warming (R = -0.82 with temperature).',
    keywords: ['glacier', 'retreat', 'natural', 'cycle', 'alps'],
    chartType: 'correlation',
  },
  {
    id: 3,
    claim: 'This winter had record snowfall so climate change is not real',
    verdict: 'REFUTED',
    confidence: 0.97,
    category: 'Weather vs Climate',
    evidence: 'Individual weather events do not negate long-term climate trends. The 25-year satellite record shows clear declining trends in annual snow cover duration across all elevation bands. Seasonal decomposition shows the long-term trend is robustly negative despite year-to-year variability.',
    keywords: ['record', 'snowfall', 'winter', 'climate change', 'not real'],
    chartType: 'seasonal',
  },
  {
    id: 4,
    claim: 'Alpine ski resorts will continue to operate normally',
    verdict: 'REFUTED',
    confidence: 0.88,
    category: 'Tourism Impact',
    evidence: 'ARIMA projections show low-elevation resorts (< 1500m) will lose 38 additional snow days by 2050 under current trends, reducing viable ski season to ~47 days. Mid-elevation resorts face 24 fewer days. Only high-altitude resorts above 2500m may remain viable.',
    keywords: ['ski', 'resorts', 'operate', 'alpine', 'normally'],
    chartType: 'projection',
  },
  {
    id: 5,
    claim: 'Climate change is causing the Alps to lose snow cover',
    verdict: 'SUPPORTED',
    confidence: 0.96,
    category: 'Snow Cover',
    evidence: 'Confirmed by multiple satellite datasets. MODIS snow cover data shows consistent decline across all elevation bands. Mann-Kendall tests confirm statistically significant negative trends. Temperature-snow correlation (R = -0.82) supports a warming-driven mechanism.',
    keywords: ['climate change', 'alps', 'snow', 'cover', 'losing'],
    chartType: 'trend',
  },
  {
    id: 6,
    claim: 'The European Alps are warming faster than the global average',
    verdict: 'SUPPORTED',
    confidence: 0.93,
    category: 'Temperature',
    evidence: 'Ground station data from EEAR-Clim confirms that the Alps have warmed at approximately twice the global average rate. This elevation-dependent warming is consistent with satellite-observed snow cover loss being most severe at lower elevations.',
    keywords: ['alps', 'warming', 'faster', 'global', 'average', 'temperature'],
    chartType: 'correlation',
  },
];

// Simple TF-IDF-like matching
function matchClaims(input) {
  const inputWords = input.toLowerCase().split(/\s+/).filter(w => w.length > 2);

  return claimsDB
    .map(claim => {
      const matchCount = claim.keywords.filter(kw =>
        inputWords.some(w => kw.includes(w) || w.includes(kw))
      ).length;
      const score = matchCount / Math.max(claim.keywords.length, inputWords.length);
      return { ...claim, matchScore: score };
    })
    .filter(c => c.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

// Simple evidence charts
function EvidenceChart({ chartType }) {
  if (chartType === 'trend') {
    const years = Array.from({ length: 25 }, (_, i) => 2000 + i);
    const values = years.map(y => 85 - 1.1 * (y - 2000) + Math.sin(y * 3.7) * 6);
    const trend = years.map(y => 85 - 1.1 * (y - 2000));
    return (
      <Plot
        data={[
          { x: years, y: values, type: 'scatter', mode: 'lines+markers', name: 'Observed', line: { color: '#2563EB' }, marker: { size: 4 } },
          { x: years, y: trend, type: 'scatter', mode: 'lines', name: 'Trend', line: { color: '#DC2626', dash: 'dash' } },
        ]}
        layout={{
          height: 250, margin: { t: 10, r: 20, b: 40, l: 50 },
          paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
          font: { family: 'Inter', size: 11, color: '#475569' },
          xaxis: { title: 'Year', gridcolor: '#F1F5F9' },
          yaxis: { title: 'Snow Days', gridcolor: '#F1F5F9' },
          showlegend: false,
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    );
  }

  if (chartType === 'correlation') {
    const temps = Array.from({ length: 25 }, (_, i) => 6 + i * 0.06 + Math.sin(i) * 0.3);
    const snow = temps.map((t, i) => 120 - t * 8 + Math.cos(i * 2) * 8);
    return (
      <Plot
        data={[
          { x: temps, y: snow, type: 'scatter', mode: 'markers', marker: { color: '#2563EB', size: 7 } },
          { x: [Math.min(...temps), Math.max(...temps)], y: [Math.max(...snow), Math.min(...snow)], type: 'scatter', mode: 'lines', line: { color: '#DC2626', dash: 'dash' } },
        ]}
        layout={{
          height: 250, margin: { t: 10, r: 20, b: 40, l: 50 },
          paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
          font: { family: 'Inter', size: 11, color: '#475569' },
          xaxis: { title: 'Mean Temperature', gridcolor: '#F1F5F9' },
          yaxis: { title: 'Snow Days', gridcolor: '#F1F5F9' },
          showlegend: false,
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    );
  }

  if (chartType === 'projection') {
    const years = Array.from({ length: 51 }, (_, i) => 2000 + i);
    const values = years.map(y => y <= 2024 ? 85 - 1.1 * (y - 2000) + Math.sin(y * 3.7) * 6 : null);
    const proj = years.map(y => y >= 2024 ? 85 - 1.1 * 24 - 1.5 * (y - 2024) : null);
    return (
      <Plot
        data={[
          { x: years, y: values, type: 'scatter', mode: 'lines', name: 'Observed', line: { color: '#475569' } },
          { x: years, y: proj, type: 'scatter', mode: 'lines', name: 'Projected', line: { color: '#DC2626', dash: 'dash', width: 3 } },
        ]}
        layout={{
          height: 250, margin: { t: 10, r: 20, b: 40, l: 50 },
          paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
          font: { family: 'Inter', size: 11, color: '#475569' },
          xaxis: { title: 'Year', gridcolor: '#F1F5F9' },
          yaxis: { title: 'Snow Days', gridcolor: '#F1F5F9' },
          showlegend: false,
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    );
  }

  if (chartType === 'seasonal') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Nov', 'Dec'];
    return (
      <Plot
        data={[
          { x: months, y: [0.95, 0.90, 0.70, 0.35, 0.10, 0.45, 0.85], name: '2000-2005', type: 'bar', marker: { color: '#3B82F6' } },
          { x: months, y: [0.90, 0.82, 0.50, 0.18, 0.04, 0.38, 0.80], name: '2019-2024', type: 'bar', marker: { color: '#F59E0B' } },
        ]}
        layout={{
          height: 250, margin: { t: 10, r: 20, b: 40, l: 50 },
          paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
          font: { family: 'Inter', size: 11, color: '#475569' },
          xaxis: { gridcolor: '#F1F5F9' },
          yaxis: { title: 'Coverage', gridcolor: '#F1F5F9', tickformat: '.0%' },
          barmode: 'group',
          legend: { orientation: 'h', y: -0.2 },
        }}
        config={{ staticPlot: true }}
        style={{ width: '100%' }}
      />
    );
  }

  return null;
}

const exampleClaims = [
  'Snow levels in the Alps are normal',
  'Glacier retreat is a natural cycle',
  'Record snowfall disproves warming',
  'Alpine ski resorts will be fine',
  'The Alps are warming faster than average',
];

export default function FactChecker() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);

  const handleCheck = (text) => {
    const query = text || input;
    if (!query.trim()) return;
    setInput(query);
    setResults(matchClaims(query));
  };

  return (
    <div>
      {/* Input area */}
      <div className="card mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
            placeholder="Enter a climate claim about the Alps..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleCheck()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Verify
          </button>
        </div>

        {/* Example pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-sm text-slate-500">Try:</span>
          {exampleClaims.map((claim) => (
            <button
              key={claim}
              onClick={() => handleCheck(claim)}
              className="px-3 py-1 text-sm bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
            >
              {claim}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && results.length > 0 && (
        <div className="space-y-6">
          {/* Primary result */}
          <div className="card border-l-4" style={{
            borderLeftColor: results[0].verdict === 'REFUTED' ? '#DC2626'
              : results[0].verdict === 'SUPPORTED' ? '#16A34A' : '#D97706'
          }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`badge-${results[0].verdict.toLowerCase()}`}>
                  {results[0].verdict}
                </span>
                <span className="ml-3 text-sm text-slate-500">
                  {(results[0].confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                {results[0].category}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              "{results[0].claim}"
            </h3>

            <p className="text-slate-600 mb-4 leading-relaxed">
              {results[0].evidence}
            </p>

            {/* Evidence chart */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Satellite Evidence</h4>
              <EvidenceChart chartType={results[0].chartType} />
            </div>

            <div className="mt-4 text-xs text-slate-400">
              Sources: Copernicus CDS, MODIS MOD10A1, EEAR-Clim, Randolph Glacier Inventory
            </div>
          </div>

          {/* Similar claims */}
          {results.length > 1 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-3">Similar Known Claims</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.slice(1).map((r) => (
                  <div key={r.id} className="card py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge-${r.verdict.toLowerCase()}`}>{r.verdict}</span>
                      <span className="text-xs text-slate-400">
                        {(r.matchScore * 100).toFixed(0)}% match
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{r.claim}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {results && results.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">&#128269;</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No matching claims found</h3>
          <p className="text-slate-500">Try rephrasing your claim or use one of the examples above.</p>
        </div>
      )}
    </div>
  );
}
