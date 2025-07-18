'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SmallLoader from '@/components/SmallLoader';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AchievementForm from './components/AchievementForm';
import AdminNewsCard from './components/AdminNewsCard';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  createdAt: string;
}


export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const fetchAchievements = async () => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await axios.get(`${baseUrl}/api/achievements/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAchievements(response.data);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleDelete = async (achievementId: string) => {
    try {
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      await axios.delete(`${baseUrl}/api/achievements/${achievementId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchAchievements();
    } catch (err) {
      console.error('Error deleting achievement:', err);
      setError('Failed to delete achievement');
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAchievement(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
    fetchAchievements();
  };

  const handleView = (achievement: Achievement) => {
    // Handle view action - could open a preview modal or navigate to view page
    console.log('Viewing achievement:', achievement);
  };

  if (loading) return (
    <div className="p-6">
      <SmallLoader message="Loading achievements..." size="large" />
    </div>
  );
  
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Manage Achievements</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <AdminNewsCard
            key={achievement._id}
            achievement={achievement}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No achievements found.</p>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">
              {selectedAchievement ? 'Edit Achievement' : 'Add New Achievement'}
            </DialogTitle>
          </DialogHeader>
          <AchievementForm
            initialData={selectedAchievement || undefined}
            isEditing={!!selectedAchievement}
            achievementId={selectedAchievement?._id}
            onSuccess={handleModalClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
