'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface PortfolioResultsProps {
  results: {
    allocations: Array<{
      name: string;
      weight: number;
      allocation: number;
      percentage: number;
      riskLevel: string;
      category: string;
    }>;
    metrics: {
      return: number;
      volatility: number;
      sharpeRatio: number;
      riskLevel: string;
    };
    projection: {
      expectedValue: number;
      riskLevel: string;
    };
    totalAmount: number;
  };
}

export default function PortfolioResults({ results }: PortfolioResultsProps) {
  const { allocations, metrics, projection, totalAmount } = results;

  // Generate colors for the chart
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const chartData = {
    labels: allocations.map(a => a.name),
    datasets: [
      {
        data: allocations.map(a => a.percentage),
        backgroundColor: colors.slice(0, allocations.length),
        borderColor: colors.slice(0, allocations.length).map(color => color + '80'),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            return `${context.label}: ${context.parsed.toFixed(2)}%`;
          },
        },
      },
    },
  };

  const barData = {
    labels: allocations.map(a => a.name.length > 15 ? a.name.substring(0, 15) + '...' : a.name),
    datasets: [
      {
        label: 'Allocation (%)',
        data: allocations.map(a => a.percentage),
        backgroundColor: colors.slice(0, allocations.length),
        borderColor: colors.slice(0, allocations.length),
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            return `${context.parsed.y.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            return value + '%';
          },
        },
      },
    },
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
    <div className="space-y-6 stagger">
      {/* Portfolio Performance Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 animate-pop" aria-live="polite">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Portfolio Performance
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-blue-700">Expected Return</span>
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 14l4-4 3 3 6-6"/>
              </svg>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {(metrics.return * 100).toFixed(2)}%
            </div>
          </div>

          <div className="p-4 rounded-lg border border-orange-100 bg-orange-50/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-orange-700">Volatility</span>
              <svg className="w-4 h-4 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 18h16M4 12h10M4 6h7"/>
              </svg>
            </div>
            <div className="text-2xl font-bold text-orange-700">
              {(metrics.volatility * 100).toFixed(2)}%
            </div>
          </div>

          <div className="p-4 rounded-lg border border-green-100 bg-green-50/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-green-700">Sharpe Ratio</span>
              <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18"/>
              </svg>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {metrics.sharpeRatio.toFixed(2)}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="text-xs font-medium text-gray-700 mb-1.5">Risk Level</div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(metrics.riskLevel)}`}>
              {metrics.riskLevel} Risk
            </div>
          </div>
        </div>
      </div>

      {/* 1-Year Projection */}
      <div className="bg-white rounded-lg shadow-md p-6 animate-pop" aria-live="polite">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          1-Year Projection
        </h2>

        <div className="relative overflow-hidden text-center p-6 rounded-xl border border-indigo-100 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-indigo-700 border border-indigo-100 mb-3">
            Projection (YoY)
          </div>
          <div className="text-3xl font-extrabold text-indigo-700 mb-1">
            ₹{projection.expectedValue.toLocaleString('en-IN')}
          </div>
          <div className="text-gray-600">
            Expected Portfolio Value
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Growth: ₹{(projection.expectedValue - totalAmount).toLocaleString('en-IN')}
            ({(((projection.expectedValue - totalAmount) / totalAmount) * 100).toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Allocation Charts */}
      <div className="bg-white rounded-lg shadow-md p-6 animate-pop">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Allocation Overview
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doughnut Chart */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 text-center">
              Allocation Distribution
            </h3>
            <div className="h-64 md:h-80">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* Bar Chart */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 text-center">
              Allocation Breakdown
            </h3>
            <div className="h-64 md:h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Allocation Table */}
      <div className="bg-white rounded-lg shadow-md p-6 pr-6 mr-1 animate-pop">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Detailed Allocation
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Detailed allocation table">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-2.5 px-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">Instrument</th>
                <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">Weight</th>
                <th className="text-right py-2.5 px-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">Amount</th>
                <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">Risk Level</th>
                <th className="text-center py-2.5 px-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">Category</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((allocation, index) => (
                <tr key={allocation.name} className="border-b border-gray-100 odd:bg-white even:bg-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <span className="font-medium">{allocation.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 font-semibold">
                    {allocation.percentage.toFixed(2)}%
                  </td>
                  <td className="text-right py-3 px-2">
                    ₹{allocation.allocation.toLocaleString('en-IN')}
                  </td>
                  <td className="text-center py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(allocation.riskLevel)}`}>
                      {allocation.riskLevel}
                    </span>
                  </td>
                  <td className="text-center py-3 px-2 text-gray-600">
                    {allocation.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}