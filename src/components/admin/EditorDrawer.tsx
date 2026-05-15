import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function EditorDrawer({ isOpen, onClose, title, children }: EditorDrawerProps) {
  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
          />
          
          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[800px] bg-[#020202] border-l border-white/5 shadow-2xl z-[1001] flex flex-col"
          >
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#020202]/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none">{title}</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Visual Editor Panel</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </Button>
            </header>
            
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar" data-lenis-prevent>
              <div className="max-w-3xl mx-auto">
                {children}
              </div>
            </main>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
