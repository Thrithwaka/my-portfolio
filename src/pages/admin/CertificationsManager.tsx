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
    <div className="space-y-8 max-w-6xl pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-500">
             <Medal size={14} />
             <span className="text-[10px] font-bold uppercase tracking-widest">Credentials & Merit</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase text-white leading-none">Certifications</h2>
          <p className="text-zinc-500 text-xs font-medium">Document your technical milestones and verified expertise.</p>
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
            onClick={() => { setIsAdding(true); setEditingId(null); setEditForm(defaultCert); }} 
            className="bg-white text-black hover:bg-zinc-200 rounded-xl h-10 px-6 font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
          >
            <Plus size={16} className="mr-2" /> Log Credential
          </Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview && editForm.title ? (
          <motion.div 
            key="preview-cert"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-8 border border-blue-500/10 rounded-3xl bg-black shadow-2xl relative"
          >
             <div className="flex flex-col items-center text-center space-y-6 p-8 border border-dashed border-zinc-800 rounded-2xl">
                <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                   {editForm.imageUrl ? <img src={editForm.imageUrl} className="w-full h-full object-cover" /> : <Award size={32} className="text-zinc-800" />}
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] font-black text-amber-500 uppercase tracking-widest">{editForm.certificationType}</span>
                      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{editForm.issuer}</span>
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight text-white">{editForm.title || 'CREDENTIAL_NULL'}</h3>
                   <RichTextRenderer content={editForm.description || ''} className="text-xs text-zinc-500 max-w-md mx-auto" proseSize="sm" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                   {editForm.skills?.map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-white/5 rounded-md text-[8px] font-mono uppercase text-zinc-400">{skill}</span>
                   ))}
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
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-8">
                <header className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-500">{editingId ? 'Modify Credential' : 'New Credential Log'}</h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-zinc-600 hover:text-white transition-colors"><X size={18}/></button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Designation (Title)</Label>
                      <Input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-white font-bold" placeholder="e.g. AWS Solutions Architect" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Issuing Entity</Label>
                      <Input value={editForm.issuer} onChange={e => setEditForm({...editForm, issuer: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 text-amber-500 font-bold" placeholder="e.g. Amazon Web Services" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Fulfillment Date</Label>
                      <Input value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-white" placeholder="March 2024" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Verification Link</Label>
                      <Input value={editForm.verificationUrl} onChange={e => setEditForm({...editForm, verificationUrl: e.target.value})} className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-zinc-400" placeholder="https://..." />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Classifier (Type)</Label>
                    <select 
                      value={editForm.certificationType} 
                      onChange={e => setEditForm({...editForm, certificationType: e.target.value as any})}
                      className="w-full bg-black border border-white/10 h-12 rounded-xl px-4 text-white font-bold appearance-none focus:outline-none"
                    >
                      <option value="Certificates">Certificates</option>
                      <option value="Badges">Badges</option>
                      <option value="Achievements">Achievements</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 px-2 h-12 mt-4 sm:mt-0">
                    <input 
                      type="checkbox" 
                      checked={editForm.isFeatured} 
                      onChange={e => setEditForm({...editForm, isFeatured: e.target.checked})}
                      className="w-4 h-4 rounded bg-zinc-800 border-white/10"
                    />
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-white">Feature in Ecosystem</Label>
                  </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Competencies (Comma separated)</Label>
                   <Input 
                     value={editForm.skills?.join(', ')} 
                     onChange={e => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                     className="bg-black border-white/10 h-12 rounded-xl px-4 font-mono text-[11px] text-amber-500" 
                     placeholder="React, AWS, Node.js..." 
                   />
                </div>

                <div className="space-y-2">
                   <Label className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold px-2">Visual Asset</Label>
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <FileUploader 
                          onUploadComplete={url => setEditForm({...editForm, imageUrl: url})} 
                          folder="certifications"
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
                   <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-10 px-8 rounded-xl active:scale-95 transition-all shadow-lg">Save Credential</Button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((item) => (
          <motion.div 
            layout
            key={item.id}
            className="group relative"
          >
             <Card className="bg-[#0A0A0A] border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/20 transition-all duration-500 group shadow-lg relative h-full">
                <CardContent className="p-6 space-y-6 flex flex-col h-full">
                   <div className="w-16 h-16 rounded-xl bg-black border border-white/5 flex items-center justify-center p-3 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-contain" /> : <Award size={24} className="text-zinc-900" />}
                   </div>
                   
                   <div className="flex-1 space-y-2">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">{item.issuer}</p>
                        <h4 className="text-[15px] font-bold tracking-tight uppercase text-white group-hover:text-amber-500 transition-colors line-clamp-2">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600 font-mono text-[8px] uppercase tracking-widest italic">
                         <Calendar size={10} strokeWidth={3} />
                         <span>Certified: {item.date}</span>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      {item.verificationUrl ? (
                        <a href={item.verificationUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                           <ExternalLink size={12} />
                           Verify
                        </a>
                      ) : <div />}
                      
                      <div className="flex items-center gap-1.5">
                         <Button 
                           variant="ghost" 
                           onClick={() => { setEditingId(item.id!); setEditForm(item); setIsAdding(false); }}
                           className="bg-white/5 hover:bg-amber-500 hover:text-black rounded-lg h-8 px-3 text-[8px] font-bold uppercase tracking-widest"
                         >
                           Edit
                         </Button>
                         <button 
                           onClick={() => remove(item.id!)} 
                           className="text-zinc-800 hover:text-red-500 transition-colors p-1.5"
                         >
                             <Trash2 size={14} />
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


