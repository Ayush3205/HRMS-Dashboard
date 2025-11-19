import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/admin.css';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('trips');
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    price: '',
    totalSeats: ''
  });

  useEffect(() => {
    fetchTrips();
    fetchBookings();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      // Get all bookings by fetching from all users (admin only)
      const res = await api.get('/bookings/my-bookings');
      // For admin, we'd need a different endpoint, but using this for now
      setBookings([]);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (editingTrip) {
        await api.put(`/trips/${editingTrip._id}`, formData);
        setSuccess('Trip updated successfully!');
      } else {
        await api.post('/trips', formData);
        setSuccess('Trip added successfully!');
      }
      
      setFormData({
        from: '',
        to: '',
        date: '',
        time: '',
        price: '',
        totalSeats: ''
      });
      setEditingTrip(null);
      setShowModal(false);
      fetchTrips();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save trip');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      from: trip.from,
      to: trip.to,
      date: new Date(trip.date).toISOString().split('T')[0],
      time: trip.time,
      price: trip.price,
      totalSeats: trip.totalSeats
    });
    setShowModal(true);
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      await api.delete(`/trips/${tripId}`);
      setSuccess('Trip deleted successfully!');
      fetchTrips();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete trip');
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingTrip(null);
    setFormData({
      from: '',
      to: '',
      date: '',
      time: '',
      price: '',
      totalSeats: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTrip(null);
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const upcomingTrips = trips.filter(trip => new Date(trip.date) >= new Date()).length;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      {/* Admin Overview */}
      <div className="admin-overview">
        <div className="overview-card">
          <div className="overview-icon blue">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div className="overview-content">
            <p className="overview-number">{trips.length}</p>
            <p className="overview-label">Total Trips</p>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon green">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="overview-content">
            <p className="overview-number">{bookings.length}</p>
            <p className="overview-label">Total Bookings</p>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon yellow">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="overview-content">
            <p className="overview-number">{upcomingTrips}</p>
            <p className="overview-label">Upcoming Departures</p>
          </div>
        </div>
      </div>

      {/* Trip Management */}
      <div className="admin-section">
        <div className="section-header">
          <h2>Trip Management</h2>
          <div className="section-buttons">
            <button
              className={`btn-tab ${activeSection === 'trips' ? 'active' : ''}`}
              onClick={() => setActiveSection('trips')}
            >
              All Trips
            </button>
            <button
              className="btn-primary"
              onClick={openAddModal}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Trip
            </button>
          </div>
        </div>

        {error && <div className="admin-message error">{error}</div>}
        {success && <div className="admin-message success">{success}</div>}

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Price</th>
                <th>Total Seats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip, index) => (
                <tr key={trip._id}>
                  <td>T{String(index + 1).padStart(3, '0')}</td>
                  <td>{trip.from} to {trip.to}</td>
                  <td>{trip.time}</td>
                  <td>{formatDate(trip.date)}</td>
                  <td>${trip.price}</td>
                  <td>{trip.totalSeats}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(trip)}
                        className="btn-icon edit"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(trip._id)}
                        className="btn-icon delete"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Trip Details</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>From</label>
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="Departure Location"
                  required
                />
              </div>
              <div className="form-group">
                <label>To</label>
                <input
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="Arrival Destination"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date & Time</label>
                <div className="form-row">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Seat</label>
                  <input
                    type="number"
                    name="totalSeats"
                    value={formData.totalSeats}
                    onChange={handleChange}
                    placeholder="Total no. of seats"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
