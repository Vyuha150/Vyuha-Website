import React from "react";
import Link from "next/link";

interface BusinessServiceCardProps {
  title: string;
  items: string[];
  links?: string[];
  actionButton?: {
    text: string;
    href: string;
  };
}

const BusinessServiceCard: React.FC<BusinessServiceCardProps> = ({ title, items, links, actionButton }) => (
  <div className="bg-white/5 border border-orange-500/20 rounded-xl p-6 mb-6 hover:bg-orange-500/5 transition-all duration-300">
    <h3 className="text-xl font-bold text-orange-500 mb-3">{title}</h3>
    <ul className="list-disc list-inside text-gray-200 space-y-2 mb-4">
      {items.map((item, idx) => (
        <li key={idx} className="text-base">{item}</li>
      ))}
    </ul>
    <div className="space-y-4">
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {links.map((link, lidx) => (
            <a
              key={lidx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-1 bg-orange-500/90 hover:bg-orange-600 text-white rounded-full text-sm font-medium transition-colors duration-200"
            >
              {link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          ))}
        </div>
      )}
      {actionButton && (
        <Link
          href={actionButton.href}
          className="inline-flex items-center justify-center w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {actionButton.text}
        </Link>
      )}
    </div>
  </div>
);

export default BusinessServiceCard; 