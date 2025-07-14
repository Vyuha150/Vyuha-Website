'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import VyuhaLogo from '../../public/logo.png';

interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  subItems?: {
    label: string;
    href: string;
  }[];
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isSubActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="bg-[#18120b] text-white w-64 flex-shrink-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="p-4 flex items-center justify-center border-b border-gray-700">
        <Image
          src={VyuhaLogo}
          alt="Vyuha Logo"
          width={150}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Navigation Items */}
      <nav className="mt-5 px-2">
        {items.map((item) => (
          <div key={item.label} className="mb-2">
            {item.subItems ? (
              // Item with subitems
              <div>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg hover:bg-orange-900/20 transition-colors ${
                    isSubActive(item.href) ? 'bg-orange-900/30' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5" />
                    <span className="ml-3">{item.label}</span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      expandedItems.includes(item.label) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {/* Subitems */}
                {expandedItems.includes(item.label) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block px-4 py-2 text-sm rounded-lg hover:bg-orange-900/20 transition-colors ${
                          isActive(subItem.href) ? 'bg-orange-900/30' : ''
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Single item
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm rounded-lg hover:bg-orange-900/20 transition-colors ${
                  isActive(item.href) ? 'bg-orange-900/30' : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3">{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 