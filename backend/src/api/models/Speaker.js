const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Speaker', speakerSchema);