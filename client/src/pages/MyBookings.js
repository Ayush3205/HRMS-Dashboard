import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleViewTicket = (booking) => {
    navigate('/booking-success', { state: { booking } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (dateString, timeString) => {
    // Combine date and time for display
    return timeString;
  };

  const BookingCard = ({ booking, isPast }) => {
    const statusColor = booking.status === 'confirmed' 
      ? (isPast ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800')
      : 'bg-red-100 text-red-800';

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Booking ID</p>
            <p className="font-mono font-semibold text-gray-800">SLK{booking._id.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
            {isPast ? 'Completed' : 'Upcoming'}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {booking.trip.from} → {booking.trip.to}
          </h3>
          <div className="space-y-1 text-gray-600">
            <p><span className="font-semibold">Date:</span> {formatDate(booking.trip.date)}</p>
            <p><span className="font-semibold">Time:</span> {formatTime(booking.trip.date, booking.trip.time)}</p>
            <p><span className="font-semibold">Seats:</span> {booking.seats.map(s => s.seatNumber).join(', ')}</p>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          {isPast ? (
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ) : (
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleViewTicket(booking)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            View Ticket
          </button>
          {!isPast && booking.status === 'confirmed' && (
            <button
              onClick={() => handleCancel(booking._id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Upcoming Bookings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Bookings</h2>
          {bookings.upcoming.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              <p>No upcoming bookings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.upcoming.map(booking => (
                <BookingCard key={booking._id} booking={booking} isPast={false} />
              ))}
            </div>
          )}
        </div>

        {/* Past Bookings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Bookings</h2>
          {bookings.past.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              <p>No past bookings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.past.map(booking => (
                <BookingCard key={booking._id} booking={booking} isPast={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
