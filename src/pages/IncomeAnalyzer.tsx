import React, { useState } from 'react';
import { PieChart, BarChart3, Filter, Download, Share } from 'lucide-react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const IncomeAnalyzer: React.FC = () => {
  const [view, setView] = useState<'chart' | 'table'>('chart');
  const [incomeType, setIncomeType] = useState<'all' | 'employment' | 'self-employment' | 'investments' | 'other'>('all');

  // Mock data
  const totalIncome = 48750.45;
  const incomeCategories = [
    { id: 1, source: 'Self-employment', amount: 35250.00, percentage: 72.3 },
    { id: 2, source: 'Employment (PAYE)', amount: 8500.25, percentage: 17.4 },
    { id: 3, source: 'Bank Interest', amount: 1245.20, percentage: 2.6 },
    { id: 4, source: 'Dividends', amount: 3755.00, percentage: 7.7 },
  ];
  
  // Mock monthly data
  const monthlyData = [
    { month: 'Apr', amount: 3950 },
    { month: 'May', amount: 4120 },
    { month: 'Jun', amount: 3880 },
    { month: 'Jul', amount: 4250 },
    { month: 'Aug', amount: 4100 },
    { month: 'Sep', amount: 3990 },
    { month: 'Oct', amount: 4300 },
    { month: 'Nov', amount: 4450 },
    { month: 'Dec', amount: 3750 },
    { month: 'Jan', amount: 3900 },
    { month: 'Feb', amount: 4150 },
    { month: 'Mar', amount: 3910 },
  ];

  // Filter income based on selected type
  const filteredIncome = incomeType === 'all' 
    ? incomeCategories 
    : incomeCategories.filter(cat => {
        if (incomeType === 'self-employment' && cat.source === 'Self-employment') return true;
        if (incomeType === 'employment' && cat.source === 'Employment (PAYE)') return true;
        if (incomeType === 'investments' && (cat.source === 'Dividends' || cat.source === 'Bank Interest')) return true;
        if (incomeType === 'other' && !['Self-employment', 'Employment (PAYE)', 'Dividends', 'Bank Interest'].includes(cat.source)) return true;
        return false;
      });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Income Analyzer</h1>
        <p className="text-gray-600">Analyze and categorize your income for the 2023/24 tax year.</p>
      </div>

      {/* Summary card */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg shadow-md p-6 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-indigo-100 font-medium">Total Income</p>
            <p className="text-3xl font-bold">£{totalIncome.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-indigo-100 font-medium">Tax Year</p>
            <p className="text-xl font-semibold">2023/24</p>
          </div>
          <div>
            <p className="text-indigo-100 font-medium">Sources</p>
            <p className="text-xl font-semibold">{incomeCategories.length}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('chart')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              view === 'chart' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <PieChart className="h-4 w-4 mr-1" />
              Chart View
            </div>
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              view === 'table' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-1" />
              Table View
            </div>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              id="income-filter"
              name="income-filter"
              className="appearance-none block pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value as any)}
            >
              <option value="all">All Income</option>
              <option value="self-employment">Self-employment</option>
              <option value="employment">Employment</option>
              <option value="investments">Investments</option>
              <option value="other">Other Income</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Filter className="h-4 w-4" />
            </div>
          </div>
          
          <button
            className="p-1.5 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            aria-label="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          
          <button
            className="p-1.5 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            aria-label="Share"
          >
            <Share className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{incomeType === 'all' ? 'Income Distribution' : `${incomeType.charAt(0).toUpperCase() + incomeType.slice(1)} Income`}</h2>
            
            {view === 'chart' ? (
              <div className="relative aspect-video">
                <Chart
                  type="pie"
                  data={{
                    labels: filteredIncome.map(cat => cat.source),
                    datasets: [{
                      data: filteredIncome.map(cat => cat.amount),
                      backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(147, 51, 234, 0.8)',
                        'rgba(236, 72, 153, 0.8)'
                      ]
                    }]
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIncome.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          £{category.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {category.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <th scope="row" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        £{filteredIncome.reduce((sum, cat) => sum + cat.amount, 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            
            {/* Monthly Trend */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Monthly Trend</h3>
              <div className="h-48 grid grid-cols-12 gap-2 items-end">
                {monthlyData.map((data, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className="bg-indigo-500 hover:bg-indigo-600 rounded-t w-full"
                      style={{ height: `${(data.amount / 5000) * 100}%` }}
                    ></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded px-2 py-1 mt-1 whitespace-nowrap">
                      £{data.amount}
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Income Categories</h2>
            
            <div className="space-y-4">
              {incomeCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{category.source}</h3>
                      <p className="text-lg font-semibold">£{category.amount.toFixed(2)}</p>
                    </div>
                    <div className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full">
                      {category.percentage}%
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Tax Implications</h3>
              <div className="bg-orange-50 border-l-4 border-orange-400 p-3">
                <p className="text-sm text-orange-700">
                  Based on your income, you're in the <strong>Higher Rate</strong> tax band.
                </p>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Income tax estimate: <span className="font-semibold text-gray-800">£8,526.32</span></p>
                <p>National Insurance: <span className="font-semibold text-gray-800">£3,284.25</span></p>
                <a href="#" className="text-indigo-600 hover:text-indigo-500 block mt-2">
                  View detailed tax breakdown →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeAnalyzer;