const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  emergency: {
    type: String,
    default: '108'
  },
  departments: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    default: ''
  },
  // Taluk classification for the hospital
  taluk: {
    type: String,
    required: true,
    enum: ['Mangaluru Taluk', 'Bantwal Taluk', 'Puttur Taluk', 'Sullia Taluk', 'Belthangady Taluk', 'Kadaba Taluk', 'Mulki Taluk']
  },
  // Exact Google Maps embed URL (iframe src). Optional.
  mapUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

module.exports = mongoose.model('Hospital', hospitalSchema);