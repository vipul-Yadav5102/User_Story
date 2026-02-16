const mongoose = require('./database');

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  amount: { type: Number, required: true }, // stored in cents
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  created_at: { type: String, required: true },
});

const idempotencySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  response_body: { type: String, required: true },
  status_code: { type: Number, required: true },
});

const Expense = mongoose.model('Expense', expenseSchema);
const IdempotencyLog = mongoose.model('IdempotencyLog', idempotencySchema);

module.exports = { Expense, IdempotencyLog };
