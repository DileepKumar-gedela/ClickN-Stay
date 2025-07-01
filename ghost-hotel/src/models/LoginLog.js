const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  email: String,
  success: Boolean,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LoginLog', loginLogSchema);
