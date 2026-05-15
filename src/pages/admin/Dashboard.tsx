import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Image, 
  Star, 
  Wrench, 
  BookOpen, 
  Briefcase, 
  Settings,
  ChevronRight,
  Globe,
  Box,
  ShieldCheck,
  Cpu,
  GraduationCap,
  LogOut,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

import { HeroManager } from './HeroManager';
import { AboutManager } from './AboutManager';
import { ResearchesManager } from './ResearchesManager';
import { EndorsementsManager } from './EndorsementsManager';
import { ToolkitManager } from './ToolkitManager';
import { SettingsManager } from './SettingsManager';
import { ProjectsManager } from './ProjectsManager';
import { CertificationsManager } from './CertificationsManager';
import { EducationManager } from './EducationManager';

export function AdminDashboard({ user }: { user: User }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { name: 'Command Center', icon: LayoutDashboard, path: '/admin/dashboard', category: 'General', description: 'Real-time ecosystem pulse and system status.' },
    { name: 'Hero Identity', icon: Image, path: '/admin/dashboard/hero', category: 'Brand', description: 'Core visual and identity introduction.' },
    { name: 'About Mission', icon: UserIcon, path: '/admin/dashboard/about', category: 'Brand', description: 'Vision, mission, and technical biography.' },
    { name: 'Innovation Lab', icon: Box, path: '/admin/dashboard/projects', category: 'Portfolio', description: 'Advanced project portfolio and strategic ventures.' },
    { name: 'Research Lab', icon: BookOpen, path: '/admin/dashboard/research', category: 'Portfolio', description: 'Technical publications and core research.' },
    { name: 'Badge Ecosystem', icon: ShieldCheck, path: '/admin/dashboard/certifications', category: 'Portfolio', description: 'Verified credentials and achievements.' },
    { name: 'Academic Labs', icon: GraduationCap, path: '/admin/dashboard/education', category: 'Portfolio', description: 'Educational foundation and academic journey.' },
    { name: 'Endorsements', icon: Star, path: '/admin/dashboard/endorsements', category: 'Engagement', description: 'Professional validation and testimonials.' },
    { name: 'Toolkit Mastery', icon: Wrench, path: '/admin/dashboard/toolkit', category: 'Engagement', description: 'Technical stack and strategic capabilities.' },
    { name: 'Global Settings', icon: Settings, path: '/admin/dashboard/settings', category: 'System', description: 'Connectivity matrix and social footprints.' },
  ];

  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['General', 'Brand', 'Portfolio', 'Engagement', 'System'];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#020202] text-white font-sans overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Premium Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 0, 
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? 'auto' : 'none'
        }}
        className="border-r border-white/5 flex flex-col bg-[#020202] relative z-50 overflow-hidden shrink-0"
      >
        <div className="p-6 space-y-6 flex flex-col h-full w-[280px]">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5 group-hover:scale-105 transition-transform">
                <span className="text-black font-black text-xl italic leading-none">T</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tighter text-lg leading-none uppercase">Genesis OS</span>
                <span className="text-[10px] font-mono text-zinc-600 tracking-widest mt-1 uppercase">Control Surface v1.2</span>
              </div>
            </Link>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search Command..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.05] transition-all placeholder:text-zinc-700"
            />
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar" data-lenis-prevent>
            {categories.map(category => {
              const items = filteredMenu.filter(i => i.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600 px-4 flex items-center gap-2">
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    {category}
                  </p>
                  <div className="space-y-1">
                    {items.map(item => {
                      const isActive = location.pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <Link 
                          key={item.path} 
                          to={item.path}
                          className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-500 group ${
                            isActive 
                              ? 'bg-white text-black shadow-2xl shadow-white/10 ring-1 ring-white/20' 
                              : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-black/5' : ''}`}>
                              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-sm tracking-tight ${isActive ? 'font-black' : 'font-semibold'}`}>{item.name}</span>
                          </div>
                          {isActive && <motion.div layoutId="nav-indicator" transition={{ type: 'spring', stiffness: 300, damping: 30 }}><ChevronRight size={14} /></motion.div>}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Security Masked</p>
                <p className="text-[9px] text-zinc-500 truncate mt-1 italic">Admin session verified</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl text-zinc-600 hover:bg-red-500 hover:text-white transition-all font-bold group border border-dashed border-white/5 hover:border-solid hover:border-red-500"
            >
              <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest font-black">Decommission Session</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Primary Interface */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Universal Headbar */}
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 shrink-0 bg-[#020202]/80 backdrop-blur-2xl z-40 sticky top-0">
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all active:scale-90"
            >
              {isSidebarOpen ? <X size={18} className="text-zinc-400" /> : <Menu size={18} className="text-zinc-400" />}
            </button>
            
            <div className="flex items-center space-x-3 text-[10px] font-bold tracking-[0.2em] uppercase">
              <Link to="/admin/dashboard" className="text-zinc-500 hover:text-white transition-colors">Core</Link>
              <ChevronRight size={10} className="text-zinc-700" />
              <span className="text-blue-500">
                {menuItems.find(i => i.path === location.pathname)?.name || 'Command Center'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-10">
             <div className="hidden xl:flex items-center space-x-6 text-[10px] font-mono text-zinc-600">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="uppercase tracking-[0.2em]">Runtime: STABLE</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <span className="uppercase tracking-[0.2em]">Buffer: 0.12ms</span>
             </div>

             <div className="flex items-center space-x-6">
                <button className="relative p-3 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/20 border border-white/5 rounded-2xl transition-all group">
                  <Bell size={18} className="text-zinc-500 group-hover:text-blue-500" />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full ring-4 ring-[#020202]" />
                </button>
                
                <div className="h-10 w-px bg-white/10 invisible lg:visible" />
                
                <div className="flex items-center space-x-4 pl-2 group cursor-pointer">
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-xs font-black tracking-tight group-hover:text-blue-500 transition-colors uppercase leading-none">{user.displayName || 'Architect'}</p>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest mt-1.5 font-bold">Identity Verified</p>
                  </div>
                  <div className="w-12 h-12 rounded-[1.25rem] overflow-hidden p-0.5 bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-white/5 shadow-xl transition-all group-hover:scale-105 group-hover:ring-blue-500/50">
                    <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-zinc-900 border border-white/10">
                      {user.photoURL ? 
                        <img src={user.photoURL} alt="admin" className="w-full h-full object-cover" /> : 
                        <div className="w-full h-full flex items-center justify-center font-black text-lg">P</div>
                      }
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </header>

        {/* Global Canvas */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth" data-lenis-prevent>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto w-full"
            >
              <Routes>
                <Route path="/" element={<Overview user={user} />} />
                <Route path="/hero" element={<HeroManager />} />
                <Route path="/about" element={<AboutManager />} />
                <Route path="/projects" element={<ProjectsManager />} />
                <Route path="/research" element={<ResearchesManager />} />
                <Route path="/certifications" element={<CertificationsManager />} />
                <Route path="/education" element={<EducationManager />} />
                <Route path="/endorsements" element={<EndorsementsManager />} />
                <Route path="/toolkit" element={<ToolkitManager />} />
                <Route path="/settings" element={<SettingsManager />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Overview({ user }: { user: any }) {
  const [stats, setStats] = useState({
    projects: 0,
    certs: 0,
    education: 0,
    skills: 0,
    research: 0,
    completion: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsSnap, certsSnap, eduSnap, skillsSnap, researchSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'certifications')),
          getDocs(collection(db, 'education')),
          getDocs(collection(db, 'skills')),
          getDocs(collection(db, 'research'))
        ]);

        setStats({
          projects: projectsSnap.size,
          certs: certsSnap.size,
          education: eduSnap.size,
          skills: skillsSnap.size,
          research: researchSnap.size,
          completion: 0
        });

        const filled = [
          projectsSnap.size > 0, 
          certsSnap.size > 0, 
          eduSnap.size > 0, 
          skillsSnap.size > 0,
          researchSnap.size > 0
        ].filter(Boolean).length;
        setStats(prev => ({ ...prev, completion: Math.round((filled / 5) * 100) || 12 }));
      } catch (err) {
        console.error("Stats sync error:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-16 pb-32">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="px-4 py-1.5 bg-blue-600/10 text-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/20">Operational Horizon</div>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">Global Sync Active</span>
             </div>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl xl:text-6xl font-black tracking-tight uppercase leading-tight italic"
          >
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 to-zinc-900">Surface</span>
          </motion.h1>
          <p className="text-zinc-500 text-lg max-w-2xl font-medium leading-relaxed">
            Welcome back, {user.displayName || 'Preethi'}. Your digital portfolio ecosystem is currently operating within <span className="text-white font-bold">optimal parameters</span>. Coordinate your brand signal from this centralized node.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
           <Link 
            to="/admin/dashboard/projects" 
            className="group flex items-center justify-center gap-4 bg-white text-black px-10 py-6 rounded-[2rem] font-black transition-all hover:pr-14 hover:shadow-2xl hover:shadow-white/20 active:scale-95"
           >
             <Plus size={20} strokeWidth={3} />
             <span className="uppercase tracking-[0.2em] text-[11px]">Deploy Venture</span>
           </Link>
           <button className="flex items-center justify-center p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 hover:border-white/20 transition-all text-zinc-400 hover:text-white">
              <ExternalLink size={18} />
           </button>
        </div>
      </header>

      {/* Grid: Identity Pulse */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Ecosystem Pulse', value: `${stats.projects}`, icon: Box, detail: 'Projects', color: 'text-blue-500', path: '/admin/dashboard/projects' },
            { label: 'Signal Complexity', value: `${stats.skills}`, icon: Cpu, detail: 'Skills', color: 'text-emerald-500', path: '/admin/dashboard/toolkit' },
            { label: 'Intelligence pool', value: `${stats.research}`, icon: BookOpen, detail: 'Papers', color: 'text-indigo-500', path: '/admin/dashboard/research' },
            { label: 'Credential Flow', value: `${stats.certs}`, icon: ShieldCheck, detail: 'Certs', color: 'text-purple-500', path: '/admin/dashboard/certifications' },
          ].map((stat, idx) => (
            <Link 
              key={stat.label} 
              to={stat.path}
              className="group p-6 border border-white/[0.03] rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent hover:bg-white/[0.05] hover:border-white/10 transition-all relative overflow-hidden flex flex-col justify-between min-h-[200px]"
            >
               <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 ${stat.color} group-hover:scale-110 group-hover:rotate-6`}>
                 <stat.icon size={100} strokeWidth={1} />
               </div>
               
               <div className="relative flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-600">{stat.label}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center ${stat.color} group-hover:bg-current group-hover:text-black transition-all shadow-xl`}>
                    <ArrowUpRight size={14} />
                  </div>
               </div>
 
               <div className="relative space-y-1">
                 <h2 className="text-5xl font-black tracking-tighter leading-none">{stat.value}</h2>
                 <div className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${stat.color} animate-pulse`} />
                    <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-[0.2em]">{stat.detail}</p>
                 </div>
               </div>
            </Link>
          ))}
        </div>
 
        <div className="xl:col-span-1 p-6 border border-white/[0.03] rounded-3xl bg-[#0A0A0A] flex flex-col justify-between items-center text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-blue-600/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
           
           <div className="space-y-1 relative z-10">
             <p className="text-[10px] uppercase tracking-widest font-black text-zinc-600">Integrity Score</p>
             <p className="text-[8px] uppercase font-bold text-blue-500 tracking-widest">Brand Completion</p>
           </div>
           
           <div className="relative w-28 h-28 my-4 group/circle z-10 transition-transform duration-700 hover:scale-105">
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-900" />
                <motion.circle 
                  cx="56" cy="56" r="50" 
                  stroke="currentColor" strokeWidth="6" 
                  fill="transparent" 
                  strokeDasharray={314} 
                  initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 - (314 * stats.completion / 100) }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-blue-500" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black tracking-tighter leading-none">{stats.completion}<span className="text-sm text-blue-500">%</span></span>
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{stats.completion === 100 ? 'Peak' : 'Refine'}</span>
              </div>
           </div>

           <Button variant="ghost" className="w-full relative z-10 py-6 bg-white/5 hover:bg-white hover:text-black rounded-2xl border border-white/5 transition-all active:scale-95 group/btn h-auto">
             <span className="text-[9px] uppercase font-black tracking-widest mr-2">Optimize Ecosystem</span>
             <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
         {/* Recent Activity */}
         <div className="space-y-10">
            <header className="flex items-center justify-between px-4">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">Synchronization Log</h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Recent Ecosystem Mutations</p>
                  </div>
               </div>
               <Link to="/admin/dashboard/settings" className="text-[10px] uppercase font-black text-blue-500 tracking-widest hover:text-blue-400 transition-colors bg-blue-500/10 px-4 py-2 rounded-xl">Diagnostic View</Link>
            </header>
            <div className="space-y-4">
               {[
                 { action: 'Updated Venture', target: 'Nexus Prime', time: '2m ago', icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
                 { action: 'Badge Injected', target: 'Azure AI Ops', time: '1h ago', icon: Plus, bg: 'bg-blue-500/10', text: 'text-blue-500' },
                 { action: 'Protocol Sync', target: 'Global Metadata', time: '4h ago', icon: Clock, bg: 'bg-zinc-900', text: 'text-zinc-600' },
                 { action: 'Identity Update', target: 'Hero Bio', time: '1d ago', icon: UserIcon, bg: 'bg-purple-500/10', text: 'text-purple-500' },
               ].map((log, i) => (
                 <motion.div 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   key={i} 
                   className="group p-6 border border-white/[0.03] rounded-[2rem] bg-white/[0.01] flex items-center justify-between hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-default"
                 >
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl ${log.bg} flex items-center justify-center ${log.text} border border-white/5`}>
                          <log.icon size={22} />
                       </div>
                       <div>
                          <p className="text-sm font-black uppercase tracking-tighter group-hover:text-white transition-colors">{log.action}</p>
                          <p className="text-[11px] text-zinc-500 font-medium">{log.target}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-700 block uppercase tracking-widest">{log.time}</span>
                      <span className="text-[8px] font-mono text-emerald-500/50 uppercase block mt-1 tracking-widest">Successful</span>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* System Health */}
         <div className="space-y-10">
            <header className="flex items-center gap-4 px-4">
               <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500">
                 <ShieldCheck size={20} />
               </div>
               <div>
                 <h3 className="text-2xl font-black uppercase tracking-tight italic">System Integrity</h3>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Real-time Platform Diagnostics</p>
               </div>
            </header>
            
            <div className="p-10 border border-white/[0.03] rounded-[3.5rem] bg-[#0A0A0A] space-y-10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px]" />
               
               <div className="space-y-6">
                  <div className="flex justify-between items-end">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black">Global Latency</p>
                        <h4 className="text-4xl font-black tracking-tighter italic">99.9% <span className="text-zinc-800">Uptime</span></h4>
                     </div>
                     <div className="px-4 py-2 bg-emerald-500/10 rounded-xl">
                        <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Optimized Pulse</span>
                     </div>
                  </div>
                  <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                     <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '99.9%' }} 
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <button className="group p-8 border border-white/5 rounded-[2.5rem] bg-zinc-900/30 hover:bg-white/[0.03] hover:border-white/10 transition-all text-left relative overflow-hidden active:scale-95">
                     <div className="absolute bottom-0 right-0 p-8 opacity-5 text-blue-500 group-hover:scale-110 transition-transform">
                        <Globe size={64} />
                     </div>
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-black transition-all duration-500 shadow-xl">
                        <Globe size={20} />
                     </div>
                     <p className="text-[10px] uppercase font-black tracking-[0.3em]">Public Horizon</p>
                     <p className="text-[9px] text-zinc-600 mt-2 font-bold uppercase">Inspect Live Presence</p>
                  </button>
                  <button className="group p-8 border border-white/5 rounded-[2.5rem] bg-zinc-900/30 hover:bg-white/[0.03] hover:border-white/10 transition-all text-left relative overflow-hidden active:scale-95">
                    <div className="absolute bottom-0 right-0 p-8 opacity-5 text-emerald-500 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={64} />
                     </div>
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 shadow-xl">
                        <ShieldCheck size={20} />
                     </div>
                     <p className="text-[10px] uppercase font-black tracking-[0.3em]">Security Audit</p>
                     <p className="text-[9px] text-zinc-600 mt-2 font-bold uppercase">Run Integrity Scan</p>
                  </button>
               </div>
               
               <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group hover:border-emerald-500/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors border border-white/5 group-hover:border-emerald-500/30">
                     <Settings size={22} className="animate-spin-slow" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] font-black uppercase tracking-widest group-hover:text-white transition-colors leading-none">Automated Backups</p>
                        <span className="text-[9px] font-mono text-zinc-700">67% Complete</span>
                     </div>
                     <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/40 w-2/3" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}


