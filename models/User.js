const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'volunteer', 'ngo', 'vet'], default: 'user' },
  location: String,
  phone: String
});

module.exports = mongoose.model('User', userSchema);
