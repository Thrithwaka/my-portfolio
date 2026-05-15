import React, { useState } from 'react';
import { useCollection } from '@/src/hooks/useCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Trash2, Wrench, Cpu, Zap, X, Sparkles, Box, Hammer } from 'lucide-react';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { motion, AnimatePresence } from 'motion/react';

interface Skill {
  id?: string;
  name: string;
  category: string;
  level?: number;
  iconUrl?: string;
}

export function ToolkitManager() {
  const { data: skills, loading, add, remove, update } = useCollection<Skill>('skills');
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    category: 'technical_systems'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isInjecting, setIsInjecting] = useState(false);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  const handleAddOrUpdate = async () => {
    if (!newSkill.name) return;
    setIsInjecting(true);
    try {
      if (editingId) {
        await update(editingId, newSkill);
        setEditingId(null);
      } else {
        await add(newSkill);
      }
      setNewSkill({ name: '', category: 'technical_systems' });
    } finally {
      setIsInjecting(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setNewSkill(skill);
    setEditingId(skill.id!);
  };

  const categories = ['technical_systems', 'strategic_impact', 'innovation_lab', 'creative_toolkit'];

  return (
    <div className="space-y-16 max-w-7xl pb-32">
       {/* CMS Header Section */}
       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-zinc-900/10 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[100px]" />
          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                   <Hammer size={20} />
                </div>
                <div className="flex flex-col">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 leading-none">Operational Stack</h3>
                   <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Skill ID Cluster: SKILL_GRID_ALPHA</p>
                </div>
             </div>
             <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Toolkit <span className="text-zinc-800">Mastery</span></h2>
             <p className="text-zinc-500 text-sm max-w-xl font-medium">Synchronize your technical weaponry. Define the high-density capabilities that separate your engineering logic from standard paradigms.</p>
          </div>
          <div className="relative z-10 flex flex-col items-end gap-2 text-right">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Total Capabilities</span>
             <div className="text-5xl font-black italic tracking-tighter leading-none text-white">{skills.length}</div>
             <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Active Resonance</span>
          </div>
       </header>

      {/* Injection Control Unit */}
      <div className="relative">
         <div className="p-10 bg-zinc-900/20 border border-white/5 rounded-[4rem] backdrop-blur-md relative overflow-hidden group/inject shadow-2xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 blur-[80px]" />
            <div className="relative z-10 space-y-10">
               <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Inject New Capability Proxy</h3>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-widest italic group-hover/inject:text-blue-900 transition-colors">Protocol: MANUAL_DEPLOYMENT</span>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                 <div className="lg:col-span-5 space-y-4">
                   <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-black italic px-4">Capability Descriptor (Name)</Label>
                   <Input 
                     value={newSkill.name} 
                     onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                     className="bg-black border-white/5 h-16 rounded-2xl px-6 focus:border-blue-500/20 transition-all font-bold tracking-tight text-white placeholder:text-zinc-800"
                     placeholder="e.g. NEURAL ARCHITECTURE"
                   />
                 </div>
                 
                 <div className="lg:col-span-3 space-y-4">
                   <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-black italic px-4">Cluster Branch</Label>
                   <div className="relative group/select">
                      <select 
                        value={newSkill.category} 
                        onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                        className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 text-[11px] uppercase font-black tracking-widest text-zinc-400 focus:text-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 appearance-none transition-all cursor-pointer"
                      >
                        <option value="technical_systems">Technical Systems</option>
                        <option value="strategic_impact">Strategic Impact</option>
                        <option value="innovation_lab">Innovation Lab</option>
                        <option value="creative_toolkit">Creative Toolkit</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-800 group-hover/select:text-blue-500 transition-colors">
                         <Box size={14} />
                      </div>
                   </div>
                 </div>

                 <div className="lg:col-span-4 space-y-4">
                   <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-black italic px-4">Vector Graphic (Icon)</Label>
                   <div className="flex gap-4">
                     <div className="flex-1">
                       <FileUploader 
                         onUploadComplete={(url) => setNewSkill({...newSkill, iconUrl: url})}
                         folder="skills"
                         label="Upload Vector"
                       />
                     </div>
                     {newSkill.iconUrl && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-16 h-16 bg-black rounded-2xl border border-blue-500/20 flex items-center justify-center p-3 relative group/icon shrink-0 shadow-lg shadow-blue-500/5"
                        >
                           <img src={newSkill.iconUrl} className="w-full h-full object-contain filter grayscale group-hover/icon:grayscale-0 transition-all" />
                           <button onClick={() => setNewSkill({...newSkill, iconUrl: ''})} className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-[8px] font-bold shadow-2xl hover:scale-110 active:scale-90 transition-all">
                              <X size={10} />
                           </button>
                        </motion.div>
                     )}
                   </div>
                 </div>
               </div>
               
               <div className="flex justify-end pt-4 gap-4">
                  {editingId && (
                    <Button 
                      variant="ghost"
                      onClick={() => { setEditingId(null); setNewSkill({ name: '', category: 'technical_systems' }); }}
                      className="h-16 px-10 text-zinc-500 hover:text-white font-black uppercase tracking-widest text-[10px]"
                    >
                      Cancel Reconfig
                    </Button>
                  )}
                  <Button 
                    onClick={handleAddOrUpdate} 
                    disabled={isInjecting || !newSkill.name}
                    className="h-16 px-16 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl active:scale-95 transition-all shadow-2xl hover:shadow-white/10 group overflow-hidden"
                  >
                    {isInjecting ? <Loader2 className="animate-spin" /> : (
                       <>
                         <div className="w-1.5 h-1.5 bg-black rounded-full mr-3 animate-pulse" />
                         {editingId ? 'Commit Mutation' : 'Inject Master Protocol'}
                       </>
                    )}
                  </Button>
               </div>
            </div>
         </div>
      </div>

      {/* Skills Matrix Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        {categories.map((cat, idx) => {
          const categorySkills = skills.filter(s => s.category === cat);
          const iconMap: Record<string, React.ReactNode> = {
            technical_systems: <Cpu size={24} />,
            strategic_impact: <Zap size={24} />,
            innovation_lab: <Sparkles size={24} />,
            creative_toolkit: <Box size={24} />
          };

          return (
            <div key={cat} className="space-y-10 group/category">
              <header className="flex items-center justify-between border-b border-white/[0.03] pb-10 transition-colors group-hover/category:border-white/10">
                 <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center border transition-all duration-700
                      ${cat === 'technical_systems' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 group-hover/category:bg-blue-500 group-hover/category:text-black shadow-lg shadow-blue-500/5' : 
                        cat === 'strategic_impact' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover/category:bg-amber-500 group-hover/category:text-black shadow-lg shadow-amber-500/5' :
                        cat === 'innovation_lab' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20 group-hover/category:bg-purple-500 group-hover/category:text-black shadow-lg shadow-purple-500/5' :
                        'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 group-hover/category:bg-zinc-500 group-hover/category:text-black shadow-lg shadow-zinc-500/5'}`}
                    >
                       {iconMap[cat]}
                    </div>
                    <div>
                       <h3 className="text-xl font-black tracking-tight uppercase italic leading-none">{cat.replace('_', ' ')}</h3>
                       <p className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest mt-2 group-hover/category:text-zinc-500 transition-colors">Operational Sector {idx + 1}</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-3xl font-black italic tracking-tighter text-zinc-900 group-hover/category:text-white transition-colors">{categorySkills.length}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-800">Units</span>
                 </div>
              </header>

              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                  {categorySkills.map(skill => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, x: 20 }}
                      key={skill.id} 
                      className="group/item flex items-center justify-between p-6 bg-zinc-900/10 border border-white/[0.03] rounded-[2rem] hover:bg-zinc-950 hover:border-white/10 transition-all duration-500 shadow-sm"
                    >
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-[1.25rem] bg-black border border-white/5 flex items-center justify-center p-3 overflow-hidden shrink-0 group-hover/item:border-white/20 transition-all">
                            {skill.iconUrl ? (
                               <img src={skill.iconUrl} className="w-full h-full object-contain filter grayscale group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all" />
                            ) : (
                               <Box size={18} className="text-zinc-800 group-hover/item:text-zinc-600 transition-colors" />
                            )}
                         </div>
                         <div className="space-y-0.5">
                            <span className="text-[13px] font-black tracking-tight uppercase text-zinc-400 group-hover/item:text-white transition-colors italic">{skill.name}</span>
                            <div className="flex items-center gap-2">
                               <div className="w-1 h-1 rounded-full bg-emerald-500 group-hover/item:animate-pulse" />
                               <span className="text-[9px] font-mono text-zinc-800 uppercase tracking-widest group-hover/item:text-emerald-900 transition-colors">Injected_Unit_{skill.id?.slice(0, 4)}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-zinc-800 hover:text-blue-500 hover:bg-blue-500/5 transition-all rounded-xl h-10 w-10 shrink-0"
                          onClick={() => handleEdit(skill)}
                        >
                          <Wrench size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-zinc-800 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-xl h-10 w-10 shrink-0"
                          onClick={() => remove(skill.id!)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {categorySkills.length === 0 && (
                  <div className="py-16 flex flex-col items-center justify-center text-zinc-900 border border-dashed border-white/[0.02] rounded-[3rem] group-hover/category:border-white/5 transition-all">
                     <Cpu size={32} strokeWidth={0.5} className="text-zinc-950 mb-3" />
                     <p className="text-[10px] font-mono uppercase tracking-[0.4em] italic">Cluster awaiting data injection...</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


