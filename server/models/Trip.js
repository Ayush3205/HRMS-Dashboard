const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

const tripSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  seats: [seatSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Initialize seats when trip is created
tripSchema.pre('save', function(next) {
  if (this.isNew && this.seats.length === 0) {
    for (let i = 1; i <= this.totalSeats; i++) {
      this.seats.push({
        seatNumber: `Seat ${i}`,
        isBooked: false,
        bookedBy: null
      });
    }
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);

