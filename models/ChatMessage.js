// models/ChatMessage.js
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
