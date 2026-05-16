import React, { useState } from 'react';
import { useContent } from '@/src/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Globe, Mail, Phone, Github, Linkedin, GraduationCap, MapPin, Share2, Link as LinkIcon, FileText, CheckCircle2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSettings {
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  scholarUrl: string;
  orcidUrl: string;
  researchGateUrl: string;
  mediumUrl: string;
  cvUrl: string;
  location: string;
}

export function SettingsManager() {
  const { data, loading, update } = useContent<GlobalSettings>('settings/global');
  const [form, setForm] = useState<GlobalSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (data && !form) {
      setForm(data);
    } else if (!data && !loading && !form) {
      setForm({
        email: '',
        phone: '',
        linkedinUrl: '',
        githubUrl: '',
        scholarUrl: '',
        orcidUrl: '',
        researchGateUrl: '',
        location: '',
        mediumUrl: '',
        cvUrl: ''
      } as GlobalSettings);
    }
  }, [data, loading, form]);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  const handleSave = async () => {
    if (form) {
      setIsSaving(true);
      try {
        await update(form);
        setIsSaving(false);
        setShowSuccess(true);
        alert('Settings synchronized successfully.');
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err: any) {
        setIsSaving(false);
        console.error(err);
        alert(`Synchronization failed: ${err.message || 'Check your permissions.'}`);
      }
    }
  };

  return (
    <div className="space-y-16 max-w-6xl pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-500">
             <Globe size={16} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Core</span>
          </div>
          <h2 className="text-5xl font-black tracking-tighter uppercase whitespace-nowrap text-white">System Settings</h2>
          <p className="text-zinc-500 text-sm max-w-xl font-medium">Coordinate the global interface parameters, communication vectors, and professional network nodes.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <AnimatePresence>
             {showSuccess && (
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
               >
                  <CheckCircle2 size={14} />
                  Matrix Synchronized
               </motion.div>
             )}
           </AnimatePresence>
           <Button 
            disabled={isSaving}
            onClick={handleSave} 
            className="bg-white text-black hover:bg-zinc-200 rounded-[1.25rem] h-14 px-10 font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center gap-3 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Synchronize Core
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Communication Array */}
        <motion.section 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-8 bg-[#0A0A0A] p-12 rounded-[4rem] border border-white/5 hover:border-cyan-500/20 transition-all duration-700 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <header className="flex items-center gap-4 relative z-10">
             <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shadow-inner">
                <Mail size={20} />
             </div>
             <div>
                <h3 className="text-xl font-black tracking-tight uppercase text-white leading-none">Communication Array</h3>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black mt-2">Primary Inbound Vectors</p>
             </div>
          </header>

          <div className="space-y-8 relative z-10">
            <div className="space-y-3">
              <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">Core Email Vector</Label>
              <div className="relative group/input">
                <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-cyan-500 transition-colors" />
                <Input 
                  value={form?.email || ''} 
                  onChange={e => setForm(f => f ? {...f, email: e.target.value} : null)}
                  className="bg-black border-white/5 h-16 pl-16 rounded-3xl focus:ring-cyan-500/20 text-white font-medium"
                  placeholder="name@domain.com"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">Operational Phone</Label>
              <div className="relative group/input">
                <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-cyan-500 transition-colors" />
                <Input 
                  value={form?.phone || ''} 
                  onChange={e => setForm(f => f ? {...f, phone: e.target.value} : null)}
                  className="bg-black border-white/5 h-16 pl-16 rounded-3xl focus:ring-cyan-500/20 text-white font-medium"
                  placeholder="+X XXX XXX XXXX"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">Geographical Origin</Label>
              <div className="relative group/input">
                <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-cyan-500 transition-colors" />
                <Input 
                  value={form?.location || ''} 
                  onChange={e => setForm(f => f ? {...f, location: e.target.value} : null)}
                  className="bg-black border-white/5 h-16 pl-16 rounded-3xl focus:ring-cyan-500/20 text-white font-medium"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Global Network Nodes */}
        <motion.section 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="space-y-8 bg-[#0A0A0A] p-12 rounded-[4rem] border border-white/5 hover:border-purple-500/20 transition-all duration-700 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <header className="flex items-center gap-4 relative z-10">
             <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
                <Share2 size={20} />
             </div>
             <div>
                <h3 className="text-xl font-black tracking-tight uppercase text-white leading-none">Global Network Nodes</h3>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black mt-2">External Link Integration</p>
             </div>
          </header>

          <div className="grid grid-cols-1 gap-8 relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">LinkedIn Node</Label>
                <div className="relative group/input">
                  <Linkedin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-purple-500" />
                  <Input 
                    value={form?.linkedinUrl || ''} 
                    onChange={e => setForm(f => f ? {...f, linkedinUrl: e.target.value} : null)}
                    className="bg-black border-white/5 h-14 pl-12 rounded-2xl text-xs font-mono"
                    placeholder="URL"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">GitHub Node</Label>
                <div className="relative group/input">
                  <Github size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-purple-500" />
                  <Input 
                    value={form?.githubUrl || ''} 
                    onChange={e => setForm(f => f ? {...f, githubUrl: e.target.value} : null)}
                    className="bg-black border-white/5 h-14 pl-12 rounded-2xl text-xs font-mono"
                    placeholder="URL"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">Medium node</Label>
                <div className="relative group/input">
                  <FileText size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-purple-500" />
                  <Input 
                    value={form?.mediumUrl || ''} 
                    onChange={e => setForm(f => f ? {...f, mediumUrl: e.target.value} : null)}
                    className="bg-black border-white/5 h-14 pl-12 rounded-2xl text-xs font-mono"
                    placeholder="URL"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">Academic Node</Label>
                <div className="relative group/input">
                  <GraduationCap size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-purple-500" />
                  <Input 
                    value={form?.scholarUrl || ''} 
                    onChange={e => setForm(f => f ? {...f, scholarUrl: e.target.value} : null)}
                    className="bg-black border-white/5 h-14 pl-12 rounded-2xl text-xs font-mono"
                    placeholder="Scholar URL"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">ORCID Node</Label>
                <div className="relative group/input">
                  <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-purple-500" />
                  <Input 
                    value={form?.orcidUrl || ''} 
                    onChange={e => setForm(f => f ? {...f, orcidUrl: e.target.value} : null)}
                    className="bg-black border-white/5 h-14 pl-12 rounded-2xl text-xs font-mono"
                    placeholder="URL"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">ResearchGate Node</Label>
                <div className="relative group/input">
                  <Layers size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-purple-500" />
                  <Input 
                    value={form?.researchGateUrl || ''} 
                    onChange={e => setForm(f => f ? {...f, researchGateUrl: e.target.value} : null)}
                    className="bg-black border-white/5 h-14 pl-12 rounded-2xl text-xs font-mono"
                    placeholder="URL"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-4">Digital Resume Node (CV URL)</Label>
              <div className="relative group/input">
                <FileText size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within/input:text-purple-500" />
                <Input 
                  value={form?.cvUrl || ''} 
                  onChange={e => setForm(f => f ? {...f, cvUrl: e.target.value} : null)}
                  className="bg-black border-white/5 h-16 pl-14 rounded-3xl focus:ring-purple-500/20 text-xs font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-12 flex items-center justify-between group overflow-hidden relative">
         <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
         <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 border border-white/5 group-hover:border-cyan-500/30 transition-colors shadow-inner">
               <LinkIcon size={24} />
            </div>
            <div>
               <h4 className="text-lg font-black tracking-tight text-white uppercase leading-none">Security Protocol</h4>
               <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-black mt-2 italic">Ensure your contact vectors are verified before synchronization.</p>
            </div>
         </div>
         <div className="flex gap-4 relative z-10">
            <Button variant="ghost" className="text-zinc-500 hover:text-white uppercase tracking-widest text-[10px] font-black">Reset Matrix</Button>
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white font-black h-12 px-8 rounded-xl active:scale-95 transition-all shadow-xl shadow-cyan-600/10">Push Updates</Button>
         </div>
      </div>
    </div>
  );
}
