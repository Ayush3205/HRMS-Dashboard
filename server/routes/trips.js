const express = require('express');
const Trip = require('../models/Trip');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all trips (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    let query = {};

    if (from) query.from = new RegExp(from, 'i');
    if (to) query.to = new RegExp(to, 'i');
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const trips = await Trip.find(query).sort({ date: 1, time: 1 });
    res.json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create trip (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { from, to, date, time, price, totalSeats } = req.body;

    const trip = new Trip({
      from,
      to,
      date,
      time,
      price,
      totalSeats
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update trip (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { from, to, date, time, price, totalSeats } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Update trip details
    trip.from = from || trip.from;
    trip.to = to || trip.to;
    trip.date = date || trip.date;
    trip.time = time || trip.time;
    trip.price = price || trip.price;

    // Handle seat changes
    if (totalSeats && totalSeats !== trip.totalSeats) {
      const currentSeats = trip.seats.length;
      if (totalSeats > currentSeats) {
        // Add new seats
        for (let i = currentSeats + 1; i <= totalSeats; i++) {
          trip.seats.push({
            seatNumber: `Seat ${i}`,
            isBooked: false,
            bookedBy: null
          });
        }
      } else if (totalSeats < currentSeats) {
        // Remove unbooked seats only
        trip.seats = trip.seats.filter((seat, index) => {
          return index < totalSeats || seat.isBooked;
        });
      }
      trip.totalSeats = totalSeats;
    }

    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete trip (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

