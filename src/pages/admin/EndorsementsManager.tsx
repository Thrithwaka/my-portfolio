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
    <div className="space-y-16 max-w-6xl pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-500">
             <Heart size={16} />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Professional Validation</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap text-white">Endorsements</h2>
          <p className="text-zinc-500 text-sm max-w-xl font-medium">Curate high-impact professional testimonials and social proof that anchor your operational authority.</p>
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
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultEndorsement); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-[1.25rem] h-14 px-8 font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            <Plus size={18} className="mr-3" /> Index Quote
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.quote ? (
          <motion.div 
            key="preview-endorsement"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 border border-blue-500/10 rounded-[4rem] bg-[#0A0A0A] shadow-3xl overflow-hidden relative"
          >
             <div className="max-w-3xl mx-auto space-y-10 text-center relative z-10 border-dashed border-2 border-zinc-900 p-12 rounded-[3.5rem]">
                <Quote className="text-blue-500 mx-auto opacity-20" size={48} />
                <RichTextRenderer content={editForm.quote || ''} className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed" />
                
                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden">
                      {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <UserIcon size={32} className="text-zinc-800 m-auto mt-4" />}
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-widest text-white">{editForm.name || 'ANONYMOUS_SOURCE'}</h4>
                      <p className="text-[10px] font-mono uppercase text-zinc-600 tracking-widest">{editForm.role || 'ROLE_VOID'}</p>
                   </div>
                </div>
             </div>
             <div className="absolute top-6 left-10 text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Voice Simulation: Active</div>
          </motion.div>
        ) : (isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-10 border border-white/5 rounded-[3.5rem] bg-zinc-900/40 relative overflow-hidden shadow-2xl backdrop-blur-xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-10">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Endorsement Intake</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={20}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Endorser Full Name</Label>
                      <Input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-rose-500/20 text-lg font-bold text-white" placeholder="e.g. Dr. Alex Thorne" />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Operational Title / Context</Label>
                      <Input value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-rose-500/20 text-lg font-medium text-zinc-300" placeholder="e.g. CTO @ Neural Systems" />
                   </div>
                </div>

                <div className="space-y-4">
                   <RichTextEditor 
                     label="Theoretical Perspective (Quote)"
                     value={editForm.quote || ''} 
                     onChange={val => setEditForm({...editForm, quote: val})} 
                     placeholder="Acknowledge the technical superiority..." 
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">LinkedIn Node (URL)</Label>
                      <Input value={editForm.linkedInUrl} onChange={e => setEditForm({...editForm, linkedInUrl: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 font-mono text-blue-400" placeholder="https://linkedin.com/in/..." />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Priority Ranking</Label>
                      <Input type="number" value={editForm.priority} onChange={e => setEditForm({...editForm, priority: parseInt(e.target.value)})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 font-mono text-white" />
                   </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Visual Identity (Photo)</Label>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <FileUploader 
                          onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                          folder="endorsements"
                          label="Inject Profile Data"
                        />
                      </div>
                      {editForm.imageUrl && (
                        <div className="w-16 h-16 rounded-full bg-black border border-white/5 overflow-hidden shrink-0 ring-2 ring-rose-500/20">
                           <img src={editForm.imageUrl} className="w-full h-full object-cover" />
                        </div>
                      )}
                   </div>
                </div>

                <div className="flex justify-end pt-8 gap-4 border-t border-white/5">
                   <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white uppercase tracking-widest font-black text-[10px]">Decline Signal</Button>
                   <Button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700 text-white font-black h-14 px-12 rounded-2xl active:scale-95 transition-all shadow-xl shadow-rose-600/20">Authorize Endorsement</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-12">
        {endorsements.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <div className="p-16 border border-white/5 rounded-[5rem] bg-[#0A0A0A] hover:bg-zinc-900/10 hover:border-rose-500/20 transition-all duration-700 group relative shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
                   <div className="space-y-6 shrink-0">
                      <div className="w-40 h-40 rounded-[3.5rem] bg-black border border-white/5 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-700 ring-1 ring-white/10 group-hover:ring-rose-500/30">
                         {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <UserIcon size={56} className="text-zinc-900" />}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-2xl font-black tracking-tight leading-none uppercase text-white">{item.name}</h4>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{item.role}</p>
                      </div>
                   </div>
                   
                   <div className="flex-1 space-y-12">
                      <div className="relative">
                        <Quote size={64} className="absolute -top-10 -left-10 text-white/[0.03] group-hover:text-rose-500/[0.05] transition-colors" />
                        <p className="text-white text-3xl font-serif italic leading-[1.6] max-w-5xl relative z-10">"{item.quote}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-12 border-t border-white/5">
                         <div className="flex items-center gap-6">
                            {item.linkedInUrl && (
                              <a href={item.linkedInUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-2.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-blue-600/10">
                                 <Linkedin size={14} />
                                 Verified Source
                              </a>
                            )}
                            <div className="flex items-center gap-3 px-4 py-2 bg-zinc-950/50 rounded-full border border-white/5">
                               <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Weight: {item.priority || 0}</span>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                            <Button 
                               variant="ghost" 
                               onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                               className="bg-white/5 hover:bg-rose-500 hover:text-black rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest"
                             >
                               Modify
                             </Button>
                             <button 
                               onClick={() => remove(item.id!)} 
                               className="w-12 h-12 flex items-center justify-center text-zinc-800 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                             >
                                <Trash2 size={20} />
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
