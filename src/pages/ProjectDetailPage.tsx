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
  const [loading, setLoading] = useState(true);
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

      {/* Refined Hero Design */}
      <section className="relative min-h-[60vh] md:h-[75vh] w-full overflow-hidden flex flex-col justify-end pb-16 md:pb-24">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {project.coverImageUrl ? (
            <img 
              src={getDirectLink(project.coverImageUrl)} 
              alt={project.title} 
              className="w-full h-full object-cover filter brightness-[0.3] contrast-[1.1] saturate-[0.6]"
            />
          ) : (
            <div className="w-full h-full bg-zinc-950" />
          )}
          {/* Professional multi-layer gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
        
        <div className="absolute top-24 md:top-32 left-6 md:left-12 z-20">
          <button 
            onClick={() => navigate('/projects')}
            className="group flex items-center gap-3 px-6 py-2 bg-white/5 hover:bg-blue-600 backdrop-blur-xl rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.25em] text-white transition-all duration-300"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Back to archive</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 space-y-8">
           <div className="max-w-5xl space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-3"
              >
                  <div className="px-5 py-1.5 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                    {project.category || 'Portfolio Project'}
                  </div>
                  <div className="px-5 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 text-white/70 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {project.status || 'Active'}
                  </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[1.1] text-white max-w-4xl [text-wrap:balance]"
              >
                {project.title}
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-8 text-zinc-400 font-mono text-[9px] uppercase tracking-[0.3em] pt-4 border-t border-white/10 w-fit"
              >
                <div className="flex items-center gap-3">
                  <Calendar size={14} className="text-blue-500" />
                  <span className="text-white/60">{project.startDate} <span className="mx-2 opacity-30">—</span> {project.endDate || 'Ongoing'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={14} className="text-blue-500" />
                  <span className="text-white/60">{contributors.length} Contributors</span>
                </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Deep Dive */}
          <div className="lg:col-span-8 space-y-20">
            <section className="space-y-8">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-1 bg-blue-600 rounded-full" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Project Overview</h2>
               </div>
               
               <div className="space-y-8">
                 <RichTextRenderer 
                   content={project.shortDescription} 
                   className="text-2xl md:text-3xl font-bold tracking-tight leading-relaxed text-zinc-800 dark:text-zinc-100"
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
                <div className="col-span-1 p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-white/5 group hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-500">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 mb-6 border border-blue-600/20">
                    <Target size={20} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Core Objective</h3>
                  <RichTextRenderer content={project.objective} className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm font-medium" />
                </div>
              )}
              {project.problemSolved && (
                <div className="col-span-1 p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-white/5 group hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-500">
                  <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-600 mb-6 border border-purple-600/20">
                    <Cpu size={20} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Challenge Solved</h3>
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
          <aside className="lg:col-span-4 space-y-10">
            
            {/* Tech Matrix Card */}
            <div className="sticky top-32 space-y-8">
              <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-3xl space-y-10 shadow-sm">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                     <Cpu size={16} className="text-blue-600" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Technical Arsenal</h3>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {project.techStack?.map((tech: string) => (
                       <span key={tech} className="px-3 py-1.5 bg-zinc-100 dark:bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-200">
                         {tech}
                       </span>
                     ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <Target size={16} className="text-blue-600" />
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tactical Capacity</h3>
                   </div>
                   <div className="space-y-3">
                     <div className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                        <RichTextRenderer content={project.myRole || 'Project Architect'} className="leading-tight" />
                     </div>
                     <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-semibold tracking-wider uppercase bg-zinc-100 dark:bg-white/5 inline-block px-3 py-1 rounded-md">
                       {project.teamStructure || 'Independent Integration'}
                     </p>
                   </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-zinc-100 dark:border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Access Protocols</h3>
                  <div className="space-y-2">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-blue-600 group transition-all">
                         <div className="flex items-center gap-3 text-zinc-900 dark:text-white group-hover:dark:text-white">
                           <Github size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Source Protocol</span>
                         </div>
                         <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-blue-600 group transition-all">
                         <div className="flex items-center gap-3 text-zinc-900 dark:text-white group-hover:dark:text-white">
                           <ExternalLink size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Live Deployment</span>
                         </div>
                         <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100" />
                      </a>
                    )}
                    {project.researchPaperUrl && (
                      <a href={project.researchPaperUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-white/5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-blue-600 group transition-all">
                         <div className="flex items-center gap-3 text-zinc-900 dark:text-white group-hover:dark:text-white">
                           <FileText size={18} />
                           <span className="text-[10px] font-black uppercase tracking-widest">White Paper</span>
                         </div>
                         <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Personnel Array */}
              {contributors.length > 0 && (
                <div className="px-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <Users size={16} className="text-blue-600" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Personnel Array</h3>
                  </div>
                  <div className="space-y-4">
                    {contributors.map(c => {
                      const url = c.linkedInUrl ? (c.linkedInUrl.startsWith('http') ? c.linkedInUrl : `https://${c.linkedInUrl}`) : undefined;
                      const img = c.imageUrl || c.avatarUrl;
                      
                      return (
                        <a 
                          key={c.id}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-between group p-1.5 hover:bg-zinc-50 dark:hover:bg-white/5 rounded-2xl transition-colors ${url ? 'cursor-pointer' : 'pointer-events-none'}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 border border-black/5 dark:border-white/5 shrink-0">
                               {img ? (
                                 <img src={getDirectLink(img)} alt={c.name} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold text-[10px]">
                                    {c.name.charAt(0)}
                                 </div>
                               )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs uppercase tracking-tight text-zinc-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{c.name}</p>
                              <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.1em] mt-0.5 truncate">{c.role}</p>
                            </div>
                          </div>
                          {url && (
                            <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-white/5 group-hover:bg-blue-600 rounded-lg text-zinc-400 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 shrink-0">
                              <Share2 size={12} />
                            </div>
                          )}
                        </a>
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
