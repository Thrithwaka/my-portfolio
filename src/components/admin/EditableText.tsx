import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PenTool } from 'lucide-react';

interface EditableTextProps {
  initialValue: string;
  onSave: (value: string) => void;
  isAdmin?: boolean;
  className?: string;
  multiline?: boolean;
}

export function EditableText({ 
  initialValue, 
  onSave, 
  isAdmin, 
  className = '', 
  multiline = false
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isAdmin) {
    return <div className={className}>{initialValue}</div>;
  }

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = textRef.current?.innerText || '';
    if (newValue !== initialValue) {
      onSave(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      textRef.current?.blur();
    }
  };

  return (
    <div 
      className={`relative group/editable cursor-pointer ${className}`}
      onClick={(e) => {
        if (!isEditing) {
          e.stopPropagation();
          setIsEditing(true);
          // Focus after render
          setTimeout(() => textRef.current?.focus(), 0);
        }
      }}
    >
      <div
        ref={textRef}
        contentEditable={isEditing}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
        className={`outline-none transition-all duration-300 min-h-[1em] min-w-[1ch] ${
          isEditing ? 'bg-blue-600/10 ring-2 ring-blue-600/50 rounded px-1' : ''
        } group-hover/editable:bg-blue-600/5`}
      >
        {value}
      </div>
      {!isEditing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute -top-3 -right-3 bg-blue-600 text-white p-1 rounded-full text-[8px] uppercase font-black tracking-tighter z-10 shadow-lg pointer-events-none"
        >
          <PenTool size={8} />
        </motion.div>
      )}
    </div>
  );
}
