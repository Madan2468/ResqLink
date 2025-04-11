const Case = require('../models/Case');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

exports.reportCase = async (req, res) => {
  try {
    const { details, urgency, lat, lng } = req.body;
    let result = null;

    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      result = await streamUpload();
    }

    const newCase = await Case.create({
      user: req.user.id,
      details,
      urgency,
      location: { lat, lng },
      photo: result?.secure_url || null
    });

    const io = req.app.get('io');
    io.emit('new_case', newCase);

    res.status(201).json(newCase);
  } catch (err) {
    console.error('❌ Error uploading to Cloudinary:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().populate('user', 'name email role');
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findById(req.params.id).populate('user', 'name email');
    if (!singleCase) return res.status(404).json({ message: 'Case not found' });
    res.json(singleCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCaseStatus = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchCases = async (req, res) => {
  try {
    const { urgency, status } = req.query;
    const query = {};
    if (urgency) query.urgency = urgency;
    if (status) query.status = status;

    const results = await Case.find(query).populate('user');
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
