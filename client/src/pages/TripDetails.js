import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTrip = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      setError('Failed to load trip details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const toggleSeat = (seatId, seatNumber, isBooked) => {
    if (isBooked) {
      setError('This seat is already booked');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setError('');
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.seatId === seatId || s.seatId?.toString() === seatId?.toString());
      if (exists) {
        return prev.filter(s => s.seatId !== seatId && s.seatId?.toString() !== seatId?.toString());
      } else {
        return [...prev, { seatId, seatNumber }];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: `/trip/${id}` } });
      return;
    }

    navigate('/checkout', { state: { trip, selectedSeats } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading trip details...</div>
      </div>
    );
  }

  if (error && !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Trip not found</div>
      </div>
    );
  }

  // Organize seats into a grid (6 rows A-F, 6 columns 1-6)
  const organizeSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsGrid = [];
    
    // Create a grid structure
    rows.forEach((row, rowIndex) => {
      const rowSeats = [];
      for (let col = 1; col <= 6; col++) {
        const seatIndex = rowIndex * 6 + col - 1;
        if (seatIndex < trip.seats.length) {
          const seat = trip.seats[seatIndex];
          rowSeats.push({
            ...seat,
            displayNumber: `${row}${col}`,
            row,
            col
          });
        } else {
          // Placeholder for empty seats
          rowSeats.push({
            _id: `placeholder-${row}-${col}`,
            seatNumber: `${row}${col}`,
            isBooked: false,
            displayNumber: `${row}${col}`,
            row,
            col,
            isPlaceholder: true
          });
        }
      }
      seatsGrid.push({ row, seats: rowSeats });
    });

    return seatsGrid;
  };

  const seatsGrid = organizeSeats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Trip Image Header */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg mb-6">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative h-full flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">
              {trip.from} → {trip.to}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Trip Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Trip Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">From</p>
                <p className="text-lg font-semibold">{trip.from}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">To</p>
                <p className="text-lg font-semibold">{trip.to}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Date</p>
                <p className="text-lg font-semibold">{formatDate(trip.date)}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Time</p>
                <p className="text-lg font-semibold">{trip.time}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Fare per seat</p>
                <p className="text-2xl font-bold text-blue-600">${trip.price}</p>
              </div>
            </div>
          </div>

          {/* Seat Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Select Your Seat</h2>
            <p className="text-gray-600 mb-6">Deluxe Cabin</p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Legend */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 border border-gray-400 rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-200 border border-red-400 rounded"></div>
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-200 border-2 border-blue-600 rounded"></div>
                <span className="text-sm">Selected</span>
              </div>
            </div>

            {/* Seat Grid */}
            <div className="space-y-2">
              {seatsGrid.map(({ row, seats }) => (
                <div key={row} className="flex items-center gap-2">
                  <div className="w-8 text-center font-semibold">{row}</div>
                  <div className="flex gap-2">
                    {seats.map((seat) => {
                      const isSelected = selectedSeats.find(
                        s => s.seatId?.toString() === seat._id?.toString() || 
                             s.seatId === seat._id
                      );
                      const isBooked = seat.isBooked;
                      
                      let bgColor = 'bg-gray-200 border-gray-400 hover:bg-gray-300';
                      let cursorClass = 'cursor-pointer';
                      
                      if (seat.isPlaceholder) {
                        bgColor = 'bg-gray-100 border-gray-300 opacity-30';
                        cursorClass = 'cursor-not-allowed';
                      } else if (isBooked) {
                        bgColor = 'bg-red-200 border-red-400 opacity-50';
                        cursorClass = 'cursor-not-allowed';
                      } else if (isSelected) {
                        bgColor = 'bg-blue-200 border-2 border-blue-600';
                      }

                      if (seat.isPlaceholder) {
                        return (
                          <div
                            key={seat._id}
                            className={`${bgColor} border rounded w-12 h-12 flex items-center justify-center text-sm font-medium ${cursorClass}`}
                          >
                            {seat.col}
                          </div>
                        );
                      }

                      return (
                        <button
                          key={seat._id}
                          onClick={() => toggleSeat(seat._id, seat.seatNumber, isBooked)}
                          disabled={isBooked || seat.isPlaceholder}
                          className={`${bgColor} border rounded w-12 h-12 flex items-center justify-center text-sm font-medium transition-all ${cursorClass} ${
                            !isBooked && !seat.isPlaceholder ? 'hover:scale-110 active:scale-95' : ''
                          }`}
                          title={seat.seatNumber}
                        >
                          {seat.col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Seats Summary */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Selected Seats</h3>
            {selectedSeats.length === 0 ? (
              <p className="text-gray-600">No seats selected</p>
            ) : (
              <div>
                <p className="text-lg font-semibold mb-2">
                  {selectedSeats.map(s => s.seatNumber).join(', ')}
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  Total: ${trip.price * selectedSeats.length}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Booking Button */}
          <button
            onClick={handleConfirm}
            disabled={selectedSeats.length === 0}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
