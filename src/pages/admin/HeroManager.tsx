import React, { useState } from 'react';
import { useContent } from '@/src/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Eye, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { motion, AnimatePresence } from 'motion/react';

interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  bgImageUrl?: string;
}

export function HeroManager() {
  const { data, loading, update } = useContent<HeroContent>('sections/hero');
  const [form, setForm] = useState<HeroContent>({
    title: '',
    subtitle: '',
    ctaText: '',
    bgImageUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (data) setForm(prev => ({ ...prev, ...data }));
  }, [data]);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await update(form);
      // Success state handled by feedback
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-16 max-w-7xl pb-32">
       {/* CMS Header Section */}
       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-zinc-900/10 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]" />
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                   <Sparkles size={20} />
                </div>
                <div className="flex flex-col">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 leading-none">Core Identity</h3>
                   <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Section ID: SECT_HERO_01</p>
                </div>
             </div>
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Hero <span className="text-zinc-800">Synchronizer</span></h2>
             <p className="text-zinc-500 text-sm max-w-xl font-medium">Orchestrate the primary visual and conceptual greeting of your professional ecosystem. This is the first signal investors and partners receive.</p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="flex flex-col items-end mr-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Sync Status</span>
                <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   ENCRYPTED & READY
                </span>
             </div>
             <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="h-16 px-12 bg-white text-black hover:bg-zinc-200 font-black rounded-3xl transition-all shadow-2xl hover:shadow-white/20 active:scale-95 group relative overflow-hidden"
             >
                {isSaving ? <Loader2 className="animate-spin mr-3" /> : <Save size={18} className="mr-3 group-hover:scale-110 transition-transform" />}
                <span className="uppercase tracking-[0.2em] text-[11px]">{isSaving ? 'Synchronizing...' : 'Commit Signal'}</span>
             </Button>
          </div>
       </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Configuration Column */}
        <div className="space-y-12">
          <div className="space-y-10 p-10 border border-white/5 rounded-[3rem] bg-zinc-900/20 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Primary Brand Authority (Title)</Label>
                <span className="text-[9px] text-zinc-700 font-mono">01</span>
              </div>
              <Input 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="bg-black border-white/5 h-24 text-4xl font-black tracking-tight rounded-[2rem] px-8 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-zinc-900"
                placeholder="THRITHWAKA PREETHI SHAKYA"
              />
              <div className="flex items-center justify-between px-4">
                <p className="text-[9px] text-zinc-700 font-mono tracking-widest uppercase italic max-w-[70%]">Logic: Massive typography projects immediate confidence and technical authority.</p>
                <span className="text-[9px] text-zinc-800 font-bold uppercase">{form.title.length}/60</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Identity Signal (Subtitle)</Label>
                <Input 
                  value={form.subtitle} 
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="bg-black border-white/5 h-16 rounded-2xl px-6 font-bold tracking-tight text-zinc-300 focus:border-blue-500/30 transition-all"
                  placeholder="AI Engineer | Researcher"
                />
              </div>
              <div className="space-y-4">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Conversion Action (CTA)</Label>
                <Input 
                  value={form.ctaText} 
                  onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))}
                  className="bg-black border-white/5 h-16 rounded-2xl px-6 font-bold tracking-tight text-blue-500 focus:border-blue-500/30 transition-all"
                  placeholder="Initiate Contact"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-6">
              <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Ambient Background Matrix</Label>
              <ImageIcon size={14} className="text-zinc-700" />
            </div>
            <div className="space-y-8 bg-[#0D0D0D] p-10 rounded-[3.5rem] border border-white/5 group transition-all hover:border-blue-500/20">
               <FileUploader 
                 onUploadComplete={(url) => setForm(f => ({ ...f, bgImageUrl: url }))}
                 folder="hero"
                 label="Inject Visual Asset"
               />
               
               <div className="relative">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                 <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black text-zinc-800 group-hover:text-blue-900 transition-colors">
                   <span className="bg-[#0D0D0D] px-6 italic">Protocol: Asset Persistence</span>
                 </div>
               </div>

               <Input 
                 value={form.bgImageUrl} 
                 onChange={e => setForm(f => ({ ...f, bgImageUrl: e.target.value }))}
                 className="bg-black border-white/5 text-[10px] font-mono h-14 px-6 rounded-2xl tracking-tighter text-zinc-600 focus:text-blue-500"
                 placeholder="Direct Image/Video URL (Protocol Required)..."
               />
               <p className="text-[9px] text-zinc-700 uppercase tracking-[0.2em] font-bold text-center italic">Best Practice: 4K MP4 loop with low bitrate for seamless performance.</p>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-8">
           <div className="sticky top-10 space-y-8">
              <header className="flex items-center justify-between px-6">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Global Live Simulation</h3>
                 </div>
                 <div className="flex gap-2">
                    {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-900 group-hover:bg-zinc-700 transition-colors" />)}
                 </div>
              </header>
              
              <div className="aspect-[16/10] rounded-[4rem] border border-white/10 overflow-hidden bg-zinc-950 relative shadow-2xl shadow-black ring-1 ring-white/5 group">
                 {/* Live Background */}
                 <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                      {form.bgImageUrl ? (
                        <motion.div
                          key={form.bgImageUrl}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="w-full h-full"
                        >
                          {form.bgImageUrl.includes('mp4') ? (
                            <video src={form.bgImageUrl} autoPlay muted loop className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
                          ) : (
                            <img src={form.bgImageUrl} className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
                          )
                        }
                        </motion.div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-[#020202]" />
                      )}
                    </AnimatePresence>
                 </div>
                 
                 {/* Cinematic Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                 
                 <div className="relative z-10 h-full flex flex-col items-center justify-center p-16 text-center text-white">
                    <motion.div
                      initial={false}
                      className="space-y-10"
                    >
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-500 drop-shadow-lg">
                          {form.subtitle || 'TECHNICAL ARCHITECT'}
                        </p>
                        <h1 className="text-5xl md:text-6xl font-black tracking-[calc(-0.06em)] uppercase leading-[0.85] italic max-w-lg mx-auto">
                          {form.title || 'ARCHITECT NAME'}
                        </h1>
                      </div>
                      
                      <div className="flex flex-col items-center gap-8">
                        <div className="w-px h-16 bg-white/10" />
                        <button className="px-10 py-4 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl hover:bg-white hover:text-black transition-all duration-500 shadow-2xl hover:shadow-white/20">
                          {form.ctaText || 'ENTER ARCHIVE'}
                        </button>
                      </div>
                    </motion.div>
                 </div>

                 {/* Simulated OS Elements */}
                 <div className="absolute top-10 left-10 text-[9px] font-mono text-white/10 uppercase tracking-[0.4em]">SYSTEM_VERSION_1.0_PROTOTYPE</div>
                 <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] italic">Ecosystem Integrity Active</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                    </div>
                    <div className="w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
                       <div className="w-2/3 h-full bg-blue-500/20" />
                    </div>
                 </div>
              </div>
              
              <div className="p-8 border border-white/[0.03] rounded-[3rem] bg-white/[0.01] backdrop-blur-xl group hover:border-white/10 transition-all">
                 <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-[1.5rem] bg-blue-600/5 flex items-center justify-center text-blue-600 shrink-0 border border-blue-600/10 group-hover:bg-blue-600 group-hover:text-black transition-all duration-500">
                       <Sparkles size={20} />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-blue-500 transition-colors">Design Logic Output</p>
                       <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">The hero section utilizes a <span className="text-white">Dynamic Viewport Logic</span>. Background assets are optimized for ultra-wide displays while text clusters maintain a central focus point for mobile compatibility.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


