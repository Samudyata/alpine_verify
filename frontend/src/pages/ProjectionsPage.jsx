import { useState } from 'react';
import ProjectionChart from '../components/ProjectionChart';
import useSnowData, { getBandData, getBandNames } from '../hooks/useSnowData';

const scenarioNames = ['Current Trend', 'Accelerated (RCP 8.5)', 'Paris-Aligned (RCP 2.6)'];

export default function ProjectionsPage() {
  const [selectedBand, setSelectedBand] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const { data: snowData, error } = useSnowData();

  const bandNames = getBandNames(snowData);
  const bandData = getBandData(snowData, selectedBand);

  // Get real projection stats or fallback
  const scName = scenarioNames[selectedScenario];
  const realProj = bandData?.projections?.[scName];
  const proj = realProj
    ? { loss: Math.abs(realProj.loss_by_2050), snowDays: realProj.snow_days_2050, byYear: 2050 }
    : { loss: '--', snowDays: '--', byYear: 2050 };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-bold text-white mb-5">Future Projections</h1>
        <p className="text-lg text-slate-400 max-w-3xl leading-relaxed mx-auto">
          ARIMA forecasts to 2050 based on real ERA5 station observations. Three scenarios
          show the range of possible futures.
        </p>
        {snowData && (
          <p className="text-xs text-green-400 mt-3">
            Source: {snowData.metadata?.source} | {snowData.metadata?.period}
          </p>
        )}
        {error && (
          <p className="text-xs text-yellow-400 mt-3">
            Using demo data — run data pipeline for real projections
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-8 mb-10 justify-center">
        <div className="text-center">
          <label className="block text-sm font-medium text-slate-500 mb-3">Elevation Band</label>
          <div className="flex gap-3 flex-wrap justify-center">
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
        </div>
        <div className="text-center">
          <label className="block text-sm font-medium text-slate-500 mb-3">Scenario</label>
          <div className="flex gap-3 flex-wrap justify-center">
            {scenarioNames.map((scenario, i) => (
              <button
                key={i}
                onClick={() => setSelectedScenario(i)}
                className={`px-8 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedScenario === i
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="stat-card text-center py-10">
          <div className="text-4xl font-bold text-red-400 mb-3">
            {typeof proj.loss === 'number' ? (proj.loss > 0 ? `-${proj.loss.toFixed(0)}` : `+${Math.abs(proj.loss).toFixed(0)}`) : proj.loss}
          </div>
          <div className="text-sm font-medium text-slate-400">
            Snow days change by {proj.byYear}
          </div>
        </div>
        <div className="stat-card text-center py-10">
          <div className="text-4xl font-bold text-blue-400 mb-3">
            {typeof proj.snowDays === 'number' ? proj.snowDays.toFixed(0) : proj.snowDays}
          </div>
          <div className="text-sm font-medium text-slate-400">
            Projected snow days in {proj.byYear}
          </div>
        </div>
        <div className="stat-card text-center py-10">
          <div className="text-4xl font-bold text-amber-400 mb-3">
            {bandData?.mann_kendall?.slope !== undefined ? `${bandData.mann_kendall.slope}` : '--'}
          </div>
          <div className="text-sm font-medium text-slate-400">
            Current trend (days/decade)
          </div>
        </div>
      </div>

      <section className="card text-center">
        <h2 className="text-xl font-semibold text-slate-100 mb-5">
          Projection &mdash; {scenarioNames[selectedScenario]}
        </h2>
        <ProjectionChart
          elevationBand={selectedBand}
          scenario={selectedScenario}
          realData={bandData}
        />
      </section>
    </div>
  );
}
