import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Github, ExternalLink, Calendar, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDirectLink } from '@/lib/utils';
import { ContributorAvatars } from './ContributorAvatars';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl?: string;
  category?: string;
  tags?: string[];
  status?: string;
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  demoUrl?: string;
  contributors?: any[];
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row h-full">
        {/* Visual Content */}
        <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden bg-zinc-50 dark:bg-zinc-800">
          {project.coverImageUrl ? (
            <img 
              src={getDirectLink(project.coverImageUrl)} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30">
              <Layers size={48} className="text-zinc-300" />
            </div>
          )}
          
          {/* Status Badge */}
          {project.status && (
            <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200 shadow-sm">
              {project.status}
            </div>
          )}
        </div>

        {/* Textual Content */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-blue-600">
                  {project.category || 'Engineering'}
                </span>
                <div className="h-px w-8 bg-zinc-200 dark:bg-white/10" />
                <span className="text-[10px] font-mono text-zinc-400">
                  {project.startDate}
                </span>
              </div>
              <Link to={`/projects/${project.slug}`}>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase">
                  {project.title}
                </h3>
              </Link>
            </div>
            
            <motion.div whileHover={{ scale: 1.1, rotate: 15 }}>
              <Link to={`/projects/${project.slug}`} className="p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl text-zinc-400 group-hover:text-blue-600 transition-colors">
                <ArrowUpRight size={24} />
              </Link>
            </motion.div>
          </div>

          <RichTextRenderer 
             content={project.shortDescription} 
             className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed line-clamp-3 mb-8 max-w-2xl" 
          />

          <div className="flex flex-wrap gap-2 mb-10">
            {project.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-zinc-50 dark:bg-white/5 rounded-full text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-zinc-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {project.contributors && project.contributors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-widest">Innovation Team</p>
                  <ContributorAvatars contributors={project.contributors} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-50 dark:bg-white/5 rounded-xl text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                  <Github size={20} />
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-50 dark:bg-white/5 rounded-xl text-zinc-400 hover:text-blue-600 transition-colors">
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
