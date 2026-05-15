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
    <div className="space-y-8 max-w-6xl pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
             <GraduationCap size={14} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Knowledge Base</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white leading-none">Academic Foundations</h2>
          <p className="text-zinc-500 text-xs font-medium">Manage your institutional pillars and academic milestones.</p>
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
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultEdu); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-xl h-10 px-6 font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
          >
            <Plus size={16} className="mr-2" /> Add Qualification
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.institution ? (
          <motion.div 
            key="preview-edu"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 border border-blue-500/10 rounded-3xl bg-[#0A0A0A] shadow-2xl relative"
          >
             <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10 border-dashed border border-zinc-800 p-8 rounded-2xl">
                <div className="w-24 h-24 rounded-2xl bg-black border border-white/5 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                   {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <GraduationCap size={32} className="text-zinc-900" />}
                </div>
                <div className="flex-1 space-y-4 text-center lg:text-left">
                   <div className="flex items-center justify-center lg:justify-start gap-4">
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none bg-blue-500/10 px-2 py-0.5 rounded-md">{editForm.period || 'PERIOD'}</span>
                      <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{editForm.institution || 'INSTITUTION_NULL'}</span>
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight text-white">{editForm.degree || 'DEGREE_NULL'}</h3>
                   <RichTextRenderer content={editForm.description || ''} className="text-zinc-500 text-sm leading-relaxed max-w-2xl italic mx-auto lg:mx-0" />
                </div>
             </div>
          </motion.div>
        ) : (isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 border border-white/5 rounded-3xl bg-zinc-900/40 relative overflow-hidden shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-8">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">{editingId ? 'Modify Qualification' : 'New Academic Record'}</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={18}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Institutional Name</Label>
                      <Input value={editForm.institution} onChange={e => setEditForm({...editForm, institution: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-white font-bold" placeholder="e.g. Stanford University" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Degree / Qualification</Label>
                      <Input value={editForm.degree} onChange={e => setEditForm({...editForm, degree: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-white font-bold" placeholder="e.g. Master of Computer Science" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Temporal Range</Label>
                      <Input value={editForm.period} onChange={e => setEditForm({...editForm, period: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-white" placeholder="2020 - 2024" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Institutional Logo</Label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <FileUploader 
                            onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                            folder="education"
                            label="Upload Logo"
                          />
                        </div>
                        {editForm.imageUrl && (
                          <div className="w-12 h-12 rounded-xl bg-black border border-white/10 p-2 overflow-hidden shrink-0">
                            <img src={editForm.imageUrl} className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
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

                <div className="flex justify-end pt-6 gap-3 border-t border-white/5">
                   <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white uppercase tracking-widest font-bold text-[10px] h-10">Cancel</Button>
                   <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-8 rounded-xl active:scale-95 transition-all shadow-lg">Save Record</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        {edu.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <Card className="bg-[#0D0D0D] border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/20 transition-all duration-500 group shadow-lg relative">
                <CardContent className="p-8">
                   <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                      <div className="w-16 h-16 rounded-xl bg-black border border-white/5 flex items-center justify-center p-3 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                         {item.imageUrl ? <img src={item.imageUrl} alt={item.institution} className="w-full h-full object-contain" /> : <Building2 size={24} className="text-zinc-900" />}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                         <div className="space-y-1">
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-bold font-mono text-blue-500 uppercase tracking-widest">{item.period}</span>
                               <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                               <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{item.institution}</span>
                            </div>
                            <h3 className="text-xl font-black tracking-tight uppercase text-white group-hover:text-blue-500 transition-colors leading-tight">{item.degree}</h3>
                         </div>
                         <p className="text-zinc-500 text-xs leading-relaxed max-w-3xl italic">{item.description}</p>
                      </div>

                      <div className="flex flex-row md:flex-col items-center gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-all">
                         <Button 
                           variant="ghost" 
                           onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                           className="bg-white/5 hover:bg-blue-500 hover:text-black rounded-lg h-8 px-4 text-[9px] font-bold uppercase tracking-widest"
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
                </CardContent>
             </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

