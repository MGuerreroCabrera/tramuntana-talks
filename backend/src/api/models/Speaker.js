const mongoose = require('mongoose');

const hasLocalizedText = (value) => Boolean(
  value
  && typeof value === 'object'
  && typeof value.ca === 'string'
  && value.ca.trim()
  && typeof value.es === 'string'
  && value.es.trim()
);

const speakerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    position: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Position is required'],
      validate: {
        validator: hasLocalizedText,
        message: 'Position requires Catalan and Spanish text',
      },
    },
    bio: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Bio is required'],
      validate: {
        validator: hasLocalizedText,
        message: 'Bio requires Catalan and Spanish text',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Speaker', speakerSchema);
