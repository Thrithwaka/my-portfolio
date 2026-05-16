import React from 'react';
import { motion } from 'motion/react';
import { getDirectLink } from '@/lib/utils';

interface Contributor {
  id: string;
  name: string;
  avatarUrl?: string;
  imageUrl?: string; // Support both
  role?: string;
  linkedInUrl?: string;
}

interface ContributorAvatarsProps {
  contributors: Contributor[];
  limit?: number;
}

export function ContributorAvatars({ contributors, limit = 4 }: ContributorAvatarsProps) {
  const displayContributors = contributors.slice(0, limit);
  const remaining = contributors.length - limit;

  return (
    <div className="flex items-center -space-x-3">
      {displayContributors.map((c, i) => {
        const url = c.linkedInUrl ? (c.linkedInUrl.startsWith('http') ? c.linkedInUrl : `https://${c.linkedInUrl}`) : undefined;
        const img = c.imageUrl || c.avatarUrl;
        
        return (
          <motion.a
            key={c.id || i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => !url && e.preventDefault()}
            whileHover={{ y: -4, scale: 1.1, zIndex: 10 }}
            className={`relative group block ${!url ? 'cursor-default' : 'cursor-pointer'}`}
            title={c.name}
          >
            {img ? (
              <img 
                src={getDirectLink(img)} 
                alt={c.name}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-black object-cover bg-zinc-100"
              />
            ) : (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-black bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                {c.name ? c.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
              </div>
            )}
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {c.name} {c.role && `• ${c.role}`}
            </div>
          </motion.a>
        );
      })}

      {remaining > 0 && (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white dark:border-black bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 z-0">
          +{remaining}
        </div>
      )}
    </div>
  );
}
