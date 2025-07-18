'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterOptions {
  states: string[];
  districts: string[];
}

interface AnalyticsFiltersProps {
  filterOptions: FilterOptions;
  selectedFilter: string;
  selectedState: string;
  selectedDistrict: string;
  onFilterChange: (filter: string) => void;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  onReset: () => void;
}

export default function AnalyticsFilters({
  filterOptions,
  selectedFilter,
  selectedState,
  selectedDistrict,
  onFilterChange,
  onStateChange,
  onDistrictChange,
  onReset
}: AnalyticsFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters & Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Primary Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Filter
          </label>
          <Select value={selectedFilter} onValueChange={onFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="college">By College</SelectItem>
              <SelectItem value="gender">By Gender</SelectItem>
              <SelectItem value="state">By State</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <Select value={selectedState} onValueChange={onStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {filterOptions.states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District
          </label>
          <Select 
            value={selectedDistrict} 
            onValueChange={onDistrictChange}
            disabled={!selectedState || selectedState === 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {filterOptions.districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div>
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
