import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit, Info, Check, X } from 'lucide-react';

const ExpenseCalculator: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingExpense, setEditingExpense] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('Office');

  // Mock data
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2023-04-15', description: 'Office rent', amount: 1200, category: 'Office' },
    { id: 2, date: '2023-05-03', description: 'Computer equipment', amount: 1549.99, category: 'Equipment' },
    { id: 3, date: '2023-05-12', description: 'Software subscriptions', amount: 79.99, category: 'Software' },
    { id: 4, date: '2023-06-23', description: 'Client meeting lunch', amount: 48.50, category: 'Entertainment' },
    { id: 5, date: '2023-07-05', description: 'Mobile phone bill', amount: 45.00, category: 'Utilities' },
    { id: 6, date: '2023-08-12', description: 'Train tickets', amount: 132.50, category: 'Travel' },
    { id: 7, date: '2023-09-01', description: 'Office supplies', amount: 85.25, category: 'Office' },
    { id: 8, date: '2023-10-18', description: 'Professional membership', amount: 250.00, category: 'Subscriptions' },
  ]);

  const categories = [
    'Office', 'Equipment', 'Software', 'Entertainment', 'Utilities', 'Travel', 'Subscriptions', 'Other'
  ];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (expense: any) => {
    setEditingExpense(expense.id);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
  };

  const cancelEditing = () => {
    setEditingExpense(null);
    setEditAmount('');
    setEditCategory('');
  };

  const saveEdit = (id: number) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? 
        { ...expense, amount: parseFloat(editAmount), category: editCategory } : 
        expense
    ));
    setEditingExpense(null);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addNewExpense = () => {
    if (!newExpenseAmount || !newExpenseDescription) return;
    
    const newExpense = {
      id: Math.max(...expenses.map(e => e.id), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      description: newExpenseDescription,
      amount: parseFloat(newExpenseAmount),
      category: newExpenseCategory
    };
    
    setExpenses([...expenses, newExpense]);
    setNewExpenseAmount('');
    setNewExpenseDescription('');
    setNewExpenseCategory('Office');
    setShowExpenseForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Expense Calculator</h1>
        <p className="text-gray-600">Manage and categorize your business expenses for tax deductions.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">£{totalExpenses.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Tax Year 2023/24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500">Allowable Expenses</p>
          <p className="text-2xl font-bold text-teal-600">£{(totalExpenses * 0.85).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">85% of total expenses</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500">Tax Savings Estimate</p>
          <p className="text-2xl font-bold text-indigo-600">£{(totalExpenses * 0.85 * 0.2).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">At 20% basic rate</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setShowExpenseForm(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Expense
        </button>
      </div>

      {/* Add Expense Form */}
      {showExpenseForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Add New Expense</h2>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowExpenseForm(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (£)
              </label>
              <input
                type="number"
                id="expense-amount"
                min="0"
                step="0.01"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newExpenseAmount}
                onChange={(e) => setNewExpenseAmount(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="expense-description"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newExpenseDescription}
                onChange={(e) => setNewExpenseDescription(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="expense-category"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newExpenseCategory}
                onChange={(e) => setNewExpenseCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShowExpenseForm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addNewExpense}
            >
              Save Expense
            </button>
          </div>
        </div>
      )}

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingExpense === expense.id ? (
                        <select
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {expense.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {editingExpense === expense.id ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                        />
                      ) : (
                        `£${expense.amount.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2 flex justify-center">
                      {editingExpense === expense.id ? (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => saveEdit(expense.id)}
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={cancelEditing}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => startEditing(expense)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteExpense(expense.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                    No expenses found. Add some expenses to get started.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <th scope="row" colSpan={3} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                  Total
                </th>
                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  £{filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Tax Rules Info */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Expense Tax Rules</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>To be allowable, expenses must be "wholly and exclusively" for business purposes.</p>
              <a href="#" className="font-medium text-blue-800 hover:text-blue-600 mt-1 block">
                Learn more about allowable expenses →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCalculator;