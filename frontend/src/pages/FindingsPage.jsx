import { Link } from 'react-router-dom';

export default function FindingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Key Findings</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Summary of evidence from 25 years of satellite monitoring of the European Alps.
        </p>
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="stat-card text-center py-8">
          <div className="text-5xl font-bold text-red-600 mb-3">-26</div>
          <div className="text-base font-medium text-slate-700 mb-1">Fewer Snow Days</div>
          <div className="text-sm text-slate-500">At low elevations since 1970</div>
        </div>
        <div className="stat-card text-center py-8">
          <div className="text-5xl font-bold text-red-600 mb-3">-50%</div>
          <div className="text-base font-medium text-slate-700 mb-1">Glacier Volume Lost</div>
          <div className="text-sm text-slate-500">Since 1900, accelerating since 1980s</div>
        </div>
        <div className="stat-card text-center py-8">
          <div className="text-5xl font-bold text-amber-600 mb-3">-38</div>
          <div className="text-base font-medium text-slate-700 mb-1">Projected Loss by 2050</div>
          <div className="text-sm text-slate-500">Additional snow days lost at low elevation</div>
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-8 max-w-4xl">
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-xl">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Snow loss is statistically significant and accelerating
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Mann-Kendall tests confirm declining trends across all elevation bands (p &lt; 0.05).
                Change point detection identifies an acceleration around 2008-2012. Low elevations
                are losing snow 2-3x faster than high elevations.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-xl">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Spring months show the largest decline
              </h3>
              <p className="text-slate-600 leading-relaxed">
                March and April exhibit the strongest reductions in snow coverage,
                indicating earlier snowmelt onset. This directly impacts spring
                flood risk and summer water availability for 170M+ downstream residents.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-xl">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Common climate claims about the Alps are refuted by satellite evidence
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Claims that snow is "stable," that glacier retreat is "natural," or
                that individual snowfall events disprove warming are all contradicted
                by the satellite record. Temperature explains 67% of snow cover variation
                (R = -0.82), confirming the warming-driven mechanism.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 text-xl">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Satellite data is a powerful tool against climate disinformation
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Earth observation provides objective, verifiable evidence that journalists
                can use to fact-check climate claims. Tools like AlpineVerify demonstrate
                how pre-processed satellite data can be made accessible for non-specialist
                audiences, bridging the gap between scientific evidence and public discourse.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How journalists can use this */}
      <div className="mt-16 card bg-blue-50 border border-blue-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          How Journalists Can Use AlpineVerify
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Verify Claims</h4>
            <p className="text-slate-600">
              Input any climate claim about the Alps and instantly see satellite-backed evidence.
              No GIS expertise required.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Access Data Stories</h4>
            <p className="text-slate-600">
              Interactive charts ready for screenshots and embedding. Trend lines,
              statistical tests, and projections pre-computed.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Counter Disinformation</h4>
            <p className="text-slate-600">
              Evidence-based responses to common misleading narratives,
              complete with source citations and confidence levels.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link
          to="/fact-checker"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors no-underline text-lg"
        >
          Try the Fact Checker
        </Link>
      </div>
    </div>
  );
}
