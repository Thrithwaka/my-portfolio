import React from 'react';
import { cn } from '@/lib/utils';

interface RichTextRendererProps {
  content: string;
  className?: string;
  proseSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
}

export function RichTextRenderer({ 
  content, 
  className,
  proseSize = 'base'
}: RichTextRendererProps) {
  if (!content) return null;

  // Check if content looks like HTML (basic heuristic)
  const isHtml = content.includes('<') && content.includes('>');

  if (!isHtml) {
    return (
      <p className={cn(className, "whitespace-pre-wrap")}>
        {content}
      </p>
    );
  }

  return (
    <div 
      className={cn(
        "prose dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400",
        proseSize === 'sm' && "prose-sm",
        proseSize === 'lg' && "prose-lg",
        proseSize === 'xl' && "prose-xl",
        proseSize === '2xl' && "prose-2xl",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
