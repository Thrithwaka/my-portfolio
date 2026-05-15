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
    <div className="space-y-8 max-w-6xl pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500">
             <BookOpen size={14} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Knowledge Production</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white leading-none">Research Lab</h2>
          <p className="text-zinc-500 text-xs font-medium">Index your academic publications and technical innovations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => setShowPreview(!showPreview)} 
            className="text-zinc-500 hover:text-white uppercase tracking-widest font-bold text-[10px] rounded-xl border border-white/5 h-10 px-4"
          >
            {showPreview ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
            {showPreview ? 'Exit Preview' : 'Live Preview'}
          </Button>
          <Button 
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultItem); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-xl h-10 px-6 font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
          >
            <Plus size={16} className="mr-2" /> Index Work
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.title ? (
          <motion.div 
            key="preview-research"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 border border-blue-500/10 rounded-3xl bg-[#0A0A0A] shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
            <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10 border-dashed border border-blue-500/20 p-8 rounded-2xl">
               <div className="w-24 h-24 rounded-2xl bg-black border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                  {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <FileText size={32} className="text-zinc-900" />}
               </div>
               
               <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-[8px] font-black text-indigo-500 uppercase tracking-widest leading-none">{editForm.type || 'TYPE'}</span>
                     <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                     <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10} className="text-zinc-700" /> {editForm.date || 'YEAR'}</span>
                  </div>
                  <h4 className="text-2xl font-black tracking-tight leading-none uppercase text-white">{editForm.title || 'TITLE_NULL'}</h4>
                  <RichTextRenderer content={editForm.description || ''} className="text-zinc-500 text-sm leading-relaxed max-w-4xl italic" />
               </div>
            </div>
          </motion.div>
        ) : (isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 border border-white/5 rounded-3xl bg-zinc-900/40 relative overflow-hidden shadow-2xl backdrop-blur-xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-8">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{editingId ? 'Modify Publication' : 'New Publication Record'}</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={18}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Research Title</Label>
                      <Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-white font-bold" placeholder="..." />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Publication Date/Year</Label>
                      <Input value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-white" placeholder="e.g. 2024" />
                   </div>
                </div>

                <div className="space-y-2">
                  <RichTextEditor 
                     label="Description"
                     value={editForm.description || ''} 
                     onChange={val => setEditForm({...editForm, description: val})} 
                     placeholder="..." 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Link / DOI</Label>
                      <Input value={editForm.link} onChange={e => setEditForm({...editForm, link: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-indigo-400" placeholder="https://..." />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Classification</Label>
                      <Input value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-white font-medium" placeholder="Whitepaper, Dataset, etc." />
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Visual Anchor</Label>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <FileUploader 
                          onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                          folder="research"
                          label="Upload Image"
                        />
                      </div>
                      {editForm.imageUrl && (
                        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-2 overflow-hidden shrink-0">
                           <img src={editForm.imageUrl} className="w-full h-full object-contain" />
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex justify-end pt-6 gap-3 border-t border-white/5">
                   <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white uppercase tracking-widest font-bold text-[10px] h-10">Cancel</Button>
                   <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-8 rounded-xl active:scale-95 transition-all shadow-lg">Save Work</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <div className="p-8 border border-white/5 rounded-3xl bg-[#0A0A0A] hover:bg-zinc-900/10 hover:border-indigo-500/20 transition-all duration-500 group relative shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                   <div className="w-20 h-20 rounded-2xl bg-black border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <FileText size={24} className="text-zinc-900" />}
                   </div>
                   
                   <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                         <span className="px-3 py-0.5 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-[8px] font-black text-indigo-500 uppercase tracking-widest leading-none">{item.type}</span>
                         <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                         <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10} className="text-zinc-700" /> {item.date}</span>
                      </div>
                      <h4 className="text-xl font-black tracking-tight uppercase text-white group-hover:text-indigo-400 transition-colors leading-tight">{item.title}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed max-w-4xl italic line-clamp-2">{item.description}</p>
                   </div>
                   
                   <div className="flex items-center gap-3 shrink-0 md:opacity-0 group-hover:opacity-100 transition-all">
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-500 hover:bg-white hover:text-black hover:border-white transition-all shadow-lg"
                        >
                           <ExternalLink size={16} />
                        </a>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button 
                           variant="ghost" 
                           onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                           className="bg-white/5 hover:bg-indigo-500 hover:text-black rounded-lg h-8 px-3 text-[9px] font-bold uppercase tracking-widest"
                         >
                           Edit
                         </Button>
                         <button 
                           onClick={() => remove(item.id!)} 
                           className="w-8 h-8 flex items-center justify-center text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                         >
                             <Trash2 size={16} />
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


