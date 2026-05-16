import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, Calendar, Users, 
  Layers, ChevronRight, CheckCircle2, History, Target,
  Cpu, Layout, FileText, Share2, MessageSquare, X, ArrowRight
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { collection, query, where, getDocs, limit, doc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getDirectLink } from '@/lib/utils';
import { ContributorAvatars } from '@/src/components/projects/ContributorAvatars';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';

export function ProjectDetailPage({ isAdmin }: { isAdmin?: boolean }) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [contributors, setContributors] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  // State for image zoom/preview
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      const q = query(collection(db, 'projects'), where('slug', '==', slug), limit(1));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setLoading(false);
        return;
      }

      const pDoc = snap.docs[0];
      const pData = { id: pDoc.id, ...pDoc.data() };
      setProject(pData);

      // Fetch Subcollections
      const contribSnap = await getDocs(query(collection(db, `projects/${pDoc.id}/contributors`), orderBy('priority', 'asc')));
      setContributors(contribSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const gallerySnap = await getDocs(query(collection(db, `projects/${pDoc.id}/gallery`), orderBy('priority', 'asc')));
      setGallery(gallerySnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const sectionsSnap = await getDocs(query(collection(db, `projects/${pDoc.id}/sections`), orderBy('priority', 'asc')));
      setSections(sectionsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center"
        >
          <Layers className="text-blue-600" />
        </motion.div>
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-400">Loading Innovation Details...</p>
      </div>
    </div>
  );

  if (!project) return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-8xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800">404</h1>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Project Not Found</h2>
        <p className="text-zinc-500 max-w-xs">The project you are looking for might have been moved or renamed in the research archive.</p>
      </div>
      <Link to="/projects" className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
        Back to Archive
      </Link>
    </div>
  );

  return (
    <main className="bg-white dark:bg-black min-h-screen text-zinc-900 dark:text-white pb-32">
      {/* Lightbox / Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
          >
            <motion.button 
              className="absolute top-8 right-8 text-white/50 hover:text-white p-4"
              whileHover={{ rotate: 90 }}
            >
              <X size={32} />
            </motion.button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage} 
              className="max-w-full max-h-full rounded-2xl md:rounded-[3rem] shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]" style={{ scaleX }} />

      {/* Experimental Hero Design */}
      <section className="relative h-[85vh] w-full overflow-hidden flex flex-col justify-end pb-32">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {project.coverImageUrl ? (
            <img 
              src={getDirectLink(project.coverImageUrl)} 
              alt={project.title} 
              className="w-full h-full object-cover filter brightness-50 contrast-125"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black dark:to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent opacity-60" />
        </motion.div>
        
        <div className="absolute top-32 left-6 md:left-12 z-20">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-3 px-6 py-3 bg-white/10 dark:bg-black/40 backdrop-blur-2xl rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white dark:hover:bg-white hover:text-black transition-all"
          >
            <ArrowLeft size={16} /> Reverse to Archive
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 space-y-8 text-white">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-wrap items-center gap-4"
           >
              <div className="px-5 py-2 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {project.category || 'System Protocol'}
              </div>
              <div className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {project.status || 'Active Node'}
              </div>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter uppercase leading-[0.75] text-white"
           >
             {project.title.split(' ').map((word: string, i: number) => (
               <span key={i} className={i % 2 === 1 ? 'text-transparent stroke-text-white' : ''}>{word} </span>
             ))}
           </motion.h1>

           <div className="flex flex-wrap items-center gap-10 text-white/40 font-mono text-xs uppercase tracking-[0.3em]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-white/20" />
                <Calendar size={14} className="text-blue-500" /> {project.startDate} — {project.endDate || 'Ongoing'}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-white/20" />
                <Users size={14} className="text-blue-500" /> {contributors.length} Collaborative Agents
              </div>
           </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: Deep Dive */}
          <div className="lg:col-span-8 space-y-24">
            <section className="space-y-10">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-1 bg-blue-600 rounded-full" />
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-500">Executive Summary</h2>
               </div>
               
               <div className="space-y-8">
                 <RichTextRenderer 
                   content={project.shortDescription} 
                   className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] text-zinc-900 dark:text-white"
                 />
                 <RichTextRenderer 
                   content={project.fullDescription} 
                   proseSize="xl"
                   className="opacity-70 dark:opacity-60 leading-relaxed font-medium"
                 />
               </div>
            </section>

            {/* Strategic Outcomes Bento */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.objective && (
                <div className="col-span-1 p-10 bg-zinc-50 dark:bg-zinc-900/40 rounded-[3rem] border border-zinc-100 dark:border-white/5 group hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-500">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 mb-8 border border-blue-600/20 group-hover:scale-110 transition-transform">
                    <Target size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-zinc-900 dark:text-white">Core Objective</h3>
                  <RichTextRenderer content={project.objective} className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm font-medium" />
                </div>
              )}
              {project.problemSolved && (
                <div className="col-span-1 p-10 bg-zinc-50 dark:bg-zinc-900/40 rounded-[3rem] border border-zinc-100 dark:border-white/5 group hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-500">
                  <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 mb-8 border border-purple-600/20 group-hover:scale-110 transition-transform">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-zinc-900 dark:text-white">Paradigm Shift</h3>
                  <RichTextRenderer content={project.problemSolved} className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm font-medium" />
                </div>
              )}
            </section>

            {/* Media Canvas */}
            {gallery.length > 0 && (
              <section className="space-y-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-blue-600 rounded-full" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-500">Visual Documentation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map((item, i) => (
                    <motion.div 
                      key={item.id}
                      className={`relative rounded-[3rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 cursor-zoom-in group ${i === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-square'}`}
                      onClick={() => setSelectedImage(getDirectLink(item.url))}
                    >
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center text-white">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black scale-90 group-hover:scale-100 transition-transform">
                           <Layout size={24} />
                         </div>
                      </div>
                      {item.type === 'video' || item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video 
                          src={getDirectLink(item.url)} 
                          className="w-full h-full object-cover" 
                          autoPlay muted loop playsInline
                        />
                      ) : (
                        <img src={getDirectLink(item.url)} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Structured Evidence Section */}
            <section className="bg-zinc-950 rounded-[4rem] p-12 md:p-16 space-y-16 text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                  {project.challenges && (
                    <div className="space-y-6 text-white">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">The Resistance</h4>
                      <RichTextRenderer content={project.challenges} className="text-zinc-400 leading-relaxed text-sm" />
                    </div>
                  )}
                  {project.achievements && (
                    <div className="space-y-6 text-white">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Major Milestones</h4>
                      <RichTextRenderer content={project.achievements} className="text-zinc-400 leading-relaxed text-sm" />
                    </div>
                  )}
                  {project.learningOutcomes && (
                    <div className="col-span-1 md:col-span-2 space-y-6 text-white">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Knowledge Extracted</h4>
                      <RichTextRenderer content={project.learningOutcomes} className="text-zinc-400 leading-relaxed text-sm" />
                    </div>
                  )}
               </div>
            </section>
          </div>

          {/* Right Column: Sidebar Tech/Control Panel */}
          <aside className="lg:col-span-4 space-y-12">
            
            {/* Tech Matrix Card */}
            <div className="sticky top-32 space-y-10">
              <div className="p-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[3rem] space-y-12 shadow-sm">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                     <Cpu size={16} className="text-blue-600" />
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Technical Arsenal</h3>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {project.techStack?.map((tech: string) => (
                       <span key={tech} className="px-4 py-2 bg-zinc-100 dark:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-200">
                         {tech}
                       </span>
                     ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                     <Target size={16} className="text-blue-600" />
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Tactical Capacity</h3>
                   </div>
                   <div className="space-y-2">
                     <p className="text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">{project.myRole || 'Architect'}</p>
                     <p className="text-zinc-500 dark:text-zinc-500 text-xs font-medium tracking-tight bg-zinc-100 dark:bg-white/5 inline-block px-3 py-1 rounded-lg">
                       {project.teamStructure || 'Lone Node Integration'}
                     </p>
                   </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Access Protocols</h3>
                  <div className="space-y-3">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-[1.5rem] hover:bg-zinc-100 dark:hover:bg-blue-600 dark:hover:text-white transition-all group">
                         <div className="flex items-center gap-4 text-zinc-900 dark:text-white group-hover:text-white">
                           <Github size={20} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Git Repository</span>
                         </div>
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform opacity-40 group-hover:opacity-100 dark:text-white" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-[1.5rem] hover:bg-zinc-100 dark:hover:bg-blue-600 dark:hover:text-white transition-all group">
                         <div className="flex items-center gap-4 text-zinc-900 dark:text-white group-hover:text-white">
                           <ExternalLink size={20} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Interactive Node</span>
                         </div>
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform opacity-40 group-hover:opacity-100 dark:text-white" />
                      </a>
                    )}
                    {project.researchPaperUrl && (
                      <a href={project.researchPaperUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-[1.5rem] hover:bg-zinc-100 dark:hover:bg-blue-600 dark:hover:text-white transition-all group">
                         <div className="flex items-center gap-4 text-zinc-900 dark:text-white group-hover:text-white">
                           <FileText size={20} />
                           <span className="text-[10px] font-black uppercase tracking-widest">White Paper</span>
                         </div>
                         <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform opacity-40 group-hover:opacity-100 dark:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Personnel Array */}
              {contributors.length > 0 && (
                <div className="p-8 space-y-8">
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-blue-600" />
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Personnel Array</h3>
                  </div>
                  <div className="space-y-4">
                    {contributors.map(c => {
                      const url = c.linkedInUrl ? (c.linkedInUrl.startsWith('http') ? c.linkedInUrl : `https://${c.linkedInUrl}`) : undefined;
                      const img = c.imageUrl || c.avatarUrl;
                      
                      return (
                        <div key={c.id} className="flex items-center justify-between group p-2 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-2xl transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-black/5 dark:border-white/5 shrink-0 transition-transform group-hover:scale-95">
                               {img ? (
                                 <img src={getDirectLink(img)} alt={c.name} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-zinc-400 font-black text-xs">
                                    {c.name.charAt(0)}
                                 </div>
                               )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-xs uppercase tracking-tight text-zinc-900 dark:text-white truncate">{c.name}</p>
                              <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.1em] mt-1 truncate">{c.role}</p>
                            </div>
                          </div>
                          {url && (
                            <a href={url} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-white/5 hover:bg-blue-600 rounded-xl text-zinc-400 hover:text-white transition-all scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                              <Share2 size={14} />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
