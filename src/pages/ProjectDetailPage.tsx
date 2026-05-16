import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeft, Github, ExternalLink, Calendar, Users, 
  Layers, ChevronRight, CheckCircle2, History, Target,
  Cpu, Layout, FileText, Share2, MessageSquare
} from 'lucide-react';
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
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]" style={{ scaleX }} />

      {/* Hero Visual Area */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        {project.coverImageUrl ? (
          <img 
            src={getDirectLink(project.coverImageUrl)} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-transparent to-transparent" />
        
        <div className="absolute top-32 left-6 md:left-12">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest hover:pl-6 transition-all"
          >
            <ArrowLeft size={14} /> Back to Archive
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-32 relative z-10">
        <header className="space-y-12">
          {/* Headline and Badges */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                {project.category || 'Innovation'}
              </span>
              {project.status && (
                <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {project.status}
                </span>
              )}
              {project.isFeatured && (
                <span className="px-4 py-1.5 bg-yellow-400 text-black rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Layers size={12} /> Featured Project
                </span>
              )}
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] max-w-5xl">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-zinc-400 font-mono text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar size={14} /> {project.startDate} — {project.endDate || 'Present'}
              </div>
              <span className="opacity-20">|</span>
              <div className="flex items-center gap-2">
                <Users size={14} /> {contributors.length} Contributors
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            {/* Left Rail: The Story */}
            <div className="lg:col-span-2 space-y-16">
              <section className="space-y-6">
                <h2 className="text-sm font-mono font-bold uppercase tracking-[0.4em] text-blue-600">The Narrative</h2>
                <RichTextRenderer 
                  content={project.shortDescription} 
                  className="text-2xl md:text-3xl font-medium leading-relaxed text-zinc-700 dark:text-zinc-300"
                />
                <RichTextRenderer 
                  content={project.fullDescription} 
                  proseSize="xl"
                  className="mt-8"
                />
              </section>

              {/* Advanced Grid Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.objective && (
                  <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-white/5 space-y-4">
                    <Target className="text-blue-600" size={32} />
                    <h3 className="text-xl font-bold uppercase tracking-tight">The Objective</h3>
                    <RichTextRenderer content={project.objective} className="text-zinc-500 dark:text-zinc-400 leading-relaxed" />
                  </div>
                )}
                {project.problemSolved && (
                  <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100 dark:border-white/5 space-y-4">
                    <Cpu className="text-purple-600" size={32} />
                    <h3 className="text-xl font-bold uppercase tracking-tight">Challenge Solved</h3>
                    <RichTextRenderer content={project.problemSolved} className="text-zinc-500 dark:text-zinc-400 leading-relaxed" />
                  </div>
                )}
              </div>

              {/* Gallery Section */}
              {gallery.length > 0 && (
                <section className="space-y-8">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-[0.4em] text-blue-600">Visual Evidence</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gallery.map((item, i) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="rounded-[2.5rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-video group"
                      >
                        {item.type === 'video' || item.url.match(/\.(mp4|webm|ogg)$/i) || (item.url.includes('res.cloudinary.com') && item.url.includes('/video/')) ? (
                          <video 
                            src={getDirectLink(item.url)} 
                            className="w-full h-full object-cover" 
                            controls 
                            playsInline
                          />
                        ) : (
                          <img src={getDirectLink(item.url)} alt={item.caption || 'Gallery Image'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        )}
                        {item.caption && (
                          <div className="p-6 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-white/5">
                            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{item.caption}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Custom Dynamic Sections */}
              {sections.map(section => (
                <section key={section.id} className="space-y-6">
                  <h2 className="text-sm font-mono font-bold uppercase tracking-[0.4em] text-blue-600">{section.title}</h2>
                  <RichTextRenderer content={section.content} proseSize="xl" />
                </section>
              ))}

              {/* Outcomes Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {project.challenges && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Key Challenges</h4>
                    <RichTextRenderer content={project.challenges} className="text-sm leading-relaxed" />
                  </div>
                )}
                {project.achievements && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Achievements</h4>
                    <RichTextRenderer content={project.achievements} className="text-sm leading-relaxed" />
                  </div>
                )}
                {project.learningOutcomes && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Learning Outcomes</h4>
                    <RichTextRenderer content={project.learningOutcomes} className="text-sm leading-relaxed" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Rail: Meta Info */}
            <aside className="space-y-12">
              <div className="p-10 bg-zinc-950 text-white rounded-[3rem] space-y-10 shadow-2xl shadow-blue-600/10">
                <div className="space-y-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-blue-500">Tech Ecosystem</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string) => (
                      <span key={tech} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-medium border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-blue-500">Project Role</h3>
                  <div className="space-y-2">
                    <p className="text-xl font-bold">{project.myRole || 'Lead Architect'}</p>
                    <p className="text-zinc-500 text-sm">{project.teamStructure || 'Multidisciplinary Collaboration'}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-blue-500">Resource Links</h3>
                  <div className="space-y-3">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all group">
                        <div className="flex items-center gap-3">
                          <Github size={18} />
                          <span className="text-sm font-bold uppercase tracking-widest">Repository</span>
                        </div>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all group">
                        <div className="flex items-center gap-3">
                          <ExternalLink size={18} />
                          <span className="text-sm font-bold uppercase tracking-widest">Live Preview</span>
                        </div>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                    {project.researchPaperUrl && (
                      <a href={project.researchPaperUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-blue-600 transition-all group">
                        <div className="flex items-center gap-3">
                          <FileText size={18} />
                          <span className="text-sm font-bold uppercase tracking-widest">White Paper</span>
                        </div>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contributors Full List */}
              {contributors.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-[0.4em] text-zinc-400">The Brain Trust</h3>
                  <div className="space-y-6">
                    {contributors.map(c => {
                      const url = c.linkedInUrl ? (c.linkedInUrl.startsWith('http') ? c.linkedInUrl : `https://${c.linkedInUrl}`) : undefined;
                      const img = c.imageUrl || c.avatarUrl;
                      
                      return (
                        <div key={c.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shrink-0">
                               {img ? (
                                 <img src={getDirectLink(img)} alt={c.name} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                                    <Users size={20} />
                                 </div>
                               )}
                            </div>
                            <div>
                              <p className="font-bold text-sm uppercase tracking-tight text-zinc-800 dark:text-white">{c.name}</p>
                              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none mt-1">{c.role}</p>
                            </div>
                          </div>
                          {url && (
                            <a href={url} target="_blank" rel="noreferrer" className="p-2.5 bg-blue-600/5 hover:bg-blue-600 rounded-xl text-blue-500 hover:text-white transition-all">
                              <Share2 size={14} />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </header>
      </div>
    </main>
  );
}
