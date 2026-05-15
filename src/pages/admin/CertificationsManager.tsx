import React, { useState } from 'react';
import { useCollection } from '@/src/hooks/useCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/src/components/admin/RichTextEditor';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Award, ExternalLink, Calendar, X, ShieldCheck, Sparkles, Medal, Eye, EyeOff } from 'lucide-react';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';
import { motion, AnimatePresence } from 'motion/react';

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  imageUrl: string;
  verificationUrl: string;
  certificationType: 'Certificates' | 'Badges' | 'Achievements';
  date: string;
  description?: string;
  skills?: string[];
  isFeatured?: boolean;
  priority: number;
}

export function CertificationsManager() {
  const { data: certs, loading, add, update, remove } = useCollection<Certification>('certifications', 'priority');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Certification>>({});

  const defaultCert: Certification = {
    title: '',
    issuer: '',
    imageUrl: '',
    verificationUrl: '',
    certificationType: 'Certificates',
    date: '',
    description: '',
    skills: [],
    isFeatured: false,
    priority: 0
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  const handleSave = async () => {
    if (!editForm.title || !editForm.issuer) return;
    if (editingId) {
      await update(editingId, editForm);
    } else {
      await add(editForm as Certification);
    }
    setEditingId(null);
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <div className="space-y-16 max-w-6xl pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-500">
             <Medal size={16} />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Credentials & Merit</span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap text-white">Certifications</h2>
          <p className="text-zinc-500 text-sm max-w-xl font-medium">Document your technical milestones and verified operational expertise from global institutional leaders.</p>
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
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultCert); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-[1.25rem] h-14 px-8 font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-white/5"
          >
            <Plus size={18} className="mr-3" /> Log Credential
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.title ? (
          <motion.div 
            key="preview-cert"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 border border-blue-500/10 rounded-[3rem] bg-black shadow-3xl overflow-hidden relative"
          >
             <div className="flex flex-col items-center text-center space-y-8 p-10 border-2 border-dashed border-zinc-800 rounded-[2rem]">
                <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                   {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <Award size={48} className="text-zinc-800" />}
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">{editForm.certificationType}</span>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{editForm.issuer}</span>
                   </div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{editForm.title || 'CREDENTIAL_NULL'}</h3>
                   <RichTextRenderer content={editForm.description || ''} className="text-sm text-zinc-500 max-w-md mx-auto" proseSize="sm" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                   {editForm.skills?.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-mono uppercase text-zinc-400">{skill}</span>
                   ))}
                </div>
             </div>
             <div className="absolute top-6 right-6 text-[8px] font-mono text-zinc-800 uppercase tracking-widest">Protocol Simulation: Active</div>
          </motion.div>
        ) : (isAdding || editingId) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-10 border border-white/5 rounded-[3.5rem] bg-zinc-900/40 relative overflow-hidden shadow-2xl"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-10">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Credential Injection Unit</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={20}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Designation (Title)</Label>
                      <Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-amber-500/20 text-lg font-bold text-white" placeholder="e.g. AWS Solutions Architect" />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Issuing Entity</Label>
                      <Input value={editForm.issuer} onChange={e => setEditForm({...editForm, issuer: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 focus:ring-amber-500/20 text-lg font-bold text-amber-500" placeholder="e.g. Amazon Web Services" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Fulfillment Date</Label>
                      <Input value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 font-mono text-white" placeholder="March 2024" />
                   </div>
                   <div className="space-y-4">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Verification Link</Label>
                      <Input value={editForm.verificationUrl} onChange={e => setEditForm({...editForm, verificationUrl: e.target.value})} className="bg-black border-white/5 h-16 rounded-2.5xl px-8 font-mono text-zinc-400" placeholder="https://..." />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Classifier (Type)</Label>
                    <select 
                      value={editForm.certificationType} 
                      onChange={e => setEditForm({...editForm, certificationType: e.target.value as any})}
                      className="w-full bg-black border border-white/5 h-16 rounded-2.5xl px-8 text-white font-bold appearance-none focus:outline-none"
                    >
                      <option value="Certificates">Certificates</option>
                      <option value="Badges">Badges</option>
                      <option value="Achievements">Achievements</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 px-4 pt-10">
                    <input 
                      type="checkbox" 
                      checked={editForm.isFeatured} 
                      onChange={e => setEditForm({...editForm, isFeatured: e.target.checked})}
                      className="w-5 h-5 rounded bg-zinc-800 border-white/10"
                    />
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white">Feature in Ecosystem</Label>
                  </div>
                </div>

                <div className="space-y-4">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Skills / Competencies (Comma separated)</Label>
                   <Input 
                     value={editForm.skills?.join(', ')} 
                     onChange={e => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                     className="bg-black border-white/5 h-16 rounded-2.5xl px-8 font-mono text-xs text-amber-500" 
                     placeholder="React, AWS, Node.js..." 
                   />
                </div>

                <div className="space-y-4">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-4">Visual Verification Asset (Badge/Certificate)</Label>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <FileUploader 
                          onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                          folder="certifications"
                          label="Deploy Image Signal"
                        />
                      </div>
                      {editForm.imageUrl && (
                        <div className="w-16 h-16 rounded-[1.25rem] bg-black border border-white/5 p-2 overflow-hidden shrink-0">
                           <img src={editForm.imageUrl} className="w-full h-full object-contain" />
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-4">
                   <RichTextEditor 
                     label="Credential Description / Skills covered"
                     value={editForm.description || ''} 
                     onChange={val => setEditForm({...editForm, description: val})} 
                     placeholder="Detail the core competencies verified by this credential..." 
                   />
                </div>

                <div className="flex justify-end pt-8 gap-4 border-t border-white/5">
                   <Button variant="ghost" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-500 hover:text-white uppercase tracking-widest font-black text-[10px]">Purge Buffer</Button>
                   <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white font-black h-14 px-12 rounded-2xl active:scale-95 transition-all shadow-xl shadow-amber-600/20">Commit Credential</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certs.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <Card className="bg-[#0A0A0A] border-white/5 rounded-[3rem] overflow-hidden hover:border-amber-500/20 transition-all duration-700 group shadow-2xl relative h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-10 space-y-8 flex flex-col h-full">
                   <div className="w-20 h-20 rounded-[1.5rem] bg-black border border-white/5 flex items-center justify-center p-4 overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-700">
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain" /> : <Award size={32} className="text-zinc-900" />}
                   </div>
                   
                   <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none">{item.issuer}</p>
                        <h4 className="text-xl font-black tracking-tight leading-none uppercase text-white group-hover:text-amber-500 transition-colors line-clamp-2">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-600 font-mono text-[9px] uppercase tracking-widest italic">
                         <Calendar size={12} strokeWidth={3} />
                         <span>Certified: {item.date}</span>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-white/5">
                      {item.verificationUrl ? (
                        <a href={item.verificationUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                           <ExternalLink size={14} />
                           Verify
                        </a>
                      ) : <div />}
                      
                      <div className="flex items-center gap-2">
                         <Button 
                           variant="ghost" 
                           onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                           className="bg-white/5 hover:bg-amber-500 hover:text-black rounded-xl h-10 px-4 text-[9px] font-black uppercase tracking-widest"
                         >
                           Manage
                         </Button>
                         <button 
                           onClick={() => remove(item.id!)} 
                           className="text-zinc-800 hover:text-red-500 transition-colors p-2"
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


