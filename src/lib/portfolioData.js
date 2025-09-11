// Static Instruments (Updated with Risk Level & Category)
export const products = {
  // Equity-oriented
  'Stocks': { risk: 0.80, return: 0.13, std: 0.18, risk_level: 'High', category: 'Equity' },
  'Gold': { risk: 0.30, return: 0.11, std: 0.15, risk_level: 'Medium-High', category: 'Commodities' },
  'Government Bonds': { risk: 0.20, return: 0.10, std: 0.05, risk_level: 'Low-Medium', category: 'Government' },
  'Midcap Mutual Fund': { risk: 0.70, return: 0.10, std: 0.18, risk_level: 'High', category: 'Equity' },
  'Real Estate Trust': { risk: 0.60, return: 0.09, std: 0.17, risk_level: 'High', category: 'Real Estate' },
  'International ETF': { risk: 0.65, return: 0.11, std: 0.19, risk_level: 'High', category: 'Equity' },
  'FD': { risk: 0.05, return: 0.055, std: 0.005, risk_level: 'Low', category: 'Cash & Cash-like' },
  'Debt Fund': { risk: 0.25, return: 0.065, std: 0.06, risk_level: 'Low-Medium', category: 'Debt/Fixed Income' },
  'IT Sector ETF': { risk: 0.75, return: 0.11, std: 0.22, risk_level: 'High', category: 'Equity' },
  'Pharma ETF': { risk: 0.60, return: 0.09, std: 0.17, risk_level: 'High', category: 'Equity' },
  'PSU Bank ETF': { risk: 0.65, return: 0.085, std: 0.19, risk_level: 'High', category: 'Equity' },
  'Large Cap Mutual Fund': { risk: 0.55, return: 0.095, std: 0.16, risk_level: 'High', category: 'Equity' },
  'Liquid Fund': { risk: 0.01, return: 0.005, std: 0.01, risk_level: 'Low', category: 'Cash & Cash-like' },
  'Arbitrage Fund': { risk: 0.15, return: 0.065, std: 0.03, risk_level: 'Low', category: 'Debt/Fixed Income' },
  'Short-Term Debt Fund': { risk: 0.18, return: 0.06, std: 0.04, risk_level: 'Low-Medium', category: 'Debt/Fixed Income' },
  'Fixed Maturity Plan': { risk: 0.12, return: 0.057, std: 0.015, risk_level: 'Low', category: 'Debt/Fixed Income' },
  'Bank Fixed Deposit': { risk: 0.05, return: 0.055, std: 0.005, risk_level: 'Low', category: 'Cash & Cash-like' },
  'Treasury Bills': { risk: 0.03, return: 0.045, std: 0.002, risk_level: 'Low', category: 'Government' },
  'Sovereign Gold Bonds': { risk: 0.20, return: 0.07, std: 0.05, risk_level: 'Low-Medium', category: 'Commodities' },
  'Index Fund': { risk: 0.50, return: 0.085, std: 0.14, risk_level: 'Medium-High', category: 'Equity' },
  'Tax-Free Bonds': { risk: 0.18, return: 0.065, std: 0.035, risk_level: 'Low-Medium', category: 'Debt/Fixed Income' },
  'Senior Citizens Savings Scheme': { risk: 0.05, return: 0.075, std: 0.002, risk_level: 'Low', category: 'Government' },
  'Balanced Advantage Fund': { risk: 0.35, return: 0.085, std: 0.10, risk_level: 'Medium', category: 'Hybrid' },
  'Target Maturity Fund': { risk: 0.20, return: 0.067, std: 0.04, risk_level: 'Low-Medium', category: 'Debt/Fixed Income' },
  'Corporate Bond Fund': { risk: 0.30, return: 0.075, std: 0.06, risk_level: 'Medium', category: 'Debt/Fixed Income' },
  'Gold Savings Fund': { risk: 0.25, return: 0.065, std: 0.05, risk_level: 'Low-Medium', category: 'Commodities' },
  'National Savings Certificate': { risk: 0.10, return: 0.07, std: 0.01, risk_level: 'Low', category: 'Government' },
  'Post Office Monthly Income Scheme': { risk: 0.08, return: 0.068, std: 0.008, risk_level: 'Low', category: 'Government' },
  'Ultra Short Duration Fund': { risk: 0.12, return: 0.058, std: 0.015, risk_level: 'Low', category: 'Debt/Fixed Income' },
  'Capital Protection Oriented Fund': { risk: 0.10, return: 0.06, std: 0.01, risk_level: 'Low', category: 'Debt/Fixed Income' },
  'Floating Rate Fund': { risk: 0.22, return: 0.068, std: 0.045, risk_level: 'Low-Medium', category: 'Debt/Fixed Income' },
  'Infrastructure Bond': { risk: 0.28, return: 0.075, std: 0.05, risk_level: 'Medium', category: 'Debt/Fixed Income' },
};

// Predefined Correlation Matrix
export const correlationMatrix = {
  "Stocks,Gold": -0.1,
  "Stocks,Government Bonds": -0.2,
  "Stocks,Midcap Mutual Fund": 0.8,
  "Stocks,Real Estate Trust": 0.6,
  "Stocks,International ETF": 0.7,
  "Gold,Government Bonds": 0.1,
  "Gold,Midcap Mutual Fund": -0.05,
  "Government Bonds,Midcap Mutual Fund": -0.1,
  "Midcap Mutual Fund,International ETF": 0.75,
  "Gold,International ETF": 0.0,
};

// Get correlation between two instruments
export function getCorrelation(name1, name2) {
  if (name1 === name2) return 1.0;
  
  const key1 = `${name1},${name2}`;
  const key2 = `${name2},${name1}`;
  
  return correlationMatrix[key1] || correlationMatrix[key2] || 0.2;
}