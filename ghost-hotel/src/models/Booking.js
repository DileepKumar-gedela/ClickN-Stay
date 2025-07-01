const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  room_type: String,
  date: String,
  location: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
