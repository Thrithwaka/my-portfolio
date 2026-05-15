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
    <div className="space-y-10 max-w-7xl pb-20">
       {/* CMS Header Section */}
       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-900/40 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]" />
          <div className="relative z-10 space-y-2">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg">
                   <Sparkles size={16} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 leading-none">Hero Manager</h3>
             </div>
             <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none text-white">Identity <span className="text-zinc-600">Synchronizer</span></h2>
             <p className="text-zinc-400 text-xs max-w-xl font-medium">Manage the primary visual and conceptual greeting of your portfolio.</p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
             <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-xl active:scale-95 group"
             >
                {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                <span className="uppercase tracking-widest text-[10px]">{isSaving ? 'Saving...' : 'Save Changes'}</span>
             </Button>
          </div>
       </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Column */}
        <div className="space-y-6">
          <div className="space-y-8 p-8 border border-white/5 rounded-3xl bg-zinc-900/20 backdrop-blur-sm">
            <div className="space-y-3">
              <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Primary Title</Label>
              <Input 
                value={form.title} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="bg-black border-white/10 h-14 text-xl font-bold tracking-tight rounded-xl px-6 focus:border-blue-500/50 transition-all"
                placeholder="Your Name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Subtitle / Role</Label>
                <Input 
                  value={form.subtitle} 
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="bg-black border-white/10 h-12 rounded-xl px-4 font-semibold text-sm text-zinc-300 transition-all"
                  placeholder="AI Engineer | Researcher"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">CTA Button Text</Label>
                <Input 
                  value={form.ctaText} 
                  onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))}
                  className="bg-black border-white/10 h-12 rounded-xl px-4 font-semibold text-sm text-blue-500 transition-all"
                  placeholder="Initiate Contact"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 p-8 border border-white/5 rounded-3xl bg-zinc-900/20 backdrop-blur-sm">
            <Label className="text-zinc-500 uppercase tracking-widest text-[10px] font-black italic">Background Visuals</Label>
            <div className="space-y-6">
               <FileUploader 
                 onUploadComplete={(url) => setForm(f => ({ ...f, bgImageUrl: url }))}
                 folder="hero"
                 label="Upload Background (Image/Video)"
               />
               <Input 
                 value={form.bgImageUrl} 
                 onChange={e => setForm(f => ({ ...f, bgImageUrl: e.target.value }))}
                 className="bg-black border-white/10 text-[10px] font-mono h-12 px-4 rounded-xl text-zinc-500 focus:text-blue-500"
                 placeholder="Direct URL..."
               />
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-6">
           <div className="sticky top-10 space-y-6">
              <div className="aspect-video rounded-[2.5rem] border border-white/10 overflow-hidden bg-zinc-950 relative shadow-2xl group">
                 {/* Live Background */}
                 <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                       {form.bgImageUrl ? (
                        <motion.div
                          key={form.bgImageUrl}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full"
                        >
                          {form.bgImageUrl.includes('mp4') ? (
                            <video src={form.bgImageUrl} autoPlay muted loop className="w-full h-full object-cover opacity-50 grayscale" />
                          ) : (
                            <img src={form.bgImageUrl} className="w-full h-full object-cover opacity-50 grayscale" />
                          )
                        }
                        </motion.div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-[#020202]" />
                      )}
                    </AnimatePresence>
                 </div>
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60" />
                 
                 <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2">{form.subtitle || 'SUBTITLE'}</p>
                    <h1 className="text-3xl md:text-4xl font-black uppercase italic leading-none text-white mb-6">{form.title || 'YOUR NAME'}</h1>
                    <button className="px-6 py-2 border border-white/20 rounded-full text-[8px] font-black uppercase tracking-widest text-white">
                      {form.ctaText || 'ACTION'}
                    </button>
                 </div>
              </div>
              
              <div className="p-6 border border-white/[0.03] rounded-3xl bg-white/[0.01] backdrop-blur-xl group hover:border-white/10 transition-all">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 border border-blue-600/10">
                       <Sparkles size={16} />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white">Preview Mode</p>
                       <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Visualizing live changes inside the portfolio container layout.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


