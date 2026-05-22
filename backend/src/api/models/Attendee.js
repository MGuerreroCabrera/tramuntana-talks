const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: ['mallorca', 'menorca', 'ibiza', 'other'],
    },
    company: {
      type: String,
      trim: true,
    },
    discoverySource: {
      type: String,
      required: [true, 'Discovery source is required'],
      enum: ['socialMedia', 'mailing', 'wordOfMouth', 'noneOfTheAbove'],
    },
    talkIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Talk',
      },
    ],
  },
  {
    timestamps: true,
  }
);

attendeeSchema.index({ email: 1 });

module.exports = mongoose.model('Attendee', attendeeSchema);