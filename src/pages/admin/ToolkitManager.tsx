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
    <div className="space-y-8 max-w-7xl pb-32">
       {/* CMS Header Section */}
       <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-900/40 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[100px]" />
          <div className="relative z-10 space-y-2">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                   <Hammer size={16} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 leading-none">Operational Stack</h3>
             </div>
             <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none text-white">Toolkit <span className="text-zinc-600">Mastery</span></h2>
             <p className="text-zinc-400 text-xs max-w-xl font-medium">Manage your technical and strategic capability matrix.</p>
          </div>
          <div className="relative z-10 flex flex-col items-end gap-1 text-right">
             <div className="text-4xl font-black italic tracking-tighter leading-none text-white">{skills.length}</div>
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Active Units</span>
          </div>
       </header>

      {/* Injection Control Unit */}
      <div className="relative">
         <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-3xl backdrop-blur-md relative overflow-hidden group/inject">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 blur-[80px]" />
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-3">
                  <div className="w-1 h-3 bg-blue-500 rounded-full" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{editingId ? 'Modify Capability' : 'Inject New Capability'}</h3>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                 <div className="lg:col-span-5 space-y-2">
                   <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Skill Name</Label>
                   <Input 
                     value={newSkill.name} 
                     onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                     className="bg-black border-white/10 h-12 rounded-xl px-4 focus:border-blue-500/50 transition-all font-bold text-white placeholder:text-zinc-800"
                     placeholder="e.g. NEURAL ARCHITECTURE"
                   />
                 </div>
                 
                 <div className="lg:col-span-3 space-y-2">
                   <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Category Cluster</Label>
                   <select 
                     value={newSkill.category} 
                     onChange={e => setNewSkill({...newSkill, category: e.target.value})}
                     className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-[10px] uppercase font-bold tracking-widest text-zinc-400 focus:text-blue-500 focus:outline-none appearance-none transition-all cursor-pointer"
                   >
                     <option value="technical_systems">Technical Mastery</option>
                     <option value="strategic_impact">Soft Skills & Leadership</option>
                     <option value="innovation_lab">Innovation Lab</option>
                     <option value="creative_toolkit">Creative Toolkit</option>
                   </select>
                 </div>

                 <div className="lg:col-span-4 space-y-2">
                   <Label className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold px-2">Visual Icon</Label>
                   <div className="flex gap-3">
                     <div className="flex-1">
                       <FileUploader 
                         onUploadComplete={(url) => setNewSkill({...newSkill, iconUrl: url})}
                         folder="skills"
                         label="Upload Icon"
                       />
                     </div>
                     {newSkill.iconUrl && (
                        <div className="w-12 h-12 bg-black rounded-xl border border-white/10 flex items-center justify-center p-2 relative group/icon shrink-0">
                           <img src={newSkill.iconUrl} className="w-full h-full object-contain filter grayscale group-hover/icon:grayscale-0 transition-all" />
                           <button onClick={() => setNewSkill({...newSkill, iconUrl: ''})} className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-[8px] font-bold">
                              <X size={8} />
                           </button>
                        </div>
                     )}
                   </div>
                 </div>
               </div>
               
               <div className="flex justify-end gap-3">
                  {editingId && (
                    <Button 
                      variant="ghost"
                      onClick={() => { setEditingId(null); setNewSkill({ name: '', category: 'technical_systems' }); }}
                      className="h-10 px-6 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-[10px]"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    onClick={handleAddOrUpdate} 
                    disabled={isInjecting || !newSkill.name}
                    className="h-10 px-10 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest text-[10px] rounded-xl active:scale-95 transition-all shadow-lg"
                  >
                    {isInjecting ? <Loader2 className="animate-spin" size={16} /> : (editingId ? 'Update Skill' : 'Add Skill')}
                  </Button>
               </div>
            </div>
         </div>
      </div>

      {/* Skills Matrix Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, idx) => {
          const categorySkills = skills.filter(s => s.category === cat);
          const iconMap: Record<string, React.ReactNode> = {
            technical_systems: <Cpu size={18} />,
            strategic_impact: <Zap size={18} />,
            innovation_lab: <Sparkles size={18} />,
            creative_toolkit: <Box size={18} />
          };

          return (
            <div key={cat} className="space-y-6 group/category">
              <header className="flex items-center justify-between border-b border-white/5 pb-4">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border
                      ${cat === 'technical_systems' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                        cat === 'strategic_impact' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        cat === 'innovation_lab' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                        'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}`}
                    >
                       {iconMap[cat]}
                    </div>
                    <div>
                       <h3 className="text-sm font-bold uppercase tracking-widest text-white">{cat === 'technical_systems' ? 'Technical Mastery' : cat === 'strategic_impact' ? 'Soft Skills & Leadership' : cat.replace('_', ' ')}</h3>
                       <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-0.5">Sector {idx + 1}</p>
                    </div>
                 </div>
                 <span className="text-xl font-black italic text-zinc-800 group-hover/category:text-zinc-600 transition-colors">{categorySkills.length}</span>
              </header>

              <div className="grid grid-cols-1 gap-2">
                <AnimatePresence mode="popLayout">
                  {categorySkills.map(skill => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={skill.id} 
                      className="group/item flex items-center justify-between p-4 bg-zinc-900/10 border border-white/5 rounded-2xl hover:bg-zinc-900/40 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-black border border-white/5 flex items-center justify-center p-2 shrink-0">
                            {skill.iconUrl ? (
                               <img src={skill.iconUrl} className="w-full h-full object-contain filter grayscale group-hover/item:grayscale-0 transition-all" />
                            ) : (
                               <Box size={14} className="text-zinc-800" />
                            )}
                         </div>
                         <span className="text-[11px] font-bold uppercase text-zinc-400 group-hover/item:text-white transition-colors">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-zinc-700 hover:text-blue-500 h-8 w-8"
                          onClick={() => handleEdit(skill)}
                        >
                          <Wrench size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-zinc-700 hover:text-red-500 h-8 w-8"
                          onClick={() => remove(skill.id!)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {categorySkills.length === 0 && (
                  <div className="py-8 flex flex-col items-center justify-center text-zinc-900 border border-dashed border-white/5 rounded-2xl">
                     <p className="text-[9px] font-mono uppercase tracking-widest italic opacity-50">Empty Sector</p>
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


