'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldXIcon, ArrowLeftIcon, HomeIcon } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center y-100">
      <div className="max-w-md w-full text-center p-8 bg-black rounded-lg shadow-md">
        <div className="mb-6">
          <ShieldXIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white">
            You don't have permission to access this section of the dashboard.
          </p>
        </div>
        
        <div className="space-y-3">
          {/* <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full bg-black text-white"

          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Go Back
          </Button> */}
          
          <Button
            onClick={() => router.push('/')}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            Return to Homepage
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
} 