const mongoose = require('mongoose');

const hasLocalizedText = (value) => Boolean(
  value
  && typeof value === 'object'
  && typeof value.ca === 'string'
  && value.ca.trim()
  && typeof value.es === 'string'
  && value.es.trim()
);

const talkSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Title is required'],
      validate: {
        validator: hasLocalizedText,
        message: 'Title requires Catalan and Spanish text',
      },
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Description is required'],
      validate: {
        validator: hasLocalizedText,
        message: 'Description requires Catalan and Spanish text',
      },
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
