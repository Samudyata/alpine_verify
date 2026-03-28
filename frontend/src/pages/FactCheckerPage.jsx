import { useState } from 'react';
import FactChecker from '../components/FactChecker';

export default function FactCheckerPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Climate Fact Checker</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Enter a climate claim about the Alps and see what satellite data actually shows.
          Powered by 25 years of Earth observation evidence.
        </p>
      </div>

      <FactChecker />
    </div>
  );
}
