import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center">
      <span className="mr-2">✔</span>
      {message}
    </div>
  );
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortDateDesc, setSortDateDesc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${process.env.REACT_APP_API_URL}/expenses`;
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (sortDateDesc) params.append('sort', 'date_desc');

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await axios.get(url);
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, sortDateDesc]);

  const totalAmountInCents = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalAmountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalAmountInCents / 100);

  const categoryBreakdown = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category, amount]) => ({
      category,
      amount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount / 100),
    }));

  const handleExpenseAdded = () => {
    fetchExpenses();
    setToastMessage('Expense added successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-8 font-sans">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-indigo-400 mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-400">
            Track, analyze and control your spending
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl h-full">
            <h3 className="text-gray-400 text-sm uppercase font-semibold mb-2">
              Total Expenses
            </h3>
            <p className="text-4xl font-bold text-indigo-400 mb-2">
              {totalAmountFormatted}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {filterCategory ? `Filtered: ${filterCategory}` : 'All Categories'}
            </p>

            {topCategories.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">
                  Top Spending
                </h4>
                <ul className="space-y-2">
                  {topCategories.map((item) => (
                    <li key={item.category} className="flex justify-between">
                      <span className="text-gray-400">{item.category}</span>
                      <span className="font-medium text-gray-200">{item.amount}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading expenses...</p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            filterCategory={filterCategory}
            sortDateDesc={sortDateDesc}
            onFilterChange={setFilterCategory}
            onSortChange={setSortDateDesc}
          />
        )}
      </div>
    </div>
  );
}

export default App;