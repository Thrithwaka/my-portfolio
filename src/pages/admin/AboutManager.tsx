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
import { getDirectLink } from '@/lib/utils';
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
      alert('Profile updated successfully.');
    } catch (err: any) {
      console.error(err);
      alert(`Update failed: ${err.message || 'Check your permissions.'}`);
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
    <div className="space-y-8 max-w-7xl pb-32">
       {/* CMS Header Section */}
       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-900/40 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px]" />
          <div className="relative z-10 space-y-2">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                   <User size={16} />
                 </div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 leading-none">Persona Design</h3>
             </div>
             <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none text-white">Identity <span className="text-zinc-600">Architect</span></h2>
             <p className="text-zinc-400 text-xs max-w-xl font-medium">Craft the narrative that bridges technical capability with strategic vision.</p>
          </div>
          <div className="relative z-10 flex items-center gap-3">
             <Button 
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
                className="h-10 px-6 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-[10px] rounded-xl border border-white/5"
             >
                {showPreview ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                {showPreview ? 'Exit Preview' : 'Live Preview'}
             </Button>
             <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="h-10 px-8 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-all shadow-lg active:scale-95 group relative"
             >
                {isSaving ? <Loader2 className="animate-spin mr-2" size={14} /> : <Save size={14} className="mr-2" />}
                <span className="uppercase tracking-widest text-[10px]">{isSaving ? 'Saving...' : 'Save Profile'}</span>
             </Button>
          </div>
       </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div 
                key="preview"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-12 p-8 bg-black rounded-3xl border border-blue-500/10 shadow-2xl min-h-[600px] custom-scrollbar overflow-y-auto"
                data-lenis-prevent
              >
                {/* Simulated Hero Section */}
                <div className="space-y-2">
                   <h1 className="text-3xl font-black uppercase tracking-tighter leading-none italic text-blue-600">{form.heroTitle || 'HEADLINE_NULL'}</h1>
                   <p className="text-lg font-bold uppercase tracking-widest text-zinc-600 italic">{form.heroSubtitle || 'SUBTITLE_NULL'}</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Global Directive</h4>
                      <RichTextRenderer content={form.missionStatement} className="text-2xl font-black italic text-emerald-500 leading-tight" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Technical Bio</h4>
                         <RichTextRenderer content={form.bio} className="text-[13px] text-zinc-400 leading-relaxed font-medium" />
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Future Vision</h4>
                         <RichTextRenderer content={form.vision} className="text-[13px] text-zinc-400 leading-relaxed font-medium italic" />
                      </div>
                   </div>

                   <div className="pt-8 border-t border-white/5 space-y-4">
                      <h4 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Archive Content</h4>
                      <div className="space-y-4">
                         <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white">{form.deepIntroTitle}</h2>
                         <RichTextRenderer content={form.deepIntroContent} className="text-[13px] text-zinc-500 leading-relaxed" />
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                {/* HERO CONFIG */}
                <section className="space-y-6">
            <header className="flex items-center gap-3 px-2">
               <div className="w-1 h-3 bg-blue-500 rounded-full" />
               <h3 className="text-sm font-bold uppercase tracking-widest text-white">Cinematic Entrance</h3>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/20 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
              <div className="space-y-2">
                <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Hero Headline</Label>
                <Input 
                  value={form.heroTitle} 
                  onChange={e => setForm(f => ({ ...f, heroTitle: e.target.value }))}
                  className="bg-black border-white/10 h-14 text-lg font-bold tracking-tight rounded-xl px-4 focus:border-blue-500/50 transition-all text-white"
                  placeholder="The Architect Behind Intelligent Systems"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Hero Subtitle</Label>
                <Input 
                  value={form.heroSubtitle} 
                  onChange={e => setForm(f => ({ ...f, heroSubtitle: e.target.value }))}
                  className="bg-black border-white/10 h-14 text-md font-bold tracking-tight rounded-xl px-4 focus:border-blue-500/50 transition-all text-zinc-400"
                  placeholder="Engineering the Next Civilization"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                 <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Hero Asset (Video/Image Link)</Label>
                 <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <FileUploader 
                        onUploadComplete={(url) => setForm(f => ({ ...f, heroVideoUrl: url }))}
                        folder="about"
                        label="Upload Asset"
                      />
                    </div>
                    <Input 
                      value={form.heroVideoUrl} 
                      onChange={e => setForm(f => ({ ...f, heroVideoUrl: e.target.value }))}
                      className="flex-[2] bg-black border-white/10 text-[10px] font-mono h-12 rounded-xl px-4"
                      placeholder="Asset URL..."
                    />
                 </div>
              </div>
            </div>
          </section>

          {/* MISSION & VISION */}
          <section className="space-y-6">
            <header className="flex items-center gap-3 px-2">
               <div className="w-1 h-3 bg-emerald-500 rounded-full" />
               <h3 className="text-sm font-bold uppercase tracking-widest text-white">Strategic Purpose</h3>
            </header>

            <div className="space-y-6 bg-zinc-900/20 p-8 rounded-3xl border border-white/5">
                <RichTextEditor 
                   label="Mission Statement"
                   value={form.missionStatement || ''} 
                   onChange={val => setForm(f => ({ ...f, missionStatement: val }))}
                   placeholder="..."
                />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RichTextEditor 
                  label="Technical Bio"
                  value={form.bio || ''} 
                  onChange={val => setForm(f => ({ ...f, bio: val }))}
                  placeholder="..."
                />
                <RichTextEditor 
                  label="Evolutionary Vision"
                  value={form.vision || ''} 
                  onChange={val => setForm(f => ({ ...f, vision: val }))}
                  placeholder="..."
                />
              </div>
            </div>
          </section>

          {/* DEEP INTRO */}
          <section className="space-y-6 pb-20">
             <header className="flex items-center gap-3 px-2">
               <div className="w-1 h-3 bg-purple-500 rounded-full" />
               <h3 className="text-sm font-bold uppercase tracking-widest text-white">Extended Narrative</h3>
            </header>

            <div className="space-y-8 bg-zinc-900/20 p-8 rounded-3xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Archive Title</Label>
                  <Input 
                    value={form.deepIntroTitle} 
                    onChange={e => setForm(f => ({ ...f, deepIntroTitle: e.target.value }))}
                    className="bg-black border-white/10 h-14 text-lg font-bold tracking-tight rounded-xl px-4"
                    placeholder="The Depth Component"
                  />
                 </div>
                 <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Archive Asset</Label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <FileUploader 
                        onUploadComplete={(url) => setForm(f => ({ ...f, deepIntroImage: url }))}
                        folder="about"
                        label="Upload Asset"
                      />
                    </div>
                    <Input 
                      value={form.deepIntroImage} 
                      onChange={e => setForm(f => ({ ...f, deepIntroImage: e.target.value }))}
                      className="bg-black border-white/10 text-[10px] font-mono h-12 px-4 rounded-xl flex-1"
                      placeholder="URL..."
                    />
                  </div>
                 </div>
              </div>

              <RichTextEditor 
                label="Extended Content"
                value={form.deepIntroContent || ''} 
                onChange={val => setForm(f => ({ ...f, deepIntroContent: val }))}
                placeholder="..."
              />
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
</div>

        {/* IDENTITY PREVIEW */}
        <aside className="lg:col-span-1">
          <div className="sticky top-10 space-y-6">
             <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-3xl space-y-8 backdrop-blur-xl shadow-2xl">
                <div className="space-y-6">
                   <div className="aspect-square w-full rounded-2xl bg-black overflow-hidden relative ring-1 ring-white/10 group">
                      {form.profileImageUrl ? (
                        <img src={getDirectLink(form.profileImageUrl)} className="w-full h-full object-cover transition-transform duration-700 pointer-events-none group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-900"><User size={48} strokeWidth={0.5} /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-6 left-6 right-6">
                         <h4 className="text-xl font-bold uppercase tracking-tight leading-none italic text-white">Thrithwaka P. Shakya</h4>
                         <p className="text-[9px] text-emerald-500/80 uppercase tracking-widest mt-1">Identity Proxy</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black">Identity Tags</Label>
                        <button onClick={addTag} className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-zinc-500 hover:bg-emerald-500 hover:text-black transition-all">
                           <span className="text-sm">+</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {form.identityTags.map((tag, i) => (
                           <motion.span 
                             key={tag+i} 
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:border-emerald-500/20 transition-all"
                           >
                             <span>{tag}</span>
                             <button onClick={() => removeTag(i)} className="hover:text-red-500 transition-colors"><X size={10} /></button>
                           </motion.span>
                         ))}
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5 space-y-3">
                      <Label className="text-zinc-600 uppercase tracking-widest text-[9px] font-black px-2">Profile Photo</Label>
                      <div className="p-4 bg-black rounded-2xl border border-white/5">
                          <FileUploader 
                             onUploadComplete={(url) => setForm(f => ({ ...f, profileImageUrl: url }))}
                             folder="about"
                             label="Update Photo"
                          />
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-6 border border-white/5 rounded-3xl bg-white/[0.01] backdrop-blur-xl">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-emerald-600/5 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-600/10">
                      <Compass size={18} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">System Note</p>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Use specific identity tags for better search relevance.</p>
                   </div>
                </div>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}


