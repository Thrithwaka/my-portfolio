import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Circle, Square, Cloud, Trash2, SlidersHorizontal } from 'lucide-react';

export interface DecorationData {
  id: string;
  type: 'circle' | 'square' | 'blob';
  color: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
  zIndex: number;
}

interface DecorationLayerProps {
  decorations: DecorationData[];
  onUpdate: (decorations: DecorationData[]) => void;
  isAdmin?: boolean;
}

export function DecorationLayer({ decorations = [], onUpdate, isAdmin }: DecorationLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (id: string, info: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const newDecorations = decorations.map(d => {
      if (d.id === id) {
        // info.point.x/y is relative to the viewport.
        // We need to calculate relative to our container.
        const newX = ((info.point.x - rect.left) / rect.width) * 100;
        const newY = ((info.point.y - rect.top) / rect.height) * 100;
        return { 
          ...d, 
          x: Number(newX.toFixed(2)), 
          y: Number(newY.toFixed(2)) 
        };
      }
      return d;
    });
    onUpdate(newDecorations);
  };

  const addDecoration = (type: 'circle' | 'square' | 'blob') => {
    const newDec: DecorationData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      color: type === 'circle' ? '#3b82f6' : type === 'square' ? '#8b5cf6' : '#ec4899',
      x: 50,
      y: 50,
      size: 200,
      opacity: 0.15,
      blur: 40,
      zIndex: -1
    };
    onUpdate([...decorations, newDec]);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {decorations.map((d) => (
        <DecorationItem 
          key={d.id} 
          decoration={d} 
          isAdmin={isAdmin} 
          onDragEnd={(info: any) => handleDragEnd(d.id, info)}
          onDelete={() => onUpdate(decorations.filter(item => item.id !== d.id))}
          onUpdate={(data: Partial<DecorationData>) => onUpdate(decorations.map(item => item.id === d.id ? { ...item, ...data } : item))}
        />
      ))}

      {isAdmin && (
        <div className="absolute bottom-10 left-10 flex gap-2 pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-2 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl z-[100]">
          <button onClick={() => addDecoration('circle')} className="p-3 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex flex-col items-center gap-1 group">
            <Circle size={20} />
            <span className="text-[7px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Circle</span>
          </button>
          <button onClick={() => addDecoration('square')} className="p-3 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex flex-col items-center gap-1 group">
            <Square size={20} />
            <span className="text-[7px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Square</span>
          </button>
          <button onClick={() => addDecoration('blob')} className="p-3 hover:bg-blue-600 hover:text-white rounded-xl transition-all flex flex-col items-center gap-1 group">
            <Cloud size={20} />
            <span className="text-[7px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Blob</span>
          </button>
        </div>
      )}
    </div>
  );
}

function DecorationItem({ decoration, isAdmin, onDragEnd, onDelete, onUpdate }: any) {
  const [isEditing, setIsEditing] = useState(false);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${decoration.x}%`,
    top: `${decoration.y}%`,
    width: `${decoration.size}px`,
    height: `${decoration.size}px`,
    backgroundColor: decoration.color,
    opacity: decoration.opacity,
    filter: `blur(${decoration.blur}px)`,
    zIndex: decoration.zIndex,
    borderRadius: decoration.type === 'circle' ? '50%' : decoration.type === 'blob' ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '0%',
    pointerEvents: isAdmin ? 'auto' : 'none',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <motion.div
      drag={isAdmin}
      dragMomentum={false}
      onDragEnd={(_, info) => onDragEnd(info)}
      style={style}
      onMouseEnter={() => isAdmin && setIsEditing(true)}
      onMouseLeave={() => isAdmin && setIsEditing(false)}
      className={`${isAdmin ? 'cursor-move ring-2 ring-transparent hover:ring-blue-600/50 transition-shadow' : ''}`}
    >
       {isEditing && isAdmin && (
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white dark:bg-zinc-800 shadow-2xl rounded-xl p-3 border border-zinc-200 dark:border-white/10 w-max z-[110]"
         >
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-zinc-500">Color</span>
              <input 
                type="color" 
                value={decoration.color}
                onChange={(e) => onUpdate({ color: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
              />
            </div>
            
            <div className="w-px h-10 bg-zinc-100 dark:bg-zinc-700" />
            
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-zinc-500">Size</span>
              <input type="range" min="10" max="1000" value={decoration.size} onChange={(e) => onUpdate({ size: parseInt(e.target.value) })} className="w-24 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-zinc-500">Blur</span>
              <input type="range" min="0" max="200" value={decoration.blur} onChange={(e) => onUpdate({ blur: parseInt(e.target.value) })} className="w-20 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black uppercase text-zinc-500">Opacity</span>
              <input type="range" min="0" max="1" step="0.05" value={decoration.opacity} onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })} className="w-20 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
            </div>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }} 
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors ml-2"
            >
              <Trash2 size={16} />
            </button>
         </motion.div>
       )}
    </motion.div>
  );
}
