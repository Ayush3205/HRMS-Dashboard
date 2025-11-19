import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (location.state?.booking) {
      setBooking(location.state.booking);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const handleDownloadTicket = () => {
    if (!booking) return;

    const ticketContent = `
TRAVEL BOOKING TICKET
====================

Booking ID: ${booking._id}
Date: ${new Date(booking.bookingDate).toLocaleString()}

Trip Details:
- From: ${booking.trip.from}
- To: ${booking.trip.to}
- Date: ${new Date(booking.trip.date).toLocaleDateString()}
- Time: ${booking.trip.time}

Seats: ${booking.seats.map(s => s.seatNumber).join(', ')}

Total Amount: $${booking.totalPrice}
Payment Method: ${booking.paymentMethod}

Status: ${booking.status.toUpperCase()}

Thank you for your booking!
    `;

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking._id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const qrData = JSON.stringify({
    bookingId: booking._id,
    trip: booking.trip.from + ' to ' + booking.trip.to,
    date: booking.trip.date,
    seats: booking.seats.map(s => s.seatNumber).join(', ')
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <div className="w-3 h-3 bg-white rounded-full"></div>
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h1 className="text-4xl font-bold text-gray-800">Confirmation</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your trip is successfully booked. Enjoy your journey!</p>
          </div>

          {/* Flight Ticket Card */}
          <div className="bg-blue-600 rounded-lg p-6 mb-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Flight Ticket</h3>
                <p className="text-sm opacity-90">Booking ID: #{booking._id.slice(-8).toUpperCase()}</p>
              </div>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{booking.trip.from}</p>
                <p className="text-sm opacity-90">09:30 AM</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center">
                  <div className="flex-1 border-t-2 border-dashed border-white opacity-50"></div>
                  <svg className="w-6 h-6 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <div className="flex-1 border-t-2 border-dashed border-white opacity-50"></div>
                </div>
                <p className="text-center text-sm mt-1">2h 30min</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{booking.trip.to}</p>
                <p className="text-sm opacity-90">12:00 PM</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-blue-500">
              <div>
                <p className="text-sm opacity-90">Date</p>
                <p className="font-semibold">{formatDate(booking.trip.date)}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Seats</p>
                <p className="font-semibold">{booking.seats.map(s => s.seatNumber).join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Total Fare */}
          <div className="flex justify-between items-center mb-6 pb-6 border-b">
            <span className="text-lg font-semibold text-gray-700">Total Fare Paid</span>
            <span className="text-3xl font-bold text-green-600">${booking.totalPrice}</span>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <QRCodeSVG value={qrData} size={200} />
            </div>
            <p className="text-sm text-gray-600 mt-4">Scan this QR code at the boarding gate</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleDownloadTicket}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Ticket
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
