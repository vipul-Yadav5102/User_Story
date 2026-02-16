const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

require('./database'); // connect MongoDB
const { Expense, IdempotencyLog } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

// POST /expenses
app.post('/expenses', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  const { amount, category, description, date } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key header is required' });
  }

  try {
    // 1. Check idempotency log
    const existingLog = await IdempotencyLog.findOne({ key: idempotencyKey });

    if (existingLog) {
      return res
        .status(existingLog.status_code)
        .json(JSON.parse(existingLog.response_body));
    }

    // 2. Validate inputs
    if (!amount || !Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive integer (in cents)' });
    }
    if (!category || !description || !date) {
      return res.status(400).json({ error: 'Category, description, and date are required' });
    }

    // 3. Insert expense
    const id = uuidv4();
    const created_at = new Date().toISOString();

    const expense = await Expense.create({
      id,
      amount,
      category,
      description,
      date,
      created_at,
    });

    // 4. Log idempotency
    const responseBody = JSON.stringify(expense.toObject());
    const statusCode = 201;

    await IdempotencyLog.create({
      key: idempotencyKey,
      response_body: responseBody,
      status_code: statusCode,
    });

    res.status(statusCode).json(expense);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /expenses
app.get('/expenses', async (req, res) => {
  const { category, sort } = req.query;

  try {
    let query = {};
    if (category) {
      query.category = category;
    }

    let expensesQuery = Expense.find(query);

    if (sort === 'date_desc') {
      expensesQuery = expensesQuery.sort({ date: -1 });
    }

    const expenses = await expensesQuery.exec();
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
