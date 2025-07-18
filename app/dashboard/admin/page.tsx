'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalColleges: number;
}

interface ChartData {
  collegeData: any[];
  genderData: any[];
  stateData: any[];
  filterOptions: {
    states: string[];
    districts: string[];
  };
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('college');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await axios.get(`${baseUrl}/api/analytics/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Show real error - no fallback data
      setStats({
        totalUsers: 0,
        totalEvents: 0,
        totalColleges: 0
      });
    }
  };

  // Fetch chart data with filters
  const fetchChartData = async () => {
    try {
      setChartLoading(true);
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const params = new URLSearchParams({
        filter: selectedFilter,
        ...(selectedState && selectedState !== 'all' && { state: selectedState }),
        ...(selectedDistrict && selectedDistrict !== 'all' && { district: selectedDistrict })
      });
      
      const response = await axios.get(`${baseUrl}/api/analytics/chart-data?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Chart data received:', response.data);
      console.log('College data:', response.data.collegeData);
      
      setChartData(response.data);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Show empty data instead of fallback
      setChartData({
        collegeData: [],
        genderData: [],
        stateData: [],
        filterOptions: {
          states: [],
          districts: []
        }
      });
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [selectedFilter, selectedState, selectedDistrict]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setSelectedState('all');
    setSelectedDistrict('all');
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('all');
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
  };

  const handleResetFilters = () => {
    setSelectedFilter('college');
    setSelectedState('all');
    setSelectedDistrict('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const renderChart = () => {
    if (!chartData) return null;

    switch (selectedFilter) {
      case 'college':
        if (!chartData.collegeData || chartData.collegeData.length === 0) {
          return (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Students by College</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">No college data available. Students may not be assigned to colleges yet.</p>
              </div>
            </div>
          );
        }
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Students by College</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.collegeData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="maleCount" fill="#3b82f6" name="Male" />
                <Bar dataKey="femaleCount" fill="#f97316" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'gender':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.genderData.map(item => ({ name: item._id, value: item.count }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'state':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Students by State</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.stateData.map(item => ({ name: item._id, userCount: item.userCount }))} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="userCount" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.totalUsers || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">All registered users</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.totalEvents || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">All events</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Colleges</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats?.totalColleges || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">All colleges</p>
        </div>
      </div>

      {/* Simple Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Analytics Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Primary Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Filter</label>
            <select 
              value={selectedFilter} 
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            >
              <option value="college">By College</option>
              <option value="gender">By Gender</option>
              <option value="state">By State</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select 
              value={selectedState} 
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
            >
              <option value="all">All States</option>
              {chartData?.filterOptions.states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select 
              value={selectedDistrict} 
              onChange={(e) => handleDistrictChange(e.target.value)}
              disabled={!selectedState || selectedState === 'all'}
              className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100 text-gray-900 bg-white"
            >
              <option value="all">All Districts</option>
              {chartData?.filterOptions.districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div>
            <button 
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {chartLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        )}
        {renderChart()}
      </div>
    </div>
  );
} 