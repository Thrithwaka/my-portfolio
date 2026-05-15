import React, { useState } from 'react';
import { useCollection } from '@/src/hooks/useCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/src/components/admin/RichTextEditor';
import { Loader2, Save, Plus, Trash2, ExternalLink, X, BookOpen, FileText, Calendar, LucideIcon, Eye, EyeOff } from 'lucide-react';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';
import { motion, AnimatePresence } from 'motion/react';

interface ResearchItem {
  id?: string;
  title: string;
  description: string;
  link: string;
  date: string;
  type: string;
  imageUrl?: string;
}

export function ResearchesManager() {
  const { data: items, loading, add, update, remove } = useCollection<ResearchItem>('research', 'date');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ResearchItem>>({});

  const defaultItem: ResearchItem = {
    title: '', 
    description: '', 
    link: '', 
    date: '', 
    type: 'Whitepaper', 
    imageUrl: '' 
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  const handleSave = async () => {
    if (!editForm.title) return;
    if (editingId) {
      await update(editingId, editForm);
    } else {
      await add(editForm as ResearchItem);
    }
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <div className="space-y-16 max-w-6xl pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-500">
             <BookOpen size={16} />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Knowledge Production</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap text-white">Research Lab</h2>
          <p className="text-zinc-500 text-sm max-w-xl font-medium">Index academic publications, whitepapers, and technical innovations that contribute to the global intelligence pool.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowPreview(!showPreview)} 
            className="text-zinc-500 hover:text-white uppercase tracking-widest font-black text-[10px] rounded-xl border border-white/5 h-14 px-6"
          >
            {showPreview ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
            {showPreview ? 'Exit Sim' : 'Live Sim'}
          </Button>
          <Button 
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultItem); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-[1.25rem] h-14 px-8 font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            <Plus size={18} className="mr-3" /> Index Work
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.title ? (
          <motion.div 
            key="preview-research"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 border border-blue-500/10 rounded-[4rem] bg-[#0A0A0A] shadow-3xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
            <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10 opacity-70 border-dashed border-2 border-blue-500/20 p-8 rounded-[3rem]">
               <div className="w-32 h-32 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                  {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <FileText size={40} className="text-zinc-900" />}
               </div>
               
               <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                     <span className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none">{editForm.type || 'TYPE'}</span>
                     <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                     <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} className="text-zinc-700" /> {editForm.date || 'YEAR'}</span>
                  </div>
                  <h4 className="text-3xl font-black tracking-tight leading-none uppercase text-white">{editForm.title || 'TITLE_NULL'}</h4>
                  <RichTextRenderer content={editForm.description || ''} className="text-zinc-500 text-lg leading-relaxed max-w-4xl italic" />
               </div>
               
               <div className="flex items-center gap-4 shrink-0">
                  <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center text-zinc-800 italic font-serif text-sm">PREVIEW</div>
               </div>
            </div>
            <div className="absolute bottom-6 right-10 text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Simulation_Mode: Active</div>
          </motion.div>
        ) : (isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-10 border border-white/5 rounded-[3.5rem] bg-zinc-900/40 relative overflow-hidden shadow-2xl backdrop-blur-xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-10">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Publication Indexer</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={20}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Research Title</Label>
                      <Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-indigo-500/20 text-lg font-bold text-white" placeholder="e.g. Neural Weight Optimization..." />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Publication Period</Label>
                      <Input value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 font-mono text-white" placeholder="e.g. 2024" />
                   </div>
                </div>

                <RichTextEditor 
                   label="Executive Abstract"
                   value={editForm.description || ''} 
                   onChange={val => setEditForm({...editForm, description: val})} 
                   placeholder="Summarize the core technical contribution and methodology..." 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Artifact Vector (URL)</Label>
                      <Input value={editForm.link} onChange={e => setEditForm({...editForm, link: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-indigo-500/20 font-mono text-indigo-400" placeholder="https://doi.org/..." />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Publication Classification</Label>
                      <Input value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-indigo-500/20 text-white font-medium" placeholder="Whitepaper, Dataset, Case Study" />
                   </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Visual Anchor (Schema / Cover)</Label>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <FileUploader 
                          onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                          folder="research"
                          label="Deploy Visual Signal"
                        />
                      </div>
                      {editForm.imageUrl && (
                        <div className="w-16 h-16 rounded-[1.25rem] bg-black border border-white/5 p-2 overflow-hidden shrink-0">
                           <img src={editForm.imageUrl} className="w-full h-full object-contain" />
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex justify-end pt-8 gap-4 border-t border-white/5">
                   <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white uppercase tracking-widest font-black text-[10px]">Abandon Stack</Button>
                   <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 px-12 rounded-2xl active:scale-95 transition-all shadow-xl shadow-indigo-600/20">Commit to Lab</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-8">
        {items.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <div className="p-12 border border-white/5 rounded-[4rem] bg-[#0A0A0A] hover:bg-zinc-900/10 hover:border-indigo-500/20 transition-all duration-700 group relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-700">
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <FileText size={40} className="text-zinc-900" />}
                   </div>
                   
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3">
                         <span className="px-4 py-1.5 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-none">{item.type}</span>
                         <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                         <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} className="text-zinc-700" /> {item.date}</span>
                      </div>
                      <h4 className="text-3xl font-black tracking-tight leading-none uppercase text-white group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                      <p className="text-zinc-500 text-lg leading-relaxed max-w-4xl italic">{item.description}</p>
                   </div>
                   
                   <div className="flex items-center gap-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 hover:bg-white hover:text-black hover:border-white transition-all shadow-2xl"
                        >
                           <ExternalLink size={20} />
                        </a>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                           variant="ghost" 
                           onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                           className="bg-white/5 hover:bg-indigo-500 hover:text-black rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest"
                         >
                           Refine
                         </Button>
                         <button 
                           onClick={() => remove(item.id!)} 
                           className="w-full h-12 flex items-center justify-center text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                         >
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


