import React, { useState } from 'react';
import { useCollection } from '@/src/hooks/useCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/src/components/admin/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Trash2, X, Quote, Heart, Linkedin, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';
import { motion, AnimatePresence } from 'motion/react';

interface Endorsement {
  id?: string;
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
  linkedInUrl?: string;
  priority?: number;
}

export function EndorsementsManager() {
  const { data: endorsements, loading, add, update, remove } = useCollection<Endorsement>('endorsements', 'priority');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Endorsement>>({});

  const defaultEndorsement: Endorsement = {
    name: '',
    role: '',
    quote: '',
    imageUrl: '',
    linkedInUrl: '',
    priority: 0
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  const handleSave = async () => {
    if (!editForm.name || !editForm.quote) return;
    if (editingId) {
      await update(editingId, editForm);
    } else {
      await add(editForm as Endorsement);
    }
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-rose-500">
             <Heart size={14} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Professional Validation</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white leading-none">Endorsements</h2>
          <p className="text-zinc-500 text-xs font-medium">Curate professional testimonials and social proof.</p>
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
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultEndorsement); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-xl h-10 px-6 font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
          >
            <Plus size={16} className="mr-2" /> Index Quote
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.quote ? (
          <motion.div 
            key="preview-endorsement"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 border border-blue-500/10 rounded-3xl bg-[#0A0A0A] shadow-2xl relative"
          >
             <div className="max-w-2xl mx-auto space-y-6 text-center relative z-10 border border-dashed border-zinc-800 p-8 rounded-2xl">
                <Quote className="text-rose-500 mx-auto opacity-20" size={32} />
                <RichTextRenderer content={editForm.quote || ''} className="text-lg md:text-xl font-serif italic text-white leading-relaxed" />
                
                <div className="flex flex-col items-center gap-3">
                   <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden">
                      {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <UserIcon size={24} className="text-zinc-800 m-auto mt-3" />}
                   </div>
                   <div className="space-y-0.5">
                      <h4 className="text-xs font-black uppercase tracking-widest text-white">{editForm.name || 'ANONYMOUS_SOURCE'}</h4>
                      <p className="text-[9px] font-mono uppercase text-zinc-600 tracking-widest">{editForm.role || 'ROLE_VOID'}</p>
                   </div>
                </div>
             </div>
          </motion.div>
        ) : (isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 border border-white/5 rounded-3xl bg-zinc-900/40 relative overflow-hidden shadow-2xl backdrop-blur-xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-8">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-500">{editingId ? 'Modify Endorsement' : 'New Endorsement Intake'}</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={18}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Endorser Name</Label>
                      <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-white font-bold" placeholder="e.g. Dr. Alex Thorne" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Title / Context</Label>
                      <Input value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-white font-medium" placeholder="e.g. CTO @ Neural Systems" />
                   </div>
                </div>

                <div className="space-y-2">
                   <RichTextEditor 
                     label="Quote"
                     value={editForm.quote || ''} 
                     onChange={val => setEditForm({...editForm, quote: val})} 
                     placeholder="..." 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">LinkedIn URL</Label>
                      <Input value={editForm.linkedInUrl} onChange={e => setEditForm({...editForm, linkedInUrl: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-blue-400" placeholder="https://..." />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Priority Ranking</Label>
                      <Input type="number" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: parseInt(e.target.value)})} className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-white" />
                   </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Photo</Label>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <FileUploader 
                          onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                          folder="endorsements"
                          label="Upload Image"
                        />
                      </div>
                      {editForm.imageUrl && (
                        <div className="w-12 h-12 rounded-full bg-black border border-white/10 overflow-hidden shrink-0">
                           <img src={editForm.imageUrl} className="w-full h-full object-cover" />
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex justify-end pt-6 gap-3 border-t border-white/5">
                   <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white uppercase tracking-widest font-bold text-[10px] h-10">Cancel</Button>
                   <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 px-8 rounded-xl active:scale-95 transition-all shadow-lg">Authorize</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-8">
        {endorsements.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <div className="p-8 border border-white/5 rounded-[3rem] bg-[#0A0A0A] hover:bg-zinc-900/10 hover:border-rose-500/20 transition-all duration-500 group relative shadow-lg overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
                   <div className="space-y-4 shrink-0">
                      <div className="w-24 h-24 rounded-2xl bg-black border border-white/5 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                         {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <UserIcon size={32} className="text-zinc-900" />}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-lg font-black tracking-tight uppercase text-white">{item.name}</h4>
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{item.role}</p>
                      </div>
                   </div>
                   
                   <div className="flex-1 space-y-8">
                      <div className="relative">
                        <Quote size={48} className="absolute -top-6 -left-6 text-white/[0.03] group-hover:text-rose-500/[0.05] transition-colors" />
                        <p className="text-white text-xl font-serif italic leading-relaxed max-w-5xl relative z-10">"{item.quote}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                         <div className="flex items-center gap-4">
                            {item.linkedInUrl && (
                              <a href={item.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[8px] font-bold text-blue-500 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                                 <Linkedin size={10} />
                                 Verify
                              </a>
                            )}
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Priority: {item.priority || 0}</span>
                         </div>
                         
                         <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-all">
                            <Button 
                               variant="ghost" 
                               onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                               className="bg-white/5 hover:bg-rose-500 hover:text-black rounded-lg h-8 px-4 text-[9px] font-bold uppercase tracking-widest"
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
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
