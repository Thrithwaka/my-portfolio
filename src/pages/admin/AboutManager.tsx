import React, { useState } from 'react';
import { useContent } from '@/src/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/src/components/admin/RichTextEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X, User, Heart, Compass, Info, Image as ImageIcon, Video, Eye, EyeOff } from 'lucide-react';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';
import { motion, AnimatePresence } from 'motion/react';

interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  heroVideoUrl: string;
  bio: string;
  vision: string;
  missionStatement: string;
  deepIntroTitle: string;
  deepIntroContent: string;
  deepIntroImage: string;
  profileImageUrl: string;
  identityTags: string[];
}

export function AboutManager() {
  const { data, loading, update } = useContent<AboutContent>('sections/about');
  const [form, setForm] = useState<AboutContent>({
    heroTitle: '',
    heroSubtitle: '',
    heroVideoUrl: '',
    bio: '',
    vision: '',
    missionStatement: '',
    deepIntroTitle: '',
    deepIntroContent: '',
    deepIntroImage: '',
    profileImageUrl: '',
    identityTags: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  React.useEffect(() => {
    if (data) setForm(prev => ({ ...prev, ...data }));
  }, [data]);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await update(form);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    const tag = prompt('Enter Identity Tag:');
    if (tag) setForm(f => ({ ...f, identityTags: [...f.identityTags, tag] }));
  };

  const removeTag = (index: number) => {
    setForm(f => ({ ...f, identityTags: f.identityTags.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-16 max-w-7xl pb-32">
       {/* CMS Header Section */}
       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-zinc-900/10 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px]" />
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                   <User size={20} />
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 leading-none">Persona Design</h3>
                    <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Section ID: SECT_ABOUT_02</p>
                 </div>
             </div>
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Identity <span className="text-zinc-800">Architect</span></h2>
             <p className="text-zinc-500 text-sm max-w-xl font-medium">Define your human-technical intersection. Craft the narrative that bridges your raw technical capability with your strategic vision.</p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
             <Button 
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
                className="h-16 px-8 text-zinc-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-3xl border border-white/5"
             >
                {showPreview ? <EyeOff size={18} className="mr-3" /> : <Eye size={18} className="mr-3" />}
                {showPreview ? 'Exit Simulation' : 'Live Simulation'}
             </Button>
             <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="h-16 px-12 bg-white text-black hover:bg-zinc-200 font-black rounded-3xl transition-all shadow-2xl hover:shadow-white/20 active:scale-95 group relative overflow-hidden"
             >
                {isSaving ? <Loader2 className="animate-spin mr-3" /> : <Save size={18} className="mr-3 group-hover:scale-110 transition-transform" />}
                <span className="uppercase tracking-[0.2em] text-[11px]">{isSaving ? 'Committing Persona...' : 'Commit Brand'}</span>
             </Button>
          </div>
       </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-20 p-12 bg-black rounded-[4rem] border border-blue-500/10 shadow-2xl min-h-[800px]"
              >
                {/* Simulated Hero Section */}
                <div className="space-y-4">
                   <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic text-blue-600">{form.heroTitle || 'HEADLINE_NULL'}</h1>
                   <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.1em] text-zinc-600 italic">{form.heroSubtitle || 'SUBTITLE_NULL'}</p>
                </div>

                <div className="grid grid-cols-1 gap-12 pt-10">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Global Directive</h4>
                      <RichTextRenderer content={form.missionStatement} className="text-2xl md:text-3xl font-black italic text-emerald-500 leading-tight" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Technical Bio</h4>
                         <RichTextRenderer content={form.bio} className="text-sm text-zinc-400 leading-relaxed font-medium" />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Future Vision</h4>
                         <RichTextRenderer content={form.vision} className="text-sm text-zinc-400 leading-relaxed font-medium italic" />
                      </div>
                   </div>

                   <div className="pt-10 border-t border-white/5 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Archive Content</h4>
                      <div className="space-y-6">
                         <h2 className="text-3xl font-black uppercase tracking-tighter italic">{form.deepIntroTitle}</h2>
                         <RichTextRenderer content={form.deepIntroContent} className="text-zinc-500 leading-relaxed" />
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                {/* HERO CONFIG */}
                <section className="space-y-10 group/section">
            <header className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                  <h3 className="text-xl font-black tracking-tight uppercase italic">Cinematic Entrance</h3>
               </div>
               <span className="text-[10px] font-mono text-zinc-800">CONFIG_A1</span>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/20 p-10 rounded-[3rem] border border-white/5 backdrop-blur-sm">
              <div className="space-y-4">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Hero Headline</Label>
                <Input 
                  value={form.heroTitle} 
                  onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))}
                  className="bg-black border-white/5 h-20 text-2xl font-black tracking-tight rounded-2xl px-6 focus:border-blue-500/20 transition-all"
                  placeholder="The Architect Behind Intelligent Systems"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Hero Subtitle</Label>
                <Input 
                  value={form.heroSubtitle} 
                  onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))}
                  className="bg-black border-white/5 h-20 text-xl font-bold tracking-tight rounded-2xl px-6 focus:border-blue-500/20 transition-all text-zinc-400"
                  placeholder="Engineering the Next Civilization"
                />
              </div>
              
              <div className="md:col-span-2 pt-4">
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Visual Identity Asset</Label>
                     <Video size={14} className="text-zinc-800" />
                   </div>
                   <div className="p-8 bg-black rounded-[2.5rem] border border-white/5 space-y-6">
                      <FileUploader 
                        onUploadComplete={(url) => setForm(f => ({ ...f, heroVideoUrl: url }))}
                        folder="about"
                        label="Inject Global Intro Asset"
                      />
                      <Input 
                        value={form.heroVideoUrl} 
                        onChange={e => setForm(f => ({ ...f, heroVideoUrl: e.target.value }))}
                        className="bg-zinc-900 border-white/5 text-[10px] font-mono h-12 rounded-xl px-4"
                        placeholder="Direct URL Link (Protocol Required)..."
                      />
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* MISSION & VISION */}
          <section className="space-y-10">
            <header className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  <h3 className="text-xl font-black tracking-tight uppercase italic">Strategic Purpose</h3>
               </div>
               <span className="text-[10px] font-mono text-zinc-800">CORE_SYNC</span>
            </header>

            <div className="space-y-8 bg-zinc-900/20 p-10 rounded-[4rem] border border-white/5">
               <div className="space-y-4">
                 <RichTextEditor 
                    label="Mission Statement (Global Directive)"
                    value={form.missionStatement || ''} 
                    onChange={val => setForm(f => ({ ...f, missionStatement: val }))}
                    placeholder="Capture your ultimate purpose in one high-frequency signal..."
                 />
               </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <RichTextEditor 
                  label="Technical Biography"
                  value={form.bio || ''} 
                  onChange={val => setForm(f => ({ ...f, bio: val }))}
                  placeholder="Orchestrate the journey from inception to innovation..."
                />
                <RichTextEditor 
                  label="Evolutionary Vision"
                  value={form.vision || ''} 
                  onChange={val => setForm(f => ({ ...f, vision: val }))}
                  placeholder="Where is the logic path leading you next?"
                />
              </div>
            </div>
          </section>

          {/* DEEP INTRO */}
          <section className="space-y-10 pb-20">
             <header className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                  <h3 className="text-xl font-black tracking-tight uppercase italic">Extended Narrative</h3>
               </div>
               <span className="text-[10px] font-mono text-zinc-800">DATA_ARCHIVE</span>
            </header>

            <div className="space-y-12 bg-zinc-900/20 p-12 rounded-[4rem] border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-4">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Archive Title</Label>
                  <Input 
                    value={form.deepIntroTitle} 
                    onChange={e => setForm(f => ({ ...f, deepIntroTitle: e.target.value }))}
                    className="bg-black border-white/5 h-20 text-xl font-black tracking-tight rounded-2xl px-6"
                    placeholder="The Depth Component"
                  />
                 </div>
                 <div className="space-y-4">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Archive Asset (Markdown Ref)</Label>
                  <div className="bg-black p-4 rounded-2xl space-y-4 border border-white/5">
                    <FileUploader 
                      onUploadComplete={(url) => setForm(f => ({ ...f, deepIntroImage: url }))}
                      folder="about"
                      label="Replace Image"
                    />
                    <Input 
                      value={form.deepIntroImage} 
                      onChange={e => setForm(f => ({ ...f, deepIntroImage: e.target.value }))}
                      className="bg-zinc-900 border-white/5 text-[10px] font-mono h-10 px-4"
                      placeholder="Asset URL..."
                    />
                  </div>
                 </div>
              </div>

              <div className="space-y-4">
                <RichTextEditor 
                  label="Neural Web Logic (Content)"
                  value={form.deepIntroContent || ''} 
                  onChange={val => setForm(f => ({ ...f, deepIntroContent: val }))}
                  placeholder="System Architecture..."
                />
              </div>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
