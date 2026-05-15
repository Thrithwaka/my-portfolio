import React from 'react';
import { PenTool } from 'lucide-react';

interface VisualEditorWrapperProps {
  isAdmin?: boolean;
  onEdit: () => void;
  children: React.ReactNode;
  label?: string;
}

export function VisualEditorWrapper({ isAdmin, onEdit, children, label = 'Edit Section' }: VisualEditorWrapperProps) {
  if (!isAdmin) return <>{children}</>;

  return (
    <div className="relative group/editor">
      {children}
      <div className="absolute inset-0 border-2 border-transparent group-hover/editor:border-blue-600/30 rounded-[inherit] pointer-events-none transition-colors z-[55]" />
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute top-8 right-8 z-[60] bg-blue-600 text-white px-4 py-2 rounded-full shadow-2xl opacity-0 group-hover/editor:opacity-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-blue-400/50"
      >
        <PenTool size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
      </button>
    </div>
  );
}
