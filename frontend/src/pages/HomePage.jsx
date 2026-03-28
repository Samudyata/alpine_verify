import { Link } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';

let Snow3D;
try {
  Snow3D = lazy(() => import('../components/Snow3D'));
} catch (e) {
  Snow3D = () => <div>3D loading failed</div>;
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
            SpaceHACK for Sustainability 2026
          </div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
            Satellite Truth vs.<br />Climate Fiction
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Using 25 years of satellite data to fact-check climate disinformation
            in the European Alps. See what the data actually shows.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/trends"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors no-underline"
            >
              Explore Snow Trends
            </Link>
            <Link
              to="/fact-checker"
              className="px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors no-underline"
            >
              Try Fact Checker
            </Link>
          </div>
        </div>

        {/* 3D Terrain Preview */}
        <div className="w-full max-w-5xl mx-auto mt-16 h-[500px] card overflow-hidden">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              Loading 3D terrain...
            </div>
          }>
            <Snow3D />
          </Suspense>
        </div>
      </section>

      {/* Key Stats */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          What Satellites Reveal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">-26</div>
            <div className="text-sm font-medium text-slate-600">
              Fewer snow days since 1970<br />at low elevations
            </div>
          </div>
          <div className="stat-card text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">2-3x</div>
            <div className="text-sm font-medium text-slate-600">
              Faster snow loss at low elevation<br />vs high elevation
            </div>
          </div>
          <div className="stat-card text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">170M+</div>
            <div className="text-sm font-medium text-slate-600">
              People depend on Alpine<br />snowmelt for freshwater
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { to: '/trends', title: 'Snow Trends', desc: 'Interactive time series with statistical analysis', icon: '&#128200;' },
            { to: '/projections', title: 'Projections', desc: 'ARIMA forecasts to 2050 with scenarios', icon: '&#128302;' },
            { to: '/fact-checker', title: 'Fact Checker', desc: 'Verify climate claims with satellite evidence', icon: '&#128269;' },
            { to: '/findings', title: 'Key Findings', desc: 'Summary and policy implications', icon: '&#128202;' },
          ].map(({ to, title, desc, icon }) => (
            <Link key={to} to={to} className="card no-underline group">
              <div className="text-3xl mb-3" dangerouslySetInnerHTML={{ __html: icon }} />
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