</div>

        {/* IDENTITY PREVIEW */}
        <aside className="lg:col-span-1">
          <div className="sticky top-10 space-y-10">
             <div className="p-10 bg-zinc-900/40 border border-white/5 rounded-[4rem] space-y-10 overflow-hidden relative group backdrop-blur-xl ring-1 ring-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 blur-[100px] group-hover:bg-emerald-600/20 transition-all duration-1000" />
                <div className="space-y-8 relative z-10">
                   <div className="aspect-square w-full rounded-[3rem] bg-black overflow-hidden relative ring-1 ring-white/10 group-hover:ring-emerald-500/50 transition-all duration-1000 shadow-inner">
                      {form.profileImageUrl ? (
                        <img src={form.profileImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] pointer-events-none" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-900"><User size={80} strokeWidth={0.5} /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-10 left-10 right-10">
                         <h4 className="text-3xl font-black tracking-tighter uppercase leading-none italic mb-2">Thrithwaka P. Shakya</h4>
                         <p className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest">Active Identity Proxy</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between px-4">
                        <Label className="text-zinc-600 uppercase tracking-[0.3em] text-[9px] font-black italic">Identity Cluster</Label>
                        <button onClick={addTag} className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-emerald-500 hover:text-black transition-all">
                           <span className="text-lg">+</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3 px-2">
                         {form.identityTags.map((tag, i) => (
                           <motion.span 
                             key={tag+i} 
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="group/tag flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase italic hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all cursor-default"
                           >
                             <span className="text-white group-hover/tag:text-emerald-500">{tag}</span>
                             <button onClick={() => removeTag(i)} className="opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-red-500"><X size={10} /></button>
                           </motion.span>
                         ))}
                         {form.identityTags.length === 0 && <p className="text-[9px] text-zinc-800 uppercase tracking-widest font-mono italic p-4">No tags active in current cluster...</p>}
                      </div>
                   </div>

                   <div className="pt-10 border-t border-white/5 space-y-8">
                      <div className="space-y-4">
                         <div className="flex items-center justify-between px-2">
                           <Label className="text-zinc-600 uppercase tracking-[0.3em] text-[9px] font-black">Visual Identity Proxy</Label>
                           <ImageIcon size={12} className="text-zinc-800" />
                         </div>
                         <div className="p-6 bg-black rounded-3xl border border-white/5 group-hover:border-emerald-500/10 transition-colors">
                            <FileUploader 
                               onUploadComplete={(url) => setForm(f => ({ ...f, profileImageUrl: url }))}
                               folder="about"
                               label="Update Neural Fragment (Photo)"
                            />
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-8 border border-white/[0.03] rounded-[3rem] bg-white/[0.01] backdrop-blur-xl group hover:border-white/10 transition-all">
                <div className="flex items-start gap-6">
                   <div className="w-12 h-12 rounded-[1.5rem] bg-emerald-600/5 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-600/10 group-hover:bg-emerald-600 group-hover:text-black transition-all duration-500">
                      <Compass size={20} />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-emerald-500 transition-colors">System Integrity Note</p>
                      <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">Your identity cluster is the metadata used for <span className="text-white">Smart Search Integration</span>. Ensure tags represent distinct professional pillars.</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


