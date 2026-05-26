const Attendee = require('../models/Attendee');
const Talk = require('../models/Talk');
const mongoose = require('mongoose');

const getLang = (value) => (value === 'es' ? 'es' : 'ca');

const getLocalizedText = (value, lang) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.ca || value.es || '';
};

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const serializeSpeaker = (speaker, lang) => ({
  _id: speaker._id,
  fullName: speaker.fullName,
  photoUrl: speaker.photoUrl || '',
  position: getLocalizedText(speaker.position, lang),
  bio: getLocalizedText(speaker.bio, lang),
});

const serializeTalk = (talk, lang) => ({
  _id: talk._id,
  title: getLocalizedText(talk.title, lang),
  description: getLocalizedText(talk.description, lang),
  date: talk.date,
  time: talk.time,
  location: talk.location,
  speakers: talk.speakerIds?.map((speaker) => serializeSpeaker(speaker, lang)) || [],
});

exports.getTalks = async (req, res) => {
  try {
    const lang = getLang(req.query.lang);
    const talks = await Talk.find()
      .populate('speakerIds', 'fullName photoUrl position bio')
      .sort({ date: 1, time: 1 });

    res.json(talks.map((talk) => serializeTalk(talk, lang)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTalkById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid talk id' });
    }

    const lang = getLang(req.query.lang);
    const talk = await Talk.findById(req.params.id).populate('speakerIds', 'fullName photoUrl position bio');

    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }

    res.json(serializeTalk(talk, lang));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerToTalk = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.talkId)) {
      return res.status(400).json({ message: 'Invalid talk id' });
    }

    const { fullName, email, location, company, discoverySource } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!fullName?.trim() || !normalizedEmail || !location || !discoverySource) {
      return res.status(400).json({ message: 'fullName, email, location and discoverySource are required' });
    }

    const talk = await Talk.findById(req.params.talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }

    let attendee = await Attendee.findOne({ email: normalizedEmail });
    if (!attendee) {
      attendee = new Attendee({
        fullName: fullName.trim(),
        email: normalizedEmail,
        location,
        company: company?.trim(),
        discoverySource,
        talkIds: [],
      });
      attendee.talkIds.push(talk._id);
      await attendee.save();
    } else {
      const isAlreadyRegistered = attendee.talkIds.some((talkId) => talkId.toString() === talk._id.toString());
      if (isAlreadyRegistered) {
        return res.status(400).json({ message: 'Already registered for this talk' });
      }

      await Attendee.findByIdAndUpdate(attendee._id, {
        $addToSet: { talkIds: talk._id },
      });
    }

    await Talk.findByIdAndUpdate(talk._id, {
      $addToSet: { attendeeIds: attendee._id },
    });

    res.status(201).json({ message: 'Registration completed', attendeeId: attendee._id, talkId: talk._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
