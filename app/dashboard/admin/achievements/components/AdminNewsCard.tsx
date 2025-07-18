'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  createdAt: string;
}

interface AdminNewsCardProps {
  achievement: Achievement;
  index: number;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
  onView: (achievement: Achievement) => void;
}

const AdminNewsCard: React.FC<AdminNewsCardProps> = ({ 
  achievement, 
  index, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:border-orange-500/30 transition-all duration-300 shadow-md hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={achievement.image}
          alt={achievement.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={() => onView(achievement)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={() => onEdit(achievement)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black">Delete Achievement</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Are you sure you want to delete this achievement? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(achievement._id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-black mb-2 line-clamp-2">
          {achievement.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {achievement.description}
        </p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Achievement Date: {new Date(achievement.date).toLocaleDateString()}</span>
          <span>Created: {new Date(achievement.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminNewsCard;
