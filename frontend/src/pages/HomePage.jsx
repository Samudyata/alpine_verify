import { Link } from 'react-router-dom';
import useSnowData from '../hooks/useSnowData';

export default function HomePage() {
  const { data: snowData } = useSnowData();
  const low = snowData?.elevation_bands?.['Low Alps (< 1500m)'];
  const slopeVal = low?.mann_kendall?.slope ? Math.abs(low.mann_kendall.slope).toFixed(0) : '22';
  const corrVal = low?.correlation?.r_squared ? Math.round(low.correlation.r_squared * 100) : '69';
  const cpYear = low?.change_point?.year || '2013';
  return (
    <div>
      {/* Hero Section with satellite/glacier background */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-8 py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-6 py-2 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20 backdrop-blur-sm">
            SpaceHACK for Sustainability 2026
          </div>
          <h1 className="text-6xl font-bold text-white tracking-tight mb-8 leading-tight">
            Where Satellite Data<br />Meets Climate Truth
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed mx-auto">
            Using 25 years of satellite data to fact-check climate disinformation
            in the European Alps. See what the data actually shows.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link
              to="/trends"
              className="px-12 py-4 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-400 transition-colors no-underline shadow-lg shadow-blue-500/20 text-lg whitespace-nowrap"
            >
              Explore Snow Trends
            </Link>
            <Link
              to="/fact-checker"
              className="px-12 py-4 bg-slate-800/80 text-slate-200 font-medium rounded-xl border border-slate-500 hover:bg-slate-700 transition-colors no-underline text-lg backdrop-blur-sm whitespace-nowrap"
            >
              Try Fact Checker
            </Link>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <h2 className="text-3xl font-bold text-white mb-14">
          What Satellites Reveal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="stat-card text-center py-10">
            <div className="text-5xl font-bold text-blue-400 mb-3">-{slopeVal}</div>
            <div className="text-base font-medium text-slate-400 leading-relaxed">
              Snow days lost per decade<br />at low elevations (ERA5)
            </div>
          </div>
          <div className="stat-card text-center py-10">
            <div className="text-5xl font-bold text-blue-400 mb-3">{corrVal}%</div>
            <div className="text-base font-medium text-slate-400 leading-relaxed">
              Snow variation explained<br />by temperature (R²)
            </div>
          </div>
          <div className="stat-card text-center py-10">
            <div className="text-5xl font-bold text-blue-400 mb-3">{cpYear}</div>
            <div className="text-base font-medium text-slate-400 leading-relaxed">
              Detected acceleration<br />change point year
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { to: '/trends', title: 'Snow Trends', desc: 'Interactive time series with statistical analysis', icon: '&#128200;' },
            { to: '/projections', title: 'Projections', desc: 'ARIMA forecasts to 2050 with scenarios', icon: '&#128302;' },
            { to: '/fact-checker', title: 'Fact Checker', desc: 'Verify climate claims with satellite evidence', icon: '&#128269;' },
            { to: '/findings', title: 'Key Findings', desc: 'Summary and policy implications', icon: '&#128202;' },
          ].map(({ to, title, desc, icon }) => (
            <Link key={to} to={to} className="card no-underline group py-8 px-8 text-center">
              <div className="text-3xl mb-4" dangerouslySetInnerHTML={{ __html: icon }} />
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mb-3">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
