import React, { useState } from 'react';
import { useCollection } from '@/src/hooks/useCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/src/components/admin/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Trash2, GraduationCap, Building2, X, Eye, EyeOff } from 'lucide-react';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';
import { motion, AnimatePresence } from 'motion/react';

interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
  imageUrl?: string;
}

export function EducationManager() {
  const { data: edu, loading, add, update, remove } = useCollection<Education>('education', 'period');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Education>>({});

  const defaultEdu: Education = {
    institution: '',
    degree: '',
    period: '',
    description: '',
    imageUrl: ''
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  const handleSave = async () => {
    if (!editForm.institution || !editForm.degree) return;
    if (editingId) {
      await update(editingId, editForm);
    } else {
      await add(editForm as Education);
    }
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <div className="space-y-16 max-w-6xl pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-500">
             <GraduationCap size={16} />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Knowledge Base</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Academic Foundations</h2>
          <p className="text-zinc-500 text-sm max-w-xl">Configure the institutional pillars and academic milestones that formed your first-principles foundation.</p>
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
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultEdu); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-[1.25rem] h-14 px-8 font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            <Plus size={18} className="mr-3" /> Add Qualification
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.institution ? (
          <motion.div 
            key="preview-edu"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 border border-blue-500/10 rounded-[4rem] bg-[#0A0A0A] shadow-3xl overflow-hidden relative"
          >
             <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10 border-dashed border-2 border-zinc-900 p-8 rounded-[3rem]">
                <div className="w-32 h-32 rounded-[2.5rem] bg-black border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                   {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <GraduationCap size={40} className="text-zinc-900" />}
                </div>
                <div className="flex-1 space-y-6 text-center lg:text-left">
                   <div className="flex items-center justify-center lg:justify-start gap-4">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none bg-blue-500/10 px-3 py-1 rounded-md">{editForm.period || 'PERIOD'}</span>
                      <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{editForm.institution || 'INSTITUTION_NULL'}</span>
                   </div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{editForm.degree || 'DEGREE_NULL'}</h3>
                   <RichTextRenderer content={editForm.description || ''} className="text-zinc-500 text-lg leading-relaxed max-w-2xl italic mx-auto lg:mx-0" />
                </div>
             </div>
             <div className="absolute top-6 right-10 text-[8px] font-mono text-zinc-700 uppercase tracking-widest">Academia Simulation: Active</div>
          </motion.div>
        ) : (isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-10 border border-white/5 rounded-[3.5rem] bg-zinc-900/40 relative overflow-hidden shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-10">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Venture Data Entry</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={20}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Institutional Presence</Label>
                      <Input value={editForm.institution} onChange={e => setEditForm({...editForm, institution: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-blue-500/20 text-lg font-bold" placeholder="e.g. Stanford University" />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Credential / Field</Label>
                      <Input value={editForm.degree} onChange={e => setEditForm({...editForm, degree: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-blue-500/20 text-lg font-medium" placeholder="e.g. Master of Neural Logic" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Temporal Range</Label>
                      <Input value={editForm.period} onChange={e => setEditForm({...editForm, period: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 font-mono" placeholder="2020 - 2024" />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Visual Vector (Logo)</Label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <FileUploader 
                            onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                            folder="education"
                            label="Inject Institutional Logo"
                          />
                        </div>
                        {editForm.imageUrl && (
                          <div className="w-16 h-16 rounded-[1.25rem] bg-black border border-white/5 p-2 overflow-hidden shrink-0">
                            <img src={editForm.imageUrl} className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <RichTextEditor 
                     label="Institutional Focus Abstract"
                     value={editForm.description || ''} 
                     onChange={val => setEditForm({...editForm, description: val})} 
                     placeholder="Summarize the core research focus and paradigm shifts..." 
                   />
                </div>

                <div className="flex justify-end pt-8 gap-4 border-t border-white/5">
                   <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white uppercase tracking-widest font-black text-[10px]">Abandon Stack</Button>
                   <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-black h-14 px-12 rounded-2xl active:scale-95 transition-all shadow-xl shadow-blue-600/10">Commit Academic Data</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8">
        {edu.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <Card className="bg-[#0D0D0D] border-white/5 rounded-[4rem] overflow-hidden hover:border-blue-500/20 transition-all duration-700 group shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-12">
                   <div className="flex flex-col lg:flex-row gap-12">
                      <div className="w-24 h-24 rounded-[2rem] bg-black border border-white/5 flex items-center justify-center p-4 shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-700">
                         {item.imageUrl ? <img src={item.imageUrl} alt={item.institution} className="w-full h-full object-contain" /> : <Building2 size={32} className="text-zinc-900" />}
                      </div>
                      
                      <div className="flex-1 space-y-6">
                         <div className="space-y-2">
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black font-mono text-blue-500 uppercase tracking-widest">{item.period}</span>
                              <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.institution}</span>
                           </div>
                           <h3 className="text-3xl font-black tracking-tight uppercase group-hover:text-white transition-colors">{item.degree}</h3>
                         </div>
                         <p className="text-zinc-500 text-base leading-relaxed max-w-3xl italic">{item.description}</p>
                      </div>

                      <div className="flex flex-row lg:flex-col items-center justify-center gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                         <Button 
                           variant="ghost" 
                           onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                           className="bg-white/5 hover:bg-blue-500 hover:text-black rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest"
                         >
                           Infiltrate
                         </Button>
                         <button 
                           onClick={() => remove(item.id!)} 
                           className="w-12 h-12 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                         >
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

