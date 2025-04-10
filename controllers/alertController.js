const Alert = require('../models/Alert');

exports.sendAlert = async (req, res) => {
  try {
    const { caseId, message, sentToRoles } = req.body;

    const alert = await Alert.create({ caseId, message, sentToRoles });

    const io = req.app.get('io');
    io.emit('alert', alert);

    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
};
