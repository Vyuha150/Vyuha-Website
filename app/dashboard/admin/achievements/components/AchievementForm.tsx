'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const achievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  image: z.string().min(1, 'Image is required'),
});

type AchievementFormData = z.infer<typeof achievementSchema>;

interface AchievementFormProps {
  readonly initialData?: AchievementFormData;
  readonly isEditing?: boolean;
  readonly achievementId?: string;
  readonly onSuccess?: () => void;
}

export default function AchievementForm({ 
  initialData, 
  isEditing = false, 
  achievementId, 
  onSuccess 
}: AchievementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      date: '',
      image: '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue('image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit: SubmitHandler<AchievementFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (isEditing && achievementId) {
        await axios.put(`${baseUrl}/api/achievements/${achievementId}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Achievement updated successfully');
      } else {
        await axios.post(`${baseUrl}/api/achievements`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Achievement created successfully');
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting achievement:', error);
      toast.error('Failed to submit achievement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Achievement title" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of the achievement"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Achievement Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-black"
                  />
                  {field.value && (
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <img
                        src={field.value}
                        alt="Achievement preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="text-gray-500">
                Upload an image related to this achievement (max 5MB)
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-black">Saving...</span>
              </div>
            ) : (
              <span className="text-white">{isEditing ? 'Update Achievement' : 'Create Achievement'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
