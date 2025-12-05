const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  // Define account schema here
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
