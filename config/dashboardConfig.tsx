import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentIcon,
  UsersIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

interface DashboardConfig {
  title: string;
  sidebarItems: {
    label: string;
    href: string;
    icon: any;
  }[];
}

type DashboardConfigs = {
  [key: string]: DashboardConfig;
};

const dashboardConfigs: DashboardConfigs = {
  admin: {
    title: 'Admin Dashboard',
    sidebarItems: [
      {
        label: 'Overview',
        href: '/dashboard/admin',
        icon: HomeIcon,
      },
      {
        label: 'Users',
        href: '/dashboard/admin/users',
        icon: UsersIcon,
      },
      {
        label: 'Clubs',
        href: '/dashboard/admin/clubs',
        icon: UserGroupIcon,
      },
      {
        label: 'Colleges',
        href: '/dashboard/admin/colleges',
        icon: BuildingOfficeIcon,
      },
      {
        label: 'Events',
        href: '/dashboard/admin/events',
        icon: CalendarIcon,
      },
      {
        label: 'Achievements',
        href: '/dashboard/admin/achievements',
        icon: NewspaperIcon,
      },
      {
        label: 'Podcasts',
        href: '/dashboard/admin/podcasts',
        icon: DocumentIcon,
      },
      {
        label: 'Jobs',
        href: '/dashboard/admin/companies/jobs',
        icon: BriefcaseIcon,
      },
      {
        label: 'Courses',
        href: '/dashboard/admin/courses',
        icon: AcademicCapIcon,
      },
      {
        label: 'Projects',
        href: '/dashboard/admin/projects',
        icon: DocumentIcon,
      },
      {
        label: 'Companies',
        href: '/dashboard/admin/companies',
        icon: BuildingOfficeIcon,
      },
    ],
  },
  event_lead: {
    title: 'Event Lead Dashboard',
    sidebarItems: [
      {
        label: 'Overview',
        href: '/dashboard/event_lead/',
        icon: HomeIcon,
      },
      {
        label: 'Events',
        href: '/dashboard/event_lead/events',
        icon: CalendarIcon,
      },
    ],
  },
};

export const getDashboardConfig = (role: string): DashboardConfig | null => {
  return dashboardConfigs[role] || null;
}; 