import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Loader2, Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { ProjectCard } from '@/src/components/projects/ProjectCard';

export function ProjectsPage({ isAdmin }: { isAdmin?: boolean }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'AI', 'Cloud', 'Security', 'NLP', 'Transportation', 'Team', 'Personal'];

  useEffect(() => {
    // Simple query first to ensure we see all documents regardless of missing fields
    const q = query(collection(db, 'projects'));
    
    const unsub = onSnapshot(q, async (snap) => {
      try {
        if (snap.empty) {
          setProjects([]);
          setLoading(false);
          
          // Auto-seed if owner is logged in and DB is empty
          const currentUser = auth.currentUser;
          if (currentUser && currentUser.email === 'thrithwakapreethi57@gmail.com' && !isSeeding) {
            console.log("Auto-seeding projects for owner...");
            seedSampleData();
          }
          return;
        }

        const projectsData = await Promise.all(snap.docs.map(async (doc) => {
          const data = doc.data();
          let contributors: any[] = [];
          
          try {
            // Fetch contributors for each project
            const contributorsSnap = await getDocs(query(collection(db, `projects/${doc.id}/contributors`), orderBy('priority', 'asc')));
            contributors = contributorsSnap.docs.map(c => ({ id: c.id, ...c.data() }));
          } catch (e) {
            console.warn("Could not fetch contributors for", doc.id);
          }
          
          return { 
            id: doc.id, 
            ...data,
            contributors 
          };
        }));
        
        // Client-side sort as a fallback for the simpler query
        const sortedData = projectsData.sort((a: any, b: any) => (a.priority || 0) - (b.priority || 0));
        
        setProjects(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Error processing projects snapshot:", err);
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore Projects Snap Error:", error);
      setLoading(false);
    });
    
    return unsub;
  }, []);

  const seedSampleData = async () => {
    setIsSeeding(true);
    try {
      const samples = [
        {
          title: "NEXUS PRIME: Autonomous Urban Mobility",
          slug: "nexus-prime",
          shortDescription: "A decentralized neural network designed to orchestrate autonomous logistics across smart cities.",
          fullDescription: "Nexus Prime leverages edge computing and decentralized AI agents to predict traffic patterns and adjust multi-modal transport routes in real-time. This project explores the intersection of computer vision, reinforcement learning, and distributed systems to create a truly autonomous logistics backbone for the cities of 2030.",
          category: "AI",
          status: "Completed",
          startDate: "JAN 2024",
          endDate: "DEC 2024",
          coverImageUrl: "https://images.unsplash.com/photo-1558441719-ffb4d452074b?auto=format&fit=crop&q=80&w=1600",
          techStack: ["PyTorch", "Rust", "MQTT", "Next.js", "gRPC"],
          priority: 1,
          isFeatured: true,
          myRole: "Lead Technical Architect",
          teamStructure: "Collaborative research team across 4 continents",
          objective: "To develop a scalable framework for cross-agent communication in high-density urban environments.",
          problemSolved: "Traditional logistics rely on centralized dispatchers which create bottlenecks and single points of failure.",
          updatedAt: serverTimestamp(),
          contributors: [
            { name: "Dr. Aris Thorne", role: "AI Research Lead", linkedInUrl: "https://linkedin.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aris", priority: 0 },
            { name: "Sarah Jenkins", role: "Systems Engineer", linkedInUrl: "https://linkedin.com", imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", priority: 1 }
          ],
          gallery: [
            { url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800", type: "image", caption: "Simulated Mesh Network Architecture", priority: 0 }
          ],
          sections: [
            { title: "The Neural Architecture", content: "We utilized a transformer-based world model to predict occupancy grids across the city center. This allowed agents to 'hallucinate' potential traffic jams before they occurred, significantly improving rerouting capability.", priority: 0 }
          ]
        },
        {
          title: "QUANTUM GUARD: Next-Gen Encryption",
          slug: "quantum-guard",
          shortDescription: "A quantum-resistant cryptographic layer for distributed ledgers, ensuring long-term data integrity.",
          fullDescription: "Quantum Guard implements post-quantum cryptographic primitives like Kyber and Dilithium into existing blockchain protocols. As quantum supremacy approaches, current RSA and ECC-based systems face existential threats.",
          category: "Security",
          status: "Ongoing",
          startDate: "MAR 2025",
          endDate: "Present",
          coverImageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1600",
          techStack: ["Go", "Solidity", "ZK-Proofs", "OpenSSL"],
          priority: 2,
          updatedAt: serverTimestamp()
        }
      ];

      for (const sample of samples) {
        const { contributors, gallery, sections, ...projectData } = sample as any;
        const docRef = await addDoc(collection(db, 'projects'), projectData);
        
        if (contributors) {
          for (const c of contributors) await addDoc(collection(db, `projects/${docRef.id}/contributors`), c);
        }
        if (gallery) {
          for (const g of gallery) await addDoc(collection(db, `projects/${docRef.id}/gallery`), g);
        }
        if (sections) {
          for (const s of sections) await addDoc(collection(db, `projects/${docRef.id}/sections`), s);
        }
      }
      alert("Innovation archive successfully synchronized with sample data.");
    } catch (error: any) {
      console.error("Seeding failed:", error);
      alert(`Synchronization Failure: ${error.message}. Please ensure you are logged in as an authorized researcher at /admin/login.`);
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (project.shortDescription || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           project.category === selectedCategory || 
                           project.tags?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="pt-32 min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Synchronizing Innovation Lab...</p>
      </div>
    </div>
  );

  return (
    <main className="pt-32 pb-32 px-6 bg-white dark:bg-black min-h-screen transition-colors duration-1000">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header Section */}
        <header className="space-y-6 md:space-y-8 flex flex-col items-center text-center">
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[9px] md:text-xs font-mono uppercase tracking-[0.4em] md:tracking-[0.6em] text-blue-600 block"
            >
              THE INNOVATION LAB
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.0] md:leading-[0.9] uppercase max-w-4xl text-zinc-900 dark:text-white [text-wrap:balance]"
            >
              BUILDING REAL-WORLD <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">INTELLIGENCE</span>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4 gap-y-2 text-[10px] md:text-sm font-mono text-zinc-400 uppercase tracking-widest"
          >
            <span>Projects</span>
            <span className="w-1 h-1 rounded-full bg-blue-600" />
            <span>Contributions</span>
            <span className="w-1 h-1 rounded-full bg-blue-600" />
            <span>Innovation Ecosystem</span>
          </motion.div>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-center justify-between p-4 md:p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl md:rounded-[2.5rem] border border-zinc-100 dark:border-white/5 backdrop-blur-xl sticky top-20 md:top-24 z-40">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search innovation archive..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 bg-white dark:bg-black rounded-xl md:rounded-2xl border border-zinc-200 dark:border-white/10 focus:outline-none focus:border-blue-600 transition-all text-xs md:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white dark:bg-black text-zinc-400 border border-zinc-200 dark:border-white/10 hover:border-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 p-1 bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-white/10">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600' : 'text-zinc-400'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600' : 'text-zinc-400'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-1 gap-12' : 'gap-6'}`}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-32 text-center"
              >
                <div className="max-w-sm mx-auto space-y-6">
                  <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto">
                    <Search className="text-zinc-300" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">Signals Lost</h3>
                  <p className="text-zinc-500 dark:text-zinc-400">No projects found matching your criteria. The innovation archive appears to be offline.</p>
                  
                  <div className="flex flex-col gap-3 pt-4">
                    <button 
                      onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
                      className="text-sm font-bold text-blue-600 uppercase tracking-widest hover:underline"
                    >
                      Clear all filters
                    </button>
                    
                    <div className="h-px w-8 bg-zinc-100 dark:bg-zinc-800 mx-auto my-2" />
                    
                    <button 
                      onClick={seedSampleData}
                      disabled={isSeeding}
                      className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-wait"
                    >
                      {isSeeding ? 'Synchronizing Lab...' : 'Initialize Laboratory'}
                    </button>

                    {!auth.currentUser && (
                      <Link 
                        to="/admin/login"
                        className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                      >
                        Authorized Personnel Only: Sign In to Seed
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
