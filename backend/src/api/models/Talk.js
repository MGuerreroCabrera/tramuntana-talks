const mongoose = require('mongoose');

const talkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: ['auditorium', 'pressRoom', 'emprenbitSpace'],
    },
    speakerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speaker',
      },
    ],
    attendeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendee',
      },
    ],
  },
  {
    timestamps: true,
  }
);

talkSchema.index({ date: 1 });
talkSchema.index({ location: 1 });

module.exports = mongoose.model('Talk', talkSchema);