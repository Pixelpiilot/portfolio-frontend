'use client';

import { useState, useEffect } from 'react';

interface InstrumentSelectorProps {
  selectedInstruments: string[];
  onSelectionChange: (instruments: string[]) => void;
  productsMap?: Record<string, { risk: number; return: number; std: number; risk_level: string; category: string }>;
}

export default function InstrumentSelector({ selectedInstruments, onSelectionChange, productsMap }: InstrumentSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Load instruments: prefer props.productsMap, else fetch from API
  const [productsState, setProductsState] = useState<Record<string, { risk: number; return: number; std: number; risk_level: string; category: string }> | null>(productsMap || null);

  useEffect(() => {
    if (!productsMap) {
      fetch('/api/instruments')
        .then(res => res.json())
        .then(json => {
          if (json?.ok && json?.data) {
            setProductsState(json.data as Record<string, { risk: number; return: number; std: number; risk_level: string; category: string }>);
          }
        })
        .catch(() => {});
    }
  }, [productsMap]);

  const prodEntries: Array<[string, any]> = productsMap
    ? Object.entries(productsMap)
    : (productsState ? Object.entries(productsState) : []);

  const categories = ['All', ...new Set(prodEntries.map(([_, p]) => p.category))];
  
  const filteredInstruments = prodEntries.filter(([name, data]) => {
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || data.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstrumentToggle = (instrumentName: string) => {
    if (selectedInstruments.includes(instrumentName)) {
      onSelectionChange(selectedInstruments.filter(name => name !== instrumentName));
    } else if (selectedInstruments.length < 5) {
      onSelectionChange([...selectedInstruments, instrumentName]);
      // Track analytics for added instrument (fire-and-forget)
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'instrument_add', instrument: instrumentName }),
        keepalive: true
      }).catch(() => {});
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Low-Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Medium-High': return 'text-red-600 bg-red-100';
      case 'High': return 'text-red-700 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pop">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Select Instruments (2-5 required)
      </h2>
      {selectedInstruments.length > 0 && (
        <div className="chips-row mb-4" aria-label="Selected instruments">
          {selectedInstruments.map((name) => (
            <span key={name} className="chip">
              {name}
              <button
                type="button"
                aria-label={`Remove ${name}`}
                className="chip-close"
                onClick={() =>
                  onSelectionChange(selectedInstruments.filter((n) => n !== name))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Scrollable area with sticky filters */}
      <div className="max-h-[28rem] overflow-y-auto px-4 space-y-3 pb-24 sm:pb-6" role="region" aria-label="Instrument selector list">
        {/* Search, filter and selected count header */}
        <div className="sticky top-0 sticky-blur px-4 py-6 -mx-4 mb-6 z-10">
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Selected: {selectedInstruments.length}/5
          </div>
        </div>

        {/* Instruments List */}
        <div className="mt-2 space-y-3 px-2">
          {filteredInstruments.map(([name, data]) => {
            const isSelected = selectedInstruments.includes(name);
            const canSelect = selectedInstruments.length < 5 || isSelected;

            return (
              <div
                key={name}
                role="button"
                aria-pressed={isSelected}
                aria-selected={isSelected}
                aria-disabled={!canSelect}
                tabIndex={canSelect ? 0 : -1}
                onKeyDown={(e) => {
                  if (!canSelect) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInstrumentToggle(name);
                  }
                }}
                onClick={() => canSelect && handleInstrumentToggle(name)}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : canSelect
                    ? 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.99]`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600"
                        disabled={!canSelect}
                      />
                      <span className="font-medium text-gray-800">{name}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                      <span>Return: {(data.return * 100).toFixed(1)}%</span>
                      <span>Risk: {(data.std * 100).toFixed(1)}%</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(data.risk_level)}`}>
                        {data.risk_level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredInstruments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No instruments found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}