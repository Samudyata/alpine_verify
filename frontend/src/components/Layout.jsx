import { NavLink } from 'react-router-dom';
import '../App.css';
import MountainBg from './MountainBg';

const navItems = [
  { path: '/', label: 'Home', icon: '\u2302' },
  { path: '/trends', label: 'Snow Trends', icon: '\u2197' },
  { path: '/projections', label: 'Projections', icon: '\u25B3' },
  { path: '/fact-checker', label: 'Fact Checker', icon: '\u2713' },
  { path: '/findings', label: 'Findings', icon: '\u2261' },
];

export default function Layout({ children }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white via-slate-50/30 to-slate-100/20">
      {/* Alpine mountain background */}
      <MountainBg />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40"
           style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.04)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">AV</span>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
              AlpineVerify
            </span>
          </NavLink>

          <div className="flex items-center gap-0.5">
            {navItems.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
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
      <footer className="relative z-10 py-8 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t border-slate-200/50 pt-6">
            <p className="text-sm text-slate-400">
              AlpineVerify &mdash; SpaceHACK for Sustainability 2026
            </p>
            <p className="text-xs text-slate-300 mt-1">
              Satellite data from Copernicus Climate Data Store | MODIS MOD10A1 | EEAR-Clim
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
