const Attendee = require('../models/Attendee');
const Talk = require('../models/Talk');

exports.getAll = async (req, res) => {
  try {
    const attendees = await Attendee.find()
      .populate('talkIds', 'title date time location')
      .sort({ createdAt: -1 });
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id)
      .populate('talkIds', 'title date time location');
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const attendee = new Attendee(req.body);
    await attendee.save();
    res.status(201).json(attendee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const attendee = await Attendee.findByIdAndDelete(req.params.id);
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }
    res.json({ message: 'Attendee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerToTalk = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }

    const talk = await Talk.findById(req.params.talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }

    if (attendee.talkIds.includes(req.params.talkId)) {
      return res.status(400).json({ message: 'Already registered for this talk' });
    }

    attendee.talkIds.push(req.params.talkId);
    await attendee.save();

    if (!talk.attendeeIds.includes(attendee._id)) {
      talk.attendeeIds.push(attendee._id);
      await talk.save();
    }

    const updatedAttendee = await Attendee.findById(req.params.id)
      .populate('talkIds', 'title date time location');

    res.json(updatedAttendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unregisterFromTalk = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) {
      return res.status(404).json({ message: 'Attendee not found' });
    }

    attendee.talkIds = attendee.talkIds.filter(
      id => id.toString() !== req.params.talkId
    );
    await attendee.save();

    await Talk.findByIdAndUpdate(req.params.talkId, {
      $pull: { attendeeIds: attendee._id }
    });

    const updatedAttendee = await Attendee.findById(req.params.id)
      .populate('talkIds', 'title date time location');

    res.json(updatedAttendee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};