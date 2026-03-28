import { useState } from 'react';
import ProjectionChart from '../components/ProjectionChart';

const elevationBands = ['Low Alps (< 1500m)', 'Mid Alps (1500-2500m)', 'High Alps (> 2500m)'];
const scenarios = ['Current Trend', 'Accelerated (RCP 8.5)', 'Paris-Aligned (RCP 2.6)'];

export default function ProjectionsPage() {
  const [selectedBand, setSelectedBand] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState(0);

  // Headline projections per band/scenario
  const projections = [
    [{ loss: 38, byYear: 2050, snowDays: 47 }, { loss: 52, byYear: 2050, snowDays: 33 }, { loss: 22, byYear: 2050, snowDays: 63 }],
    [{ loss: 24, byYear: 2050, snowDays: 121 }, { loss: 35, byYear: 2050, snowDays: 110 }, { loss: 15, byYear: 2050, snowDays: 130 }],
    [{ loss: 12, byYear: 2050, snowDays: 188 }, { loss: 18, byYear: 2050, snowDays: 182 }, { loss: 7, byYear: 2050, snowDays: 193 }],
  ];

  const proj = projections[selectedBand][selectedScenario];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Future Projections</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          ARIMA forecasts to 2050 based on observed satellite trends. Three scenarios
          show the range of possible futures.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2">Elevation Band</label>
          <div className="flex gap-2">
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
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2">Scenario</label>
          <div className="flex gap-2">
            {scenarios.map((scenario, i) => (
              <button
                key={i}
                onClick={() => setSelectedScenario(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedScenario === i
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Headline cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat-card text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">-{proj.loss}</div>
          <div className="text-sm font-medium text-slate-600">
            Fewer snow days by {proj.byYear}
          </div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{proj.snowDays}</div>
          <div className="text-sm font-medium text-slate-600">
            Projected snow days in {proj.byYear}
          </div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-bold text-amber-600 mb-2">
            {(proj.loss * 0.8).toFixed(0)}B L
          </div>
          <div className="text-sm font-medium text-slate-600">
            Est. annual snowmelt loss (liters)
          </div>
        </div>
      </div>

      {/* Projection chart */}
      <section className="card">
        <ProjectionChart
          elevationBand={selectedBand}
          scenario={selectedScenario}
        />
      </section>
    </div>
  );
}
