import { NavLink } from 'react-router-dom';
import '../App.css';
import MountainBg from './MountainBg';
import Snowfall from './Snowfall';

const navItems = [
  { path: '/', label: 'Home', icon: '\u2302' },
  { path: '/trends', label: 'Snow Trends', icon: '\u2197' },
  { path: '/projections', label: 'Projections', icon: '\u25B3' },
  { path: '/fact-checker', label: 'Fact Checker', icon: '\u2713' },
  { path: '/findings', label: 'Findings', icon: '\u2261' },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#0B1120] via-[#0F172A] to-[#0B1120]">
      {/* Alpine mountain background */}
      <MountainBg />

      {/* Snowfall particles */}
      <Snowfall />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-700/40"
           style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.3)' }}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
              <span className="text-white text-sm font-bold">AV</span>
            </div>
            <span className="text-lg font-bold text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors">
              AlpineVerify
            </span>
          </NavLink>

          <div className="flex items-center gap-4">
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-6 py-2.5 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center">
        <div className="max-w-7xl mx-auto px-8">
          <div className="border-t border-slate-700/50 pt-8">
            <p className="text-sm text-slate-500">
              AlpineVerify &mdash; SpaceHACK for Sustainability 2026
            </p>
            <p className="text-xs text-slate-600 mt-2">
              Satellite data from Copernicus Climate Data Store | MODIS MOD10A1 | EEAR-Clim
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
