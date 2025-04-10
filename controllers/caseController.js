const Case = require('../models/Case');
const cloudinary = require('../config/cloudinary');

exports.reportCase = async (req, res) => {
  try {
    const { details, urgency, lat, lng } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path);

    const newCase = await Case.create({
      user: req.user.id,
      details,
      urgency,
      location: { lat, lng },
      photo: result.secure_url
    });

    const io = req.app.get('io');
    io.emit('new_case', newCase);

    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCases = async (req, res) => {
  const cases = await Case.find().populate('user', 'name email role');
  res.json(cases);
};

exports.getCaseById = async (req, res) => {
  const singleCase = await Case.findById(req.params.id).populate('user', 'name email');
  if (!singleCase) return res.status(404).json({ message: 'Case not found' });
  res.json(singleCase);
};

exports.updateCaseStatus = async (req, res) => {
  const updated = await Case.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(updated);
};

exports.searchCases = async (req, res) => {
  const { urgency, status } = req.query;
  const query = {};
  if (urgency) query.urgency = urgency;
  if (status) query.status = status;

  const results = await Case.find(query).populate('user');
  res.json(results);
};
