'use client';

interface PreferencesFormProps {
  mode: 'balanced' | 'return';
  returnSafety: 'safety' | 'balanced' | 'return';
  riskTolerance: 'low' | 'medium' | 'high';
  diversification: 'yes' | 'no';
  onReturnSafetyChange: (value: 'safety' | 'balanced' | 'return') => void;
  onRiskToleranceChange: (value: 'low' | 'medium' | 'high') => void;
  onDiversificationChange: (value: 'yes' | 'no') => void;
}

export default function PreferencesForm({
  mode,
  returnSafety,
  riskTolerance,
  diversification,
  onReturnSafetyChange,
  onRiskToleranceChange,
  onDiversificationChange,
}: PreferencesFormProps) {
  // Human-readable labels for the summary
  const returnSafetyLabel =
    returnSafety === 'safety' ? 'Safety First' :
    returnSafety === 'balanced' ? 'Balanced' : 'Return Focus';
  const riskToleranceLabel =
    riskTolerance === 'low' ? 'Conservative' :
    riskTolerance === 'medium' ? 'Moderate' : 'Aggressive';
  const diversificationLabel =
    diversification === 'yes' ? 'High Diversification' : 'Focused Portfolio';
  const modeLabel = mode === 'balanced' ? 'Balanced' : 'Return Focused';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pop">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Investment Preferences
      </h2>

      {/* Return vs Safety Preference */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Return vs Safety Preference
        </label>
        <div className="segmented" role="group" aria-label="Return vs Safety Preference">
          {[
            { value: 'safety', label: 'Safety First' },
            { value: 'balanced', label: 'Balanced' },
            { value: 'return', label: 'Return Focus' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onReturnSafetyChange(option.value as 'safety' | 'balanced' | 'return')}
              aria-pressed={returnSafety === option.value}
              className="focus-ring"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-600">
          {returnSafety === 'safety'
            ? 'Prioritize capital preservation'
            : returnSafety === 'balanced'
            ? 'Balance risk and return'
            : 'Maximize potential returns'}
        </p>
      </div>

      {/* Risk Tolerance */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Risk Tolerance
        </label>
        <div className="segmented" role="group" aria-label="Risk tolerance">
          {[
            { value: 'low', label: 'Conservative' },
            { value: 'medium', label: 'Moderate' },
            { value: 'high', label: 'Aggressive' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => onRiskToleranceChange(option.value as 'low' | 'medium' | 'high')}
              aria-pressed={riskTolerance === option.value}
              className="focus-ring"
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-600">
          {riskTolerance === 'low'
            ? 'Low risk tolerance'
            : riskTolerance === 'medium'
            ? 'Medium risk tolerance'
            : 'High risk tolerance'}
        </p>
      </div>

      {/* Diversification (only for balanced mode) */}
      {mode === 'balanced' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Diversification Preference
          </label>
          <div className="segmented" role="group" aria-label="Diversification preference">
            <button
              onClick={() => onDiversificationChange('yes')}
              aria-pressed={diversification === 'yes'}
              className="focus-ring"
            >
              High Diversification
            </button>
            <button
              onClick={() => onDiversificationChange('no')}
              aria-pressed={diversification === 'no'}
              className="focus-ring"
            >
              Focused Portfolio
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            {diversification === 'yes'
              ? 'Spread risk across assets'
              : 'Concentrate on best assets'}
          </p>
        </div>
      )}

      {/* Preference Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-pop" aria-live="polite">
        <h3 className="font-semibold text-gray-800 mb-2">Your Profile:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div>• Return vs Safety: <span className="font-medium">{returnSafetyLabel}</span></div>
          <div>• Risk Tolerance: <span className="font-medium">{riskToleranceLabel}</span></div>
          {mode === 'balanced' && (
            <div>• Diversification: <span className="font-medium">{diversificationLabel}</span></div>
          )}
          <div>• Mode: <span className="font-medium">{modeLabel}</span></div>
        </div>
      </div>
    </div>
  );
}