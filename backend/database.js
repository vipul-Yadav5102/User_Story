const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

// Connect to MongoDB (no deprecated options)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
