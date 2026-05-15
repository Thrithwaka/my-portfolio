import React, { useState, useEffect } from 'react';
import { 
  Loader2, Plus, Trash2, Save, ExternalLink, Box, Github, 
  Video, Code, BarChart3, Users, Image as ImageIcon, 
  Layers, Hammer, Target, Cpu, FileText, Layout, X,
  ChevronRight, ArrowLeft, Eye
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, setDoc, deleteDoc, getDocs, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/src/components/admin/RichTextEditor';
import { FileUploader } from '@/src/components/admin/FileUploader';
import { ProjectCard } from '@/src/components/projects/ProjectCard';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  tags: string[];
  status: 'Completed' | 'Ongoing' | 'Experimental';
  startDate: string;
  endDate: string;
  coverImageUrl: string;
  techStack: string[];
  objective: string;
  problemSolved: string;
  myRole: string;
  teamStructure: string;
  githubUrl: string;
  demoUrl: string;
  researchPaperUrl: string;
  presentationUrl: string;
  isFeatured: boolean;
  priority: number;
  challenges: string;
  achievements: string;
  learningOutcomes: string;
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultProject: Partial<Project> = {
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Innovation',
    status: 'Completed',
    tags: [],
    techStack: [],
    isFeatured: false,
    priority: 0
  };

  const [currentProject, setCurrentProject] = useState<Partial<Project>>(defaultProject);
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'media' | 'technical' | 'outcomes' | 'preview'>('general');

  const [contributors, setContributors] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('priority', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as Project)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleEdit = async (project: Project) => {
    setCurrentProject(project);
    setEditingId(project.id);
    setIsAdding(true);
    
    const cSnap = await getDocs(query(collection(db, `projects/${project.id}/contributors`), orderBy('priority', 'asc')));
    setContributors(cSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    
    const gSnap = await getDocs(query(collection(db, `projects/${project.id}/gallery`), orderBy('priority', 'asc')));
    setGallery(gSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleSave = async () => {
    if (!currentProject.title || !currentProject.slug) return;
    setIsSaving(true);
    
    const data = {
      ...currentProject,
      updatedAt: serverTimestamp(),
      priority: Number(currentProject.priority || 0),
    };

    try {
      let projectId = editingId;
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), data);
      } else {
        const docRef = await addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp() });
        projectId = docRef.id;
        setEditingId(projectId);
      }
      
      if (projectId) {
        // Save Contributors
        const cSnap = await getDocs(collection(db, `projects/${projectId}/contributors`));
        for (const d of cSnap.docs) await deleteDoc(d.ref);
        for (const c of contributors) {
           const { id, ...cData } = c;
           await addDoc(collection(db, `projects/${projectId}/contributors`), cData);
        }
        
        // Save Gallery
        const gSnap = await getDocs(collection(db, `projects/${projectId}/gallery`));
        for (const d of gSnap.docs) await deleteDoc(d.ref);
        for (const g of gallery) {
           const { id, ...gData } = g;
           await addDoc(collection(db, `projects/${projectId}/gallery`), gData);
        }
      }

      setIsAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setCurrentProject({ ...currentProject, title: val, slug: editingId ? currentProject.slug : slug });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (confirm('Permanently decommission this project from the ecosystem?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-16 max-w-7xl pb-32">
      {!isAdding ? (
        <>
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-zinc-900/10 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                      <Layers size={20} />
                   </div>
                   <div className="flex flex-col">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 leading-none">Venture Portfolio</h3>
                      <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Status: {projects.length} Active Node(s)</p>
                   </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-white">Innovation <span className="text-zinc-800">Ecosystem</span></h2>
                <p className="text-zinc-500 text-sm max-w-xl font-medium leading-relaxed">Orchestrate and calibrate the high-impact projects that define your professional legacy.</p>
             </div>
             <Button 
               onClick={() => { setIsAdding(true); setEditingId(null); setCurrentProject(defaultProject); setContributors([]); setGallery([]); }} 
               className="relative z-10 h-16 px-12 bg-white text-black hover:bg-zinc-200 font-black rounded-3xl transition-all shadow-2xl hover:shadow-white/20 active:scale-95 group uppercase tracking-[0.2em] text-[11px]"
             >
               <Plus size={18} className="mr-3" /> Initiate New Venture
             </Button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
            {projects.map((p) => (
              <motion.div 
                layout
                key={p.id} 
                className="group relative bg-[#0D0D0D] border border-white/5 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col"
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  {p.coverImageUrl ? (
                    <img src={p.coverImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                  ) : (
                    <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-900"><Box size={48} strokeWidth={0.5} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 left-6 flex gap-2">
                     <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-400">
                        {p.category}
                     </span>
                  </div>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight uppercase leading-none group-hover:text-blue-500 transition-colors">{p.title}</h3>
                    <p className="text-[11px] text-zinc-600 line-clamp-2 font-medium leading-relaxed">{p.shortDescription}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {p.techStack?.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[8px] font-mono text-zinc-800 uppercase border border-white/5 px-2 py-1 rounded-sm">{tech}</span>
                    ))}
                  </div>

                  <div className="pt-6 mt-auto border-t border-white/5 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-lg bg-zinc-900 border border-black" />)}
                     </div>
                     <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => handleEdit(p)} className="h-10 px-4 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-all">Manage</Button>
                        <button onClick={() => handleDelete(p.id)} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto text-white">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-900/10 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsAdding(false)} className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all text-white">
                 <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic">{editingId ? 'Recalibrate Venture' : 'Initiate Prototype'}</h1>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Reference: {currentProject.slug || 'NULL_BUFFER'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => setIsAdding(false)} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors px-6">Discard Stack</button>
               <Button onClick={handleSave} disabled={isSaving} className="h-14 px-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
                 {isSaving ? <Loader2 className="animate-spin" /> : <Save size={18} className="mr-3" />}
                 <span className="uppercase tracking-[0.2em] text-[10px]">{isSaving ? 'Synchronizing...' : 'Commit Venture'}</span>
               </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1">
               <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-[3rem] space-y-3 sticky top-10">
                {[
                  { id: 'general', icon: Layout, label: 'Identity' },
                  { id: 'technical', icon: Cpu, label: 'Technical' },
                  { id: 'team', icon: Users, label: 'Consortium' },
                  { id: 'media', icon: ImageIcon, label: 'Assets' },
                  { id: 'outcomes', icon: Target, label: 'Outcomes' },
                  { id: 'preview', icon: Eye, label: 'Simulation' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-500 group ${activeTab === tab.id ? 'bg-white text-black' : 'text-zinc-600 hover:bg-white/5 hover:text-zinc-300'}`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon size={18} className={activeTab === tab.id ? 'text-black' : 'group-hover:text-blue-500'} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </aside>

            <div className="lg:col-span-3">
               <div className="p-12 bg-zinc-900/10 border border-white/5 rounded-[4rem] min-h-[700px] shadow-2xl relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/[0.02] blur-[100px]" />
                  
                  {activeTab === 'general' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-4 italic">Venture Designation</Label>
                            <Input value={currentProject.title} onChange={e => handleTitleChange(e.target.value)} className="bg-black border-white/5 h-20 text-2xl font-black rounded-3xl px-8 focus:border-blue-500/20" placeholder="e.g. PROJECT X" />
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-4 italic">Routing Proxy (Slug)</Label>
                            <Input value={currentProject.slug} onChange={e => setCurrentProject({...currentProject, slug: e.target.value})} className="bg-black border-white/5 h-20 text-lg font-mono rounded-3xl px-8" placeholder="nexus-v1" />
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <RichTextEditor 
                            label="Strategic Abstract (Short)"
                            value={currentProject.shortDescription || ''} 
                            onChange={val => setCurrentProject({...currentProject, shortDescription: val})} 
                          />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-4 italic">Branch</Label>
                            <select value={currentProject.category} onChange={e => setCurrentProject({...currentProject, category: e.target.value})} className="w-full bg-black border border-white/5 h-16 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest appearance-none focus:outline-none">
                               <option value="AI">AI / Neural Networks</option>
                               <option value="Blockchain">Web3 / Blockchain</option>
                               <option value="Security">Cyber Security</option>
                               <option value="Robotics">Robotics</option>
                            </select>
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-4 italic">State</Label>
                            <select value={currentProject.status} onChange={e => setCurrentProject({...currentProject, status: e.target.value as any})} className="w-full bg-black border border-white/5 h-16 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest appearance-none focus:outline-none">
                               <option value="Completed">Completed</option>
                               <option value="Ongoing">In Progress</option>
                               <option value="Experimental">Lab Experiment</option>
                            </select>
                          </div>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-4 italic">Priority Node</Label>
                            <Input type="number" value={currentProject.priority} onChange={e => setCurrentProject({...currentProject, priority: parseInt(e.target.value)})} className="bg-black border-white/5 h-16 rounded-2xl" />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <RichTextEditor 
                            label="Executive Narrative (Deep Content)"
                            value={currentProject.fullDescription || ''} 
                            onChange={val => setCurrentProject({...currentProject, fullDescription: val})} 
                            placeholder="The comprehensive story..." 
                          />
                       </div>
                    </div>
                  )}

                  {activeTab === 'technical' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="space-y-4 p-8 bg-black/40 rounded-[2.5rem] border border-white/5">
                             <div className="flex items-center gap-3 mb-2">
                                <Github size={18} className="text-zinc-600" />
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Source Integration</Label>
                             </div>
                             <Input value={currentProject.githubUrl} onChange={e => setCurrentProject({...currentProject, githubUrl: e.target.value})} className="bg-black border-white/5 h-12 rounded-xl" placeholder="https://github.com/..." />
                          </div>
                          <div className="space-y-4 p-8 bg-black/40 rounded-[2.5rem] border border-white/5">
                             <div className="flex items-center gap-3 mb-2">
                                <ExternalLink size={18} className="text-zinc-600" />
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Live Deployment</Label>
                             </div>
                             <Input value={currentProject.demoUrl} onChange={e => setCurrentProject({...currentProject, demoUrl: e.target.value})} className="bg-black border-white/5 h-12 rounded-xl" placeholder="https://demo.com/..." />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <RichTextEditor 
                            label="The Mission Core (Objective)"
                            value={currentProject.objective || ''} 
                            onChange={val => setCurrentProject({...currentProject, objective: val})} 
                            placeholder="What goal was this engineered to solve?" 
                          />
                          <RichTextEditor 
                            label="Individual Agency (Role)"
                            value={currentProject.myRole || ''} 
                            onChange={val => setCurrentProject({...currentProject, myRole: val})} 
                            placeholder="Define your specific impact..." 
                          />
                       </div>
                    </div>
                  )}

                  {activeTab === 'team' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                        <header className="flex justify-between items-center">
                           <div className="space-y-1 px-4 text-white">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Collaborative Consortium</h3>
                              <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold font-mono">Index contributors and strategic partners</p>
                           </div>
                           <Button onClick={() => setContributors([...contributors, { name: '', role: '', priority: contributors.length }])} size="sm" className="bg-white/5 hover:bg-white hover:text-black rounded-xl text-[9px] font-black uppercase"><Plus size={14} className="mr-2" /> Add Partner</Button>
                        </header>
                        
                        <div className="space-y-4">
                           {contributors.map((c, idx) => (
                              <div key={idx} className="p-6 bg-black rounded-2xl border border-white/5 flex gap-6 items-center">
                                 <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-zinc-800 shrink-0">{idx + 1}</div>
                                 <Input 
                                   value={c.name} 
                                   onChange={e => {
                                      const newC = [...contributors];
                                      newC[idx].name = e.target.value;
                                      setContributors(newC);
                                   }} 
                                   placeholder="Full Name" 
                                   className="bg-zinc-950 border-white/5 h-12 rounded-xl text-sm" 
                                 />
                                 <Input 
                                   value={c.role} 
                                   onChange={e => {
                                      const newC = [...contributors];
                                      newC[idx].role = e.target.value;
                                      setContributors(newC);
                                   }} 
                                   placeholder="Role / Title" 
                                   className="bg-zinc-950 border-white/5 h-12 rounded-xl text-sm" 
                                 />
                                 <button onClick={() => setContributors(contributors.filter((_, i) => i !== idx))} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                              </div>
                           ))}
                        </div>
                    </div>
                  )}

                  {activeTab === 'media' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="space-y-6">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-4 italic">Primary Visual Signal (Cover)</Label>
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                              <div className="p-8 bg-black rounded-[3rem] border border-white/5 space-y-8">
                                 <FileUploader 
                                   onUploadComplete={(url) => setCurrentProject({...currentProject, coverImageUrl: url})}
                                   folder={`projects/${currentProject.slug || 'temp'}`}
                                   label="Inject Cover Asset"
                                 />
                                 <Input 
                                   value={currentProject.coverImageUrl} 
                                   onChange={e => setCurrentProject({...currentProject, coverImageUrl: e.target.value})} 
                                   placeholder="Direct URL Overlay..."
                                   className="bg-zinc-900 border-white/5 h-12 text-[10px] font-mono rounded-xl px-4"
                                 />
                              </div>
                              <div className="aspect-video bg-black rounded-[3rem] border border-white/5 overflow-hidden group/prev relative">
                                 {currentProject.coverImageUrl ? (
                                    <img src={currentProject.coverImageUrl} className="w-full h-full object-cover group-hover/prev:scale-110 transition-transform duration-[3s]" />
                                 ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-900 gap-4">
                                       <ImageIcon size={48} strokeWidth={0.5} />
                                       <span className="text-[9px] font-black uppercase tracking-widest italic opacity-20">No active signal detected</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8 pt-12 border-t border-white/5">
                            <header className="flex justify-between items-center px-4">
                               <div className="space-y-1">
                                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Asset Gallery</h3>
                                  <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-bold">Secondary Visual Data</p>
                               </div>
                               <Button onClick={() => setGallery([...gallery, { url: '', caption: '', priority: gallery.length }])} size="sm" className="bg-white/5 hover:bg-white hover:text-black rounded-xl text-[9px] font-black uppercase"><Plus size={14} className="mr-2" /> Add Asset</Button>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               {gallery.map((g, idx) => (
                                  <div key={idx} className="p-8 bg-black rounded-[2.5rem] border border-white/5 space-y-6">
                                     <FileUploader 
                                        onUploadComplete={(url) => {
                                           const newG = [...gallery];
                                           newG[idx].url = url;
                                           setGallery(newG);
                                        }}
                                        folder={`projects/${currentProject.slug || 'temp'}/gallery`}
                                        label={`Asset #${idx + 1}`}
                                     />
                                     <Input 
                                        value={g.caption} 
                                        onChange={e => {
                                           const newG = [...gallery];
                                           newG[idx].caption = e.target.value;
                                           setGallery(newG);
                                        }} 
                                        placeholder="Caption / Metadata" 
                                        className="bg-zinc-950 border-white/5 h-12 rounded-xl text-[10px]" 
                                     />
                                     <div className="flex justify-between items-center pt-2">
                                        <div className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest leading-none">Status: Ready</div>
                                        <button onClick={() => setGallery(gallery.filter((_, i) => i !== idx))} className="text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                     </div>
                                  </div>
                               ))}
                            </div>
                        </div>
                    </div>
                  )}

                   {activeTab === 'outcomes' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                       <RichTextEditor 
                         label="Core Achievements"
                         value={currentProject.achievements || ''} 
                         onChange={val => setCurrentProject({...currentProject, achievements: val})} 
                         placeholder="List the paradigm-shifting results..." 
                       />
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <RichTextEditor 
                            label="Neural Friction (Challenges)"
                            value={currentProject.challenges || ''} 
                            onChange={val => setCurrentProject({...currentProject, challenges: val})} 
                            placeholder="What blocked the progress?" 
                          />
                          <RichTextEditor 
                            label="System Growth (Learnings)"
                            value={currentProject.learningOutcomes || ''} 
                            onChange={val => setCurrentProject({...currentProject, learningOutcomes: val})} 
                            placeholder="How did this expand your logic?" 
                          />
                       </div>
                    </div>
                  )}

                  {activeTab === 'preview' && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                       <div className="flex items-center justify-between px-4">
                          <div className="space-y-1">
                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Deep Space Simulation</h3>
                             <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Real-time projection of the project card</p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-800">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                             LIVE_RENDER_ACTIVE
                          </div>
                       </div>

                       <div className="bg-black/40 p-12 rounded-[3.5rem] border border-white/5 flex items-center justify-center min-h-[500px]">
                          <div className="w-full max-w-xl">
                             <ProjectCard project={currentProject as any} />
                          </div>
                       </div>

                       <div className="p-8 border border-blue-500/10 rounded-3xl bg-blue-500/[0.02] flex items-start gap-6">
                          <Eye className="text-blue-500 shrink-0 mt-1" size={20} />
                          <div className="space-y-1">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Architectural Note</h4>
                             <p className="text-[11px] text-zinc-600 leading-relaxed font-medium">This simulation renders the project exactly as it will appear in the main ecosystem gallery. Calibration here ensures visual dominance.</p>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
