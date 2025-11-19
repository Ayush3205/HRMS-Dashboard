import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Profile</h1>
        
        {/* Profile Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{user.name}</h2>
              <p className="text-lg text-gray-600">{user.email}</p>
              <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold">
                Manage Profile
              </button>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-800">{user.email}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add another email
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Password</p>
                <p className="text-lg font-semibold text-gray-800">************</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone number</p>
                <p className="text-lg font-semibold text-gray-800">+1 000-000-0000</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="text-lg font-semibold text-gray-800">St 32 main downtown, Los Angeles, California, USA</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-semibold">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date of birth</p>
                <p className="text-lg font-semibold text-gray-800">01-01-1992</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-4">
  <div>
    <p className="text-sm text-gray-600 mb-1">Account Creation Date</p>
    <p className="text-lg font-semibold text-gray-800">
      {formatDate(user.createdAt)}
    </p>
  </div>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
