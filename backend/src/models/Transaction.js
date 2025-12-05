const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Define transaction schema here
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
