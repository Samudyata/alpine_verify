import { useState } from 'react';
import FactChecker from '../components/FactChecker';

export default function FactCheckerPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {/* Header - centered */}
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-bold text-white mb-5">Climate Fact Checker</h1>
        <p className="text-lg text-slate-400 max-w-3xl leading-relaxed mx-auto">
          Enter a climate claim about the Alps and see what satellite data actually shows.
          Powered by 25 years of Earth observation evidence.
        </p>
      </div>

      <FactChecker />
    </div>
  );
}
