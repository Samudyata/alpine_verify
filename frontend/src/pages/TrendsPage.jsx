import { useState } from 'react';
import TrendChart from '../components/TrendChart';
import SeasonalChart from '../components/SeasonalChart';
import StatTestCard from '../components/StatTestCard';

const elevationBands = ['Low Alps (< 1500m)', 'Mid Alps (1500-2500m)', 'High Alps (> 2500m)'];

export default function TrendsPage() {
  const [selectedBand, setSelectedBand] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Snow Cover Trends</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          25 years of satellite observations reveal a clear decline in Alpine snow cover,
          with low elevations losing snow fastest.
        </p>
      </div>

      {/* Elevation band selector */}
      <div className="flex gap-2 mb-8">
        {elevationBands.map((band, i) => (
          <button
            key={i}
            onClick={() => setSelectedBand(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedBand === i
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {band}
          </button>
        ))}
      </div>

      {/* Main trend chart */}
      <section className="card mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Annual Snow Cover Duration
        </h2>
        <TrendChart elevationBand={selectedBand} />
      </section>

      {/* Statistical tests */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Statistical Evidence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatTestCard
            title="Mann-Kendall Trend"
            testType="mann-kendall"
            elevationBand={selectedBand}
          />
          <StatTestCard
            title="Change Point Detection"
            testType="change-point"
            elevationBand={selectedBand}
          />
          <StatTestCard
            title="Temperature Correlation"
            testType="correlation"
            elevationBand={selectedBand}
          />
        </div>
      </section>

      {/* Seasonal chart */}
      <section className="card">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Seasonal Decomposition
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Which months have lost the most snow? The heatmap below shows snow duration by month and year.
        </p>
        <SeasonalChart elevationBand={selectedBand} />
      </section>
    </div>
  );
}
