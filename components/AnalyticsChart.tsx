'use client';

import React from 'react';
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

interface ChartData {
  name: string;
  value: number;
  maleCount?: number;
  femaleCount?: number;
  userCount?: number;
  collegeCount?: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  type: 'bar' | 'pie';
  title: string;
  dataKey?: string;
  showGender?: boolean;
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsChart({ 
  data, 
  type, 
  title, 
  dataKey = 'value',
  showGender = false 
}: AnalyticsChartProps) {
  if (type === 'pie') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {showGender ? (
            <>
              <Bar dataKey="maleCount" fill="#3b82f6" name="Male" />
              <Bar dataKey="femaleCount" fill="#f97316" name="Female" />
            </>
          ) : (
            <Bar dataKey={dataKey} fill="#f97316" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
