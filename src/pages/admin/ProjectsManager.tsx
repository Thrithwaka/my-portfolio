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
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-zinc-900/40 p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px]" />
             <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                      <Layers size={16} />
                   </div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 leading-none">Venture Portfolio</h3>
                </div>
                <h2 className="text-3xl font-black tracking-tight uppercase italic leading-none text-white">Innovation <span className="text-zinc-600">Ecosystem</span></h2>
                <p className="text-zinc-400 text-xs max-w-xl font-medium">Manage and calibrate high-impact projects.</p>
             </div>
             <Button 
               onClick={() => { setIsAdding(true); setEditingId(null); setCurrentProject(defaultProject); setContributors([]); setGallery([]); }} 
               className="relative z-10 h-12 px-8 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl transition-all shadow-xl active:scale-95 group uppercase tracking-widest text-[10px]"
             >
               <Plus size={16} className="mr-2" /> Add Project
             </Button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
            {projects.map((p) => (
              <motion.div 
                layout
                key={p.id} 
                className="group relative bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl flex flex-col"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  {p.coverImageUrl ? (
                    <img src={p.coverImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-zinc-800"><Box size={32} strokeWidth={0.5} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60" />
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight uppercase leading-none group-hover:text-blue-500 transition-colors">{p.title}</h3>
                    <p className="text-[10px] text-zinc-500 line-clamp-2 mt-2 leading-relaxed">{p.shortDescription}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {p.techStack?.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[8px] font-mono text-zinc-700 uppercase border border-white/5 px-1.5 py-0.5 rounded-sm">{tech}</span>
                    ))}
                  </div>

                  <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/50">{p.category}</span>
                     <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => handleEdit(p)} className="h-8 px-3 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-black transition-all">Edit</Button>
                        <button onClick={() => handleDelete(p.id)} className="text-zinc-700 hover:text-red-500 transition-colors p-1"><Trash2 size={14} /></button>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto text-white">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAdding(false)} className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                 <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tight uppercase italic">{editingId ? 'Edit Project' : 'New Project'}</h1>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-none">Slug: {currentProject.slug || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white group">Cancel</Button>
               <Button onClick={handleSave} disabled={isSaving} className="h-11 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 group">
                 {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                 <span className="uppercase tracking-widest text-[10px]">{isSaving ? 'Saving...' : 'Save Project'}</span>
               </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
               <div className="p-4 bg-zinc-900/40 border border-white/5 rounded-2xl space-y-1 sticky top-10">
                {[
                  { id: 'general', icon: Layout, label: 'General' },
                  { id: 'technical', icon: Cpu, label: 'Technical' },
                  { id: 'team', icon: Users, label: 'Team' },
                  { id: 'media', icon: ImageIcon, label: 'Media' },
                  { id: 'outcomes', icon: Target, label: 'Outcomes' },
                  { id: 'preview', icon: Eye, label: 'Preview' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all group ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={16} className={activeTab === tab.id ? 'text-white' : 'group-hover:text-blue-500'} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <div className="w-1 h-1 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </aside>

            <div className="lg:col-span-3">
               <div className="p-8 bg-zinc-900/20 border border-white/5 rounded-3xl min-h-[600px] shadow-xl relative overflow-hidden backdrop-blur-sm">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/[0.02] blur-[100px]" />
                  
                  {activeTab === 'general' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mx-2">Project Title</Label>
                            <Input value={currentProject.title} onChange={e => handleTitleChange(e.target.value)} className="bg-black border-white/10 h-14 text-lg font-bold rounded-xl px-6 focus:border-blue-500/50" placeholder="e.g. My Project" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mx-2">Slug</Label>
                            <Input value={currentProject.slug} onChange={e => setCurrentProject({...currentProject, slug: e.target.value})} className="bg-black border-white/10 h-14 text-sm font-mono rounded-xl px-6" placeholder="project-slug" />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <RichTextEditor 
                            label="Short Description"
                            value={currentProject.shortDescription || ''} 
                            onChange={val => setCurrentProject({...currentProject, shortDescription: val})} 
                          />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mx-2">Category</Label>
                            <select value={currentProject.category} onChange={e => setCurrentProject({...currentProject, category: e.target.value})} className="w-full bg-black border border-white/10 h-12 rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest appearance-none focus:outline-none focus:border-blue-500/50">
                               <option value="AI">AI / Neural Networks</option>
                               <option value="Blockchain">Web3 / Blockchain</option>
                               <option value="Security">Cyber Security</option>
                               <option value="Robotics">Robotics</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mx-2">State</Label>
                            <select value={currentProject.status} onChange={e => setCurrentProject({...currentProject, status: e.target.value as any})} className="w-full bg-black border border-white/10 h-12 rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest appearance-none focus:outline-none focus:border-blue-500/50">
                               <option value="Completed">Completed</option>
                               <option value="Ongoing">In Progress</option>
                               <option value="Experimental">Lab Experiment</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mx-2">Priority</Label>
                            <Input type="number" value={currentProject.priority} onChange={e => setCurrentProject({...currentProject, priority: parseInt(e.target.value)})} className="bg-black border-white/10 h-12 rounded-xl" />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <RichTextEditor 
                            label="Full Project Story"
                            value={currentProject.fullDescription || ''} 
                            onChange={val => setCurrentProject({...currentProject, fullDescription: val})} 
                            placeholder="Describe your journey..." 
                          />
                       </div>
                    </div>
                  )}

                  {activeTab === 'technical' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3 p-6 bg-black/40 rounded-2xl border border-white/5">
                             <div className="flex items-center gap-2 mb-1">
                                <Github size={16} className="text-zinc-500" />
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">GitHub URL</Label>
                             </div>
                             <Input value={currentProject.githubUrl} onChange={e => setCurrentProject({...currentProject, githubUrl: e.target.value})} className="bg-black border-white/10 h-10 rounded-lg text-sm" placeholder="https://github.com/..." />
                          </div>
                          <div className="space-y-3 p-6 bg-black/40 rounded-2xl border border-white/5">
                             <div className="flex items-center gap-2 mb-1">
                                <ExternalLink size={16} className="text-zinc-500" />
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Demo URL</Label>
                             </div>
                             <Input value={currentProject.demoUrl} onChange={e => setCurrentProject({...currentProject, demoUrl: e.target.value})} className="bg-black border-white/10 h-10 rounded-lg text-sm" placeholder="https://..." />
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <RichTextEditor 
                            label="Project Objective"
                            value={currentProject.objective || ''} 
                            onChange={val => setCurrentProject({...currentProject, objective: val})} 
                            placeholder="Goal of the project" 
                          />
                          <RichTextEditor 
                            label="Your Role"
                            value={currentProject.myRole || ''} 
                            onChange={val => setCurrentProject({...currentProject, myRole: val})} 
                            placeholder="What did you do?" 
                          />
                       </div>
                    </div>
                  )}

                  {activeTab === 'team' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500">
                        <header className="flex justify-between items-center">
                           <div className="space-y-0.5">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Contributors</h3>
                              <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Manage team members</p>
                           </div>
                           <Button onClick={() => setContributors([...contributors, { name: '', role: '', priority: contributors.length }])} size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[9px] font-bold uppercase h-8 px-4"><Plus size={14} className="mr-2" /> Add Partner</Button>
                        </header>
                        
                        <div className="space-y-3">
                           {contributors.map((c, idx) => (
                              <div key={idx} className="p-4 bg-black rounded-xl border border-white/5 flex gap-4 items-center">
                                 <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-600 text-[10px] font-bold grow-0 shrink-0">{idx + 1}</div>
                                 <Input 
                                   value={c.name} 
                                   onChange={e => {
                                      const newC = [...contributors];
                                      newC[idx].name = e.target.value;
                                      setContributors(newC);
                                   }} 
                                   placeholder="Name" 
                                   className="bg-zinc-950 border-white/10 h-10 rounded-lg text-sm" 
                                 />
                                 <Input 
                                   value={c.role} 
                                   onChange={e => {
                                      const newC = [...contributors];
                                      newC[idx].role = e.target.value;
                                      setContributors(newC);
                                   }} 
                                   placeholder="Role" 
                                   className="bg-zinc-950 border-white/10 h-10 rounded-lg text-sm" 
                                 />
                                 <button onClick={() => setContributors(contributors.filter((_, i) => i !== idx))} className="text-zinc-700 hover:text-red-500 transition-colors p-2"><Trash2 size={16}/></button>
                              </div>
                           ))}
                        </div>
                    </div>
                  )}

                  {activeTab === 'media' && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-2 duration-500">
                        <div className="space-y-4">
                           <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mx-2">Cover Image</Label>
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="p-6 bg-black rounded-2xl border border-white/10 space-y-6">
                                 <FileUploader 
                                   onUploadComplete={(url) => setCurrentProject({...currentProject, coverImageUrl: url})}
                                   folder={`projects/${currentProject.slug || 'temp'}`}
                                   label="Upload Cover Image"
                                 />
                                 <Input 
                                   value={currentProject.coverImageUrl} 
                                   onChange={e => setCurrentProject({...currentProject, coverImageUrl: e.target.value})} 
                                   placeholder="Image URL..."
                                   className="bg-zinc-900 border-white/10 h-10 text-[10px] font-mono rounded-lg px-4"
                                 />
                              </div>
                              <div className="aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden relative">
                                 {currentProject.coverImageUrl ? (
                                    <img src={currentProject.coverImageUrl} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 gap-2">
                                       <ImageIcon size={32} strokeWidth={0.5} />
                                       <span className="text-[8px] font-bold uppercase tracking-widest opacity-20">No Cover</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-white/5">
                            <header className="flex justify-between items-center px-2">
                               <div className="space-y-0.5">
                                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Gallery Assets</h3>
                                  <p className="text-[9px] text-zinc-700 uppercase tracking-widest font-bold">Additional screenshots/videos</p>
                               </div>
                               <Button onClick={() => setGallery([...gallery, { url: '', caption: '', priority: gallery.length }])} size="sm" className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-lg text-[9px] font-bold uppercase h-8 px-4 transition-all">Add Image</Button>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {gallery.map((g, idx) => (
                                  <div key={idx} className="p-6 bg-black rounded-2xl border border-white/10 space-y-4">
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
                                        placeholder="Caption" 
                                        className="bg-zinc-950 border-white/10 h-10 rounded-lg text-[10px]" 
                                     />
                                     <div className="flex justify-end pt-1">
                                        <button onClick={() => setGallery(gallery.filter((_, i) => i !== idx))} className="text-zinc-700 hover:text-red-500 transition-colors p-1"><Trash2 size={16}/></button>
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
