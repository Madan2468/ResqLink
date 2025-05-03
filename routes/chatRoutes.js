// routes/chatRoutes.js
const router = require('express').Router();
const ChatMessage = require('../models/ChatMessage');
const protect = require('../middleware/authMiddleware');

router.post('/:caseId', protect, async (req, res) => {
  const { message } = req.body;
  const newMsg = new ChatMessage({
    caseId: req.params.caseId,
    userId: req.user._id,
    message
  });
  await newMsg.save();
  res.status(201).json(newMsg);
});

router.get('/:caseId', protect, async (req, res) => {
  const messages = await ChatMessage.find({ caseId: req.params.caseId })
    .populate('userId', 'name')
    .sort({ timestamp: 1 });
  res.json(messages);
});

module.exports = router;
