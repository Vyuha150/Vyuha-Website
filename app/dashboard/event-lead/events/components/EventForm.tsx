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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(1, 'Location is required'),
  organizer: z.string().min(1, 'Organizer name is required'),
  organizerBio: z.string().min(1, 'Organizer bio is required'),
  organizerPhoto: z.string().min(1, 'Organizer photo is required'),
  platformLink: z.string().optional(),
  fees: z.string().min(1, 'Fees information is required'),
  materials: z.string().optional(),
  isRecorded: z.boolean().default(false),
  isVccEvent: z.boolean().default(false),
  incollege: z.boolean().default(false),
  registrationLimit: z.union([z.number().min(0, 'Registration limit must be at least 0'), z.literal(''), z.undefined()]).optional(),
  image: z.string().min(1, 'Event image is required'),
  category: z.string().min(1, 'Category is required'),
  mode: z.enum(['online', 'offline']),
  targetAudience: z.string().min(1, 'Target audience is required'),
  logo: z.string().min(1, 'Logo is required'),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: EventFormData;
  isEditing?: boolean;
  eventId?: string;
  onSuccess?: () => void;
}

export default function EventForm({ initialData, isEditing = false, eventId, onSuccess }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      date: '',
      time: '',
      location: '',
      organizer: '',
      organizerBio: '',
      organizerPhoto: '',
      platformLink: '',
      fees: '',
      materials: '',
      isRecorded: false,
      isVccEvent: false,
      incollege: false,
      registrationLimit: undefined,
      image: '',
      category: '',
      mode: 'offline' as const,
      targetAudience: '',
      logo: '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof EventFormData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue(field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get('authToken');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Convert empty string or 0 to null for registrationLimit (unlimited)
      const processedData = {
        ...data,
        registrationLimit: data.registrationLimit === '' || data.registrationLimit === 0 ? null : data.registrationLimit
      };
      
      if (isEditing && eventId) {
        await axios.put(`${baseUrl}/api/events/${eventId}`, processedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event updated successfully');
      } else {
        await axios.post(`${baseUrl}/api/events`, processedData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event created successfully');
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting event:', error);
      toast.error('Failed to submit event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Event Name</FormLabel>
                <FormControl>
                  <Input {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-black">
                      <SelectValue placeholder="Select category" className="text-black" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technical" className="text-black">Technical</SelectItem>
                    <SelectItem value="cultural" className="text-black">Cultural</SelectItem>
                    <SelectItem value="sports" className="text-black">Sports</SelectItem>
                    <SelectItem value="workshop" className="text-black">Workshop</SelectItem>
                    <SelectItem value="seminar" className="text-black">Seminar</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input type="date" {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-black">
                      <SelectValue placeholder="Select mode" className="text-black" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="online" className="text-black">Online</SelectItem>
                    <SelectItem value="offline" className="text-black">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Location</FormLabel>
                <FormControl>
                  <Input {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Registration Fees</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platformLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Platform Link (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registrationLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Registration Limit (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                                          placeholder="Leave empty or enter 0 for unlimited"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    className="text-black" 
                  />
                </FormControl>
                <FormDescription className="text-gray-500">
                  Set a maximum number of registrations. Leave empty or set to 0 for unlimited registrations.
                </FormDescription>
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
                <Textarea {...field} rows={4} className="text-black" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Organizer Name</FormLabel>
                <FormControl>
                  <Input {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizerBio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Organizer Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} className="text-black" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="organizerPhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Organizer Photo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'organizerPhoto')}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isVccEvent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-black">VCC Event</FormLabel>
                  <FormDescription className="text-gray-500">
                    Mark this event as a VCC event
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="incollege"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base text-black">College Event</FormLabel>
                  <FormDescription className="text-gray-500">
                    Mark this event as a college event
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Event Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Event Logo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Target Audience</FormLabel>
              <FormControl>
                <Input {...field} className="text-black" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="materials"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Materials (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="text-black" />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRecorded"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel className="text-black">Will this event be recorded?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
              <span className="text-black">{isEditing ? 'Update Event' : 'Create Event'}</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 