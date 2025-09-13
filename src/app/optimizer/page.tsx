'use client';

import { useState, useEffect } from 'react';
import { runPortfolio, getInvestorPreferences } from '@/lib/portfolioOptimizer';
import InstrumentSelector from '@/components/InstrumentSelector';
import PortfolioResults from '@/components/PortfolioResults';
import PreferencesForm from '@/components/PreferencesForm';

export default function Optimizer() {
  const [amount, setAmount] = useState<number>(100000);
  // Preselected default basket (diversified) since instrument selector is removed
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([
    'Stocks',
    'Government Bonds',
    'Gold',
    'Debt Fund'
  ]);
  const [mode, setMode] = useState<'balanced' | 'return'>('balanced');
  const [returnSafety, setReturnSafety] = useState<'safety' | 'balanced' | 'return'>('balanced');
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [diversification, setDiversification] = useState<'yes' | 'no'>('yes');
  const [results, setResults] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isCalculating, setIsCalculating] = useState(false);
  const [productsMap, setProductsMap] = useState<Record<string, { risk: number; return: number; std: number; risk_level: string; category: string }> | null>(null);

  useEffect(() => {
    fetch('/api/instruments')
      .then(res => res.json())
      .then(json => {
        if (json?.ok && json?.data) {
          setProductsMap(json.data as Record<string, { risk: number; return: number; std: number; risk_level: string; category: string }>);
        }
      })
      .catch(() => {});
  }, []);

  const handleCalculate = async () => {

    setIsCalculating(true);
    
    try {
      const preferences = getInvestorPreferences(mode, returnSafety, riskTolerance, diversification);
      const portfolioResults = runPortfolio(amount, selectedInstruments, preferences, mode, productsMap ?? undefined);
      setResults(portfolioResults);
    } catch (error) {
      console.error('Error calculating portfolio:', error);
      alert('Error calculating portfolio. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSelectedInstruments(['Stocks','Government Bonds','Gold','Debt Fund']);
    setAmount(100000);
    setMode('balanced');
    setReturnSafety('balanced');
    setRiskTolerance('medium');
    setDiversification('yes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" aria-busy={isCalculating}>
      {isCalculating && <div className="progress-bar" aria-hidden="true"></div>}
      <div className="container mx-auto px-4 pt-8 pb-28 sm:py-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-3">Smart MPT-powered</span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 animate-in">
            Portfolio Optimizer
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto animate-in">
            Build a risk-aware, return-optimized portfolio in minutes. Set your preferences and amount, and let the optimizer do the math.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 stagger">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Investment Amount */}
            <div className="bg-white rounded-lg shadow-md p-6 animate-pop">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Investment Amount
              </h2>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 caret-blue-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter investment amount"
                  min="1000"
                  step="1000"
                />
              </div>
            </div>

            {/* Mode Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 animate-pop">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Optimization Mode
              </h2>
              <div className="segmented" role="group" aria-label="Optimization mode">
                <button
                  onClick={() => setMode('balanced')}
                  aria-pressed={mode === 'balanced'}
                  className="focus-ring"
                >
                  Balanced
                </button>
                <button
                  onClick={() => setMode('return')}
                  aria-pressed={mode === 'return'}
                  className="focus-ring"
                >
                  Return Focused
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {mode === 'balanced' ? 'Balance risk and return.' : 'Prioritize higher expected returns.'}
              </p>
            </div>

            <InstrumentSelector
              selectedInstruments={selectedInstruments}
              onSelectionChange={setSelectedInstruments}
              productsMap={productsMap ?? undefined}
            />

            {/* Preferences */}
            <PreferencesForm
              mode={mode}
              returnSafety={returnSafety}
              riskTolerance={riskTolerance}
              diversification={diversification}
              onReturnSafetyChange={setReturnSafety}
              onRiskToleranceChange={setRiskTolerance}
              onDiversificationChange={setDiversification}
            />

            {/* Action Buttons */}
            <div className="hidden sm:flex gap-3">
              <button
                onClick={handleCalculate}
                disabled={isCalculating || selectedInstruments.length < 2}
                className="flex-1 inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCalculating ? 'Optimizing...' : 'Optimize Portfolio'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Mobile Action Bar */}
            <div className="sm:hidden mobile-action-bar safe-bottom">
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating || selectedInstruments.length < 2}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isCalculating ? 'Calculating...' : 'Optimize'}
                </button>
                <button
                  onClick={handleReset}
                  className="py-2 px-4 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:sticky lg:top-8">
            {results ? (
              <PortfolioResults results={results} />
            ) : isCalculating ? (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4 animate-pop">
                <div className="flex items-center gap-3">
                  <div className="skeleton skeleton-circle w-10 h-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton skeleton-line w-1/2"></div>
                    <div className="skeleton skeleton-line w-1/3"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="skeleton h-24"></div>
                  <div className="skeleton h-24"></div>
                </div>
                <div className="skeleton h-48"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center animate-pop">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Portfolio Results
                </h3>
                <p className="text-gray-500">
                  Click "Optimize Portfolio" to see your optimized allocation based on your preferences
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}