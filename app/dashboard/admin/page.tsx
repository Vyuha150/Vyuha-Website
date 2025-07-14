'use client';

import React from 'react';

export default function AdminDashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
        <p className="text-3xl font-bold text-orange-600">2,547</p>
        <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
      </div>
      
      {/* Events Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Events</h3>
        <p className="text-3xl font-bold text-orange-600">8</p>
        <p className="text-sm text-gray-500 mt-2">3 ending this week</p>
      </div>
      
      {/* Colleges Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Partner Colleges</h3>
        <p className="text-3xl font-bold text-orange-600">42</p>
        <p className="text-sm text-gray-500 mt-2">+2 new this month</p>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            <p className="text-sm text-gray-600">New user registration from XYZ College</p>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            <p className="text-sm text-gray-600">Event "Tech Workshop" updated</p>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            <p className="text-sm text-gray-600">New college partnership request</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
            Add New User
          </button>
          <button className="w-full px-4 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
            Create Event
          </button>
          <button className="w-full px-4 py-2 text-sm text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
} 