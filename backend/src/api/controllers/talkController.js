const Talk = require('../models/Talk');

exports.getAll = async (req, res) => {
  try {
    const { date, location } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (location) filter.location = location;

    const talks = await Talk.find(filter)
      .populate('speakerIds', 'fullName photoUrl position bio')
      .populate('attendeeIds', 'fullName email')
      .sort({ date: 1, time: 1 });
    res.json(talks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const talk = await Talk.findById(req.params.id)
      .populate('speakerIds', 'fullName photoUrl position bio')
      .populate('attendeeIds', 'fullName email');
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.json(talk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const talk = new Talk(req.body);
    await talk.save();
    res.status(201).json(talk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const talk = await Talk.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.json(talk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const talk = await Talk.findByIdAndDelete(req.params.id);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }
    res.json({ message: 'Talk deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
