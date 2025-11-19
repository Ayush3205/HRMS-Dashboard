const express = require('express');
const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('trip')
      .sort({ bookingDate: -1 });

    const now = new Date();
    const upcoming = bookings.filter(b => {
      const tripDate = new Date(b.trip.date);
      return tripDate >= now && b.status === 'confirmed';
    });
    const past = bookings.filter(b => {
      const tripDate = new Date(b.trip.date);
      return tripDate < now || b.status === 'cancelled';
    });

    res.json({ upcoming, past });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { tripId, seatIds, paymentMethod } = req.body;

    console.log('Booking request:', { tripId, seatIds, paymentMethod, userId: req.user._id });

    if (!tripId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: 'Trip ID and seat IDs are required' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    console.log('Trip found:', trip.from, 'to', trip.to);
    console.log('Total seats in trip:', trip.seats.length);

    // Validate seats
    const selectedSeats = [];
    for (const seatId of seatIds) {
      // Try to find seat by ID (handle both string and ObjectId)
      let seat = trip.seats.id(seatId);
      
      // If not found, try to find by string comparison
      if (!seat) {
        seat = trip.seats.find(s => 
          s._id.toString() === seatId.toString() || 
          s._id.toString() === seatId
        );
      }

      if (!seat) {
        console.error('Seat not found:', seatId, 'Available seats:', trip.seats.map(s => s._id));
        return res.status(404).json({ message: `Seat ${seatId} not found in trip` });
      }
      
      if (seat.isBooked) {
        return res.status(400).json({ message: `Seat ${seat.seatNumber} is already booked` });
      }
      
      selectedSeats.push({
        seatNumber: seat.seatNumber,
        seatId: seat._id
      });
    }

    // Mark seats as booked
    for (const seatId of seatIds) {
      let seat = trip.seats.id(seatId);
      if (!seat) {
        seat = trip.seats.find(s => 
          s._id.toString() === seatId.toString() || 
          s._id.toString() === seatId
        );
      }
      if (seat) {
        seat.isBooked = true;
        seat.bookedBy = req.user._id;
      }
    }

    await trip.save();

    // Create booking
    const totalPrice = trip.price * selectedSeats.length;
    const booking = new Booking({
      user: req.user._id,
      trip: tripId,
      seats: selectedSeats,
      totalPrice,
      paymentMethod: paymentMethod || 'card'
    });

    await booking.save();
    await booking.populate('trip');

    console.log('Booking created successfully:', booking._id);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('trip');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Free up seats
    const trip = await Trip.findById(booking.trip._id);
    for (const seatInfo of booking.seats) {
      const seat = trip.seats.id(seatInfo.seatId);
      if (seat) {
        seat.isBooked = false;
        seat.bookedBy = null;
      }
    }

    await trip.save();
    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('trip')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

