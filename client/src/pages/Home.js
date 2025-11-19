import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filters, setFilters] = useState({ from: '', to: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/trips');
      setTrips(res.data);
      setFilteredTrips(res.data);
    } catch (err) {
      setError('Failed to load trips. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const applyFilters = useCallback(() => {
    let filtered = [...trips];

    if (filters.from) {
      filtered = filtered.filter(trip =>
        trip.from.toLowerCase().includes(filters.from.toLowerCase())
      );
    }

    if (filters.to) {
      filtered = filtered.filter(trip =>
        trip.to.toLowerCase().includes(filters.to.toLowerCase())
      );
    }

    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter(trip => {
        const tripDate = new Date(trip.date);
        return tripDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredTrips(filtered);
  }, [filters, trips]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getAvailableSeats = (trip) => {
    return trip.seats.filter(seat => !seat.isBooked).length;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate random rating and reviews for demo
  const getRandomRating = () => {
    const ratings = [4, 4.5, 5];
    const reviews = [89, 124, 156];
    return {
      rating: ratings[Math.floor(Math.random() * ratings.length)],
      reviews: reviews[Math.floor(Math.random() * reviews.length)]
    };
  };

  // Calculate discount percentage
  const getDiscount = (price) => {
    const discounts = [0, 21, 25];
    return discounts[Math.floor(Math.random() * discounts.length)];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Find Your Next Journey
            </h1>
            <p className="text-xl text-gray-600">
              Discover available trips and book your seats with ease.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Departure Location
                  </span>
                </label>
                <input
                  type="text"
                  name="from"
                  placeholder="From"
                  value={filters.from}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Arrival Location
                  </span>
                </label>
                <input
                  type="text"
                  name="to"
                  placeholder="To"
                  value={filters.to}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date
                  </span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => applyFilters()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Search Trips
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Trips Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Available Trips</h2>
          <p className="text-lg text-gray-600">
            Choose from our carefully selected destinations and enjoy a comfortable journey.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-xl text-gray-600">Loading trips...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg mb-6">
            {error}
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-2xl text-gray-600">
              {trips.length === 0
                ? 'No trips available. Admin can add trips from the Admin Panel.'
                : 'No trips match your filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => {
              const { rating, reviews } = getRandomRating();
              const discount = getDiscount(trip.price);
              const originalPrice = discount > 0 ? Math.round(trip.price / (1 - discount / 100)) : trip.price;
              
              return (
                <div
                  key={trip._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Trip Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                    <div className="absolute top-4 left-4">
                      {index === 0 && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      {discount > 0 && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({reviews} reviews)</span>
                    </div>

                    {/* Route */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      {trip.from} → {trip.to}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>4h 30min</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{getAvailableSeats(trip)} seats available</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(trip.date)}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {discount > 0 && (
                          <span className="text-gray-400 line-through text-lg mr-2">
                            ${originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-blue-600">
                          ${trip.price}
                        </span>
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <button
                      onClick={() => navigate(`/trip/${trip._id}`)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
