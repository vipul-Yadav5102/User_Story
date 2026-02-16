import React from 'react';

const ExpenseList = ({ expenses, filterCategory, sortDateDesc, onFilterChange, onSortChange }) => {

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);

  const formatDate = (date) =>
    new Date(date).toLocaleString();

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-200">Expense History</h2>

        <div className="flex gap-4 items-center">
          <select
            value={filterCategory}
            onChange={(e) => onFilterChange(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sortDateDesc}
              onChange={(e) => onSortChange(e.target.checked)}
              className="w-4 h-4 accent-indigo-500"
            />
            <span className="text-gray-400 text-sm">Newest First</span>
          </label>
        </div>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs text-gray-400 uppercase">Date</th>
            <th className="px-4 py-3 text-left text-xs text-gray-400 uppercase">Description</th>
            <th className="px-4 py-3 text-left text-xs text-gray-400 uppercase">Category</th>
            <th className="px-4 py-3 text-right text-xs text-gray-400 uppercase">Amount</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-800 transition">
              <td className="px-4 py-3 text-sm text-gray-300">{formatDate(expense.date)}</td>
              <td className="px-4 py-3 text-sm text-gray-200">{expense.description}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs bg-indigo-900 text-indigo-300 rounded-full">
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-medium text-gray-100">
                {formatCurrency(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
