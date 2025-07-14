'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getDashboardConfig } from '@/config/dashboardConfig';
import { isAuthenticated, hasRole, verifyToken } from '@/utils/auth';
import IconicLoader from '@/components/IconicLoader';

export default function EventLeadDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Starting event-lead auth check...');
        
        // Check if user is authenticated
        const authenticated = isAuthenticated();
        console.log('Is authenticated:', authenticated);
        if (!authenticated) {
          console.log('Not authenticated, redirecting to sign-in');
          router.push('/auth/sign-in');
          return;
        }

        // Check if user has event_lead role
        const hasEventLeadRole = hasRole('event_lead');
        console.log('Has event_lead role:', hasEventLeadRole);
        if (!hasEventLeadRole) {
          console.log('No event_lead role, redirecting to unauthorized');
          router.push('/auth/sign-in?error=unauthorized');
          return;
        }

        // Verify token with backend
        console.log('Verifying token with backend...');
        const isValidToken = await verifyToken();
        console.log('Token verification result:', isValidToken);
        if (!isValidToken) {
          console.log('Token verification failed, redirecting to sign-in');
          router.push('/auth/sign-in?error=token_invalid');
          return;
        }

        console.log('Auth check completed successfully');
        setIsAuthorized(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/sign-in?error=auth_failed');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconicLoader />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const dashboardConfig = getDashboardConfig('event_lead');

  if (!dashboardConfig) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Access denied</div>;
  }

  return (
    <DashboardLayout 
      sidebarItems={dashboardConfig.sidebarItems}
      title={dashboardConfig.title}
    >
      {children}
    </DashboardLayout>
  );
} 