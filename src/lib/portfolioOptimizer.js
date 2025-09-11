import { multiply, zeros } from 'mathjs';
import { products as defaultProducts, getCorrelation } from './portfolioData';

// Build Covariance Matrix - Convert to plain arrays for better performance
export function buildCovMatrix(selectedNames, stds) {
  const n = selectedNames.length;
  const Sigma = [];
  
  for (let i = 0; i < n; i++) {
    Sigma[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        Sigma[i][j] = stds[i] ** 2;
      } else {
        const corr = getCorrelation(selectedNames[i], selectedNames[j]);
        Sigma[i][j] = corr * stds[i] * stds[j];
      }
    }
  }
  
  return Sigma;
}

// Matrix multiplication for arrays
function matrixMultiply(A, B) {
  if (Array.isArray(B[0])) {
    // A is vector, B is matrix
    const result = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let i = 0; i < A.length; i++) {
        sum += A[i] * B[i][j];
      }
      result[j] = sum;
    }
    return result;
  } else {
    // A is vector, B is vector (dot product)
    let sum = 0;
    for (let i = 0; i < A.length; i++) {
      sum += A[i] * B[i];
    }
    return sum;
  }
}

// Simplified portfolio optimization using analytical solutions where possible
export function optimizePortfolio(returns, Sigma, options = {}) {
  const {
    mode = "balanced",
    maxIterations = 50,
    learningRate = 0.1,
    diversification = "yes",
    // Preference-driven coefficients (aligned with Python backend semantics)
    u = 1.0,
    gamma = mode === "return" ? 0.1 : 2.0,
    lambdaRp = mode === "balanced" ? 5.0 : 1.0,
  } = options;

  // Minimum weight constraint depends on diversification preference
  const minWeight = (mode === "balanced" && diversification === "yes") ? 0.02 : 0.0;
  
  const n = returns.length;
  let weights = new Array(n).fill(1 / n); // Equal weights initialization
  
  // For simple cases, use analytical solutions
  if (n === 2) {
    return optimizeTwoAssets(returns, Sigma, mode);
  }
  
  // Preference-aware objective function
  function objective(w) {
    const meanRet = w.reduce((sum, weight, i) => sum + weight * returns[i], 0);
    const variance = quadraticForm(w, Sigma);
    // Diversification penalty (HHI): scaled by lambdaRp when diversification requested
    const sumSq = w.reduce((s, wi) => s + wi * wi, 0);
    const divAlpha = 0.05 * (mode === "balanced" ? (lambdaRp / 5.0) : 0.0);
    const divPenalty = (mode === "balanced" && diversification === "yes") ? divAlpha * sumSq : 0;

    // Utility term and risk term driven by preferences
    const utilTerm = -u * meanRet;
    const riskTerm = gamma * variance;

    return utilTerm + riskTerm + divPenalty;
  }
  
  // Simplified gradient descent
  for (let iter = 0; iter < maxIterations; iter++) {
    const gradient = new Array(n).fill(0);
    const eps = 1e-6;
    
    const currentObj = objective(weights);
    
    // Numerical gradient with single-sided difference
    for (let i = 0; i < n; i++) {
      const wPlus = [...weights];
      wPlus[i] += eps;
      gradient[i] = (objective(wPlus) - currentObj) / eps;
    }
    
    // Update weights
    for (let i = 0; i < n; i++) {
      weights[i] -= learningRate * gradient[i];
      weights[i] = Math.max(minWeight, weights[i]); // Diversification-aware minimum weight
    }
    
    // Normalize to sum to 1
    const sum = weights.reduce((s, w) => s + w, 0);
    weights = weights.map(w => w / sum);
    
    // Early stopping if converged
    const gradientNorm = Math.sqrt(gradient.reduce((sum, g) => sum + g * g, 0));
    if (gradientNorm < 1e-4) {
      console.log(`Converged after ${iter + 1} iterations`);
      break;
    }
  }
  
  return weights;
}

// Analytical solution for two assets
function optimizeTwoAssets(returns, Sigma, mode) {
  const [r1, r2] = returns;
  const var1 = Sigma[0][0];
  const var2 = Sigma[1][1];
  const cov12 = Sigma[0][1];
  
  if (mode === "return") {
    // Return-focused: choose asset with higher return
    return r1 > r2 ? [0.8, 0.2] : [0.2, 0.8];
  } else {
    // Balanced: use simplified Markowitz formula
    const denominator = var1 + var2 - 2 * cov12;
    if (Math.abs(denominator) < 1e-8) {
      return [0.5, 0.5]; // Equal weights if assets are perfectly correlated
    }
    
    let w1 = (var2 - cov12) / denominator;
    w1 = Math.max(0.1, Math.min(0.9, w1)); // Constrain between 10% and 90%
    
    return [w1, 1 - w1];
  }
}

// Efficient quadratic form calculation w^T * Sigma * w
function quadraticForm(w, Sigma) {
  let result = 0;
  const n = w.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result += w[i] * Sigma[i][j] * w[j];
    }
  }
  
  return result;
}

// Portfolio Performance Metrics - using plain arrays
export function portfolioMetrics(weights, returns, Sigma) {
  const portReturn = weights.reduce((sum, weight, i) => sum + weight * returns[i], 0);
  const portVar = quadraticForm(weights, Sigma);
  const portVol = Math.sqrt(portVar);
  const sharpeLike = portVol > 0 ? portReturn / portVol : 0;
  
  let riskLevel;
  if (portVol < 0.08) {
    riskLevel = "Low";
  } else if (portVol < 0.15) {
    riskLevel = "Medium";
  } else {
    riskLevel = "High";
  }
  
  return {
    return: portReturn,
    volatility: portVol,
    sharpeRatio: sharpeLike,
    riskLevel
  };
}

// Future 1-Year Projection
export function oneYearProjection(amount, portReturn, portVol) {
  const expectedValue = amount * (1 + portReturn);
  
  let riskLevel;
  if (portVol < 0.08) {
    riskLevel = "Low";
  } else if (portVol < 0.15) {
    riskLevel = "Medium";
  } else {
    riskLevel = "High";
  }
  
  return {
    expectedValue,
    riskLevel
  };
}

// Get Investor Preferences with robust normalization (matches Python backend)
export function getInvestorPreferences(mode, returnSafety, riskTolerance, diversification) {
  const norm = (x) => (x == null ? null : String(x).trim().toLowerCase());

  // Normalize inputs from UI or external labels
  let m = norm(mode);
  let rs = norm(returnSafety);
  let rt = norm(riskTolerance);
  let dv = norm(diversification);

  const returnMap = {
    "safety": "safety",
    "safety first": "safety",
    "safe": "safety",
    "balanced": "balanced",
    "balance": "balanced",
    "return": "return",
    "return focus": "return",
    "return focused": "return",
    "growth": "return",
    "maximize returns": "return",
    "maximize potential returns": "return",
  };
  const riskMap = {
    "low": "low",
    "conservative": "low",
    "medium": "medium",
    "moderate": "medium",
    "high": "high",
    "aggressive": "high",
  };
  const divMap = {
    "yes": "yes",
    "y": "yes",
    "high diversification": "yes",
    "diversified": "yes",
    "no": "no",
    "n": "no",
    "focused portfolio": "no",
    "concentrated": "no",
  };

  rs = returnMap[rs] || "balanced";
  rt = riskMap[rt] || "medium";
  dv = dv == null ? dv : (divMap[dv] || dv);
  m = (m === "balanced" || m === "return") ? m : "balanced";

  const uMap = { safety: 0.5, balanced: 1.0, return: 2.0 };
  const gammaMap = { low: 10.0, medium: 5.0, high: 1.0 };

  const u = uMap[rs];
  const gamma = gammaMap[rt];
  const lambdaRp = (m === "balanced" && dv === "yes") ? 5.0 : 1.0;

  // Return normalized diversification so downstream uses consistent values
  return { u, gamma, lambdaRp, diversification: dv };
}

// Main Portfolio Runner
export function runPortfolio(amount, selectedNames, preferences, mode = "balanced", productsMapOverride) {
  console.log('Starting portfolio optimization...', { selectedNames, mode });
  
  const productsMap = productsMapOverride || defaultProducts;
  const returns = selectedNames.map(name => (productsMap[name]?.return ?? 0));
  const stds = selectedNames.map(name => (productsMap[name]?.std ?? 0));
  const Sigma = buildCovMatrix(selectedNames, stds);
  
  console.log('Built covariance matrix:', Sigma);
  
  const weights = optimizePortfolio(returns, Sigma, {
    mode,
    diversification: preferences?.diversification ?? "yes",
    u: preferences?.u ?? 1.0,
    gamma: preferences?.gamma ?? (mode === "return" ? 0.1 : 2.0),
    lambdaRp: preferences?.lambdaRp ?? (mode === "balanced" ? 5.0 : 1.0),
  });
  
  console.log('Optimized weights:', weights);
  
  const metrics = portfolioMetrics(weights, returns, Sigma);
  const projection = oneYearProjection(amount, metrics.return, metrics.volatility);
  
  // Create allocation details
  const allocations = selectedNames.map((name, i) => ({
    name,
    weight: weights[i],
    allocation: weights[i] * amount,
    percentage: weights[i] * 100,
    riskLevel: productsMap[name]?.risk_level ?? 'Unknown',
    category: productsMap[name]?.category ?? 'Unknown'
  }));
  
  console.log('Portfolio optimization completed successfully');
  
  return {
    allocations,
    metrics,
    projection,
    totalAmount: amount
  };
}