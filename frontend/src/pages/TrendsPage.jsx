import { useState } from 'react';
import TrendChart from '../components/TrendChart';
import SeasonalChart from '../components/SeasonalChart';
import StatTestCard from '../components/StatTestCard';
import SnowSurface3D from '../components/SnowSurface3D';
import useSnowData, { getBandData, getBandNames } from '../hooks/useSnowData';

export default function TrendsPage() {
  const [selectedBand, setSelectedBand] = useState(0);
  const { data: snowData, loading, error } = useSnowData();

  const bandNames = getBandNames(snowData);
  const bandData = getBandData(snowData, selectedBand);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-bold text-white mb-5">Snow Cover Trends</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          25 years of satellite observations reveal a clear decline in Alpine snow cover,
          with low elevations losing snow fastest.
        </p>
        {snowData && (
          <p className="text-xs text-green-400 mt-3">
            Source: {snowData.metadata?.source} | {snowData.metadata?.period}
          </p>
        )}
        {error && (
          <p className="text-xs text-yellow-400 mt-3">
            Using demo data — run data pipeline for real satellite data
          </p>
        )}
      </div>

      {/* 3D Surface Plot */}
      <section className="card mb-12 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-2">
          Alpine Snow Water Equivalent &mdash; 3D Surface
        </h2>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Drag to rotate, scroll to zoom. Shows snow water equivalent across all elevation bands.
        </p>
        <SnowSurface3D realData={snowData?.surface_3d} />
      </section>

      {/* Elevation band selector */}
      <div className="flex gap-4 mb-10 justify-center flex-wrap">
        {bandNames.map((band, i) => (
          <button
            key={i}
            onClick={() => setSelectedBand(i)}
            className={`px-8 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selectedBand === i
                ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {band}
          </button>
        ))}
      </div>

      {/* Particle flow trend chart */}
      <section className="card mb-10 text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-5">
          Annual Snow Cover Duration &mdash; {bandNames[selectedBand]}
        </h2>
        <TrendChart elevationBand={selectedBand} realData={bandData} />
      </section>

      {/* Statistical tests */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-slate-100 mb-6 text-center">
          Statistical Evidence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatTestCard testType="mann-kendall" elevationBand={selectedBand} realData={bandData} />
          <StatTestCard testType="change-point" elevationBand={selectedBand} realData={bandData} />
          <StatTestCard testType="correlation" elevationBand={selectedBand} realData={bandData} />
        </div>
      </section>

      {/* Seasonal chart */}
      <section className="card text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-5">
          Seasonal Decomposition
        </h2>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          Which months have lost the most snow? The heatmap below shows snow duration by month and year.
        </p>
        <SeasonalChart elevationBand={selectedBand} realSurfaceData={snowData?.surface_3d} />
      </section>
    </div>
  );
}
