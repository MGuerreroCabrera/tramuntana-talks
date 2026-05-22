const Speaker = require('../models/Speaker');

exports.getAll = async (req, res) => {
  try {
    const speakers = await Speaker.find().sort({ createdAt: -1 });
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const speaker = new Speaker(req.body);
    await speaker.save();
    res.status(201).json(speaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    res.json(speaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    res.json({ message: 'Speaker deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};