import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useContent } from '@/src/hooks/useContent';
import { useCollection } from '@/src/hooks/useCollection';
import { 
  ChevronRight, 
  ArrowRight, 
  Brain, 
  Code, 
  Globe, 
  Shield, 
  Database, 
  Cpu, 
  Zap, 
  Github, 
  Linkedin, 
  GraduationCap, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  Box,
  Binary,
  Layers,
  FileCode,
  Activity,
  User as UserIcon,
  Play,
  Phone,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getDirectLink } from '@/lib/utils';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';
import { VisualEditorWrapper } from '@/src/components/admin/VisualEditorWrapper';
import { EditorDrawer } from '@/src/components/admin/EditorDrawer';

// Admin Managers
import { AboutManager } from './admin/AboutManager';
import { EducationManager } from './admin/EducationManager';
import { CertificationsManager } from './admin/CertificationsManager';

interface Project {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  techStack: string[];
  metrics: string[];
  priority: number;
}

interface Certification {
  id: string; // From Firestore
  title: string;
  issuer: string;
  imageUrl: string;
  verificationUrl: string;
  certificationType: 'Certificates' | 'Badges' | 'Achievements';
  description?: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  skills?: string[];
  isFeatured?: boolean;
  priority: number;
}

interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
  imageUrl?: string;
}

import { EditableText } from '@/src/components/admin/EditableText';
import { DecorationLayer } from '@/src/components/admin/DecorationLayer';

export function AboutPage({ isAdmin }: { isAdmin?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEditor, setActiveEditor] = useState<string | null>(null);
  const { data: aboutData, loading: aboutLoading, update: updateAbout } = useContent<any>('sections/about');
// ... rest of component ...
  const { data: projects } = useCollection<Project>('projects', 'priority');
  const { data: certs } = useCollection<Certification>('certifications', 'priority');
  const { data: edu } = useCollection<Education>('education', 'period');
  const { data: settings } = useContent<any>('settings/global');

  const defaultIntro = `I am Thrithwaka Preethi Shakya, an undergraduate with a strong passion for Artificial Intelligence, Cloud Computing, and modern technology solutions. I am dedicated to developing my skills in AI, Machine Learning, Data Science, and system design while building practical projects that address real-world challenges. My academic journey is focused on combining technical knowledge with innovation to create intelligent, scalable, and impactful solutions. I continuously pursue professional growth through certifications, hands-on experience, and emerging technologies to strengthen my expertise in future-focused fields. With a deep interest in problem-solving and technology-driven innovation, I aim to contribute to the advancement of AI-powered systems that improve efficiency, security, and human experiences. I believe in maintaining a balance between learning, creativity, and discipline as I work toward becoming a skilled AI Engineer and technology professional. My goal is to build a strong foundation that enables me to create meaningful solutions and contribute effectively to the evolving digital world.`;

  const [activeTab, setActiveTab] = React.useState<'Certificates' | 'Badges' | 'Achievements'>('Certificates');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hero Transitions
  const heroOpacity = useTransform(smoothProgress, [0, 0.1, 0.22], [1, 1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.12, 0.25], [1, 1, 0.8]);
  const heroY = useTransform(smoothProgress, [0, 0.12, 0.25], [0, 0, -100]);

  // Horizontal movement for hero words
  const isMobileSize = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const xOffset = isMobileSize ? 150 : 400;
  
  const word1X = useTransform(smoothProgress, [0, 0.12, 0.25], [0, 0, xOffset]);
  const word2X = useTransform(smoothProgress, [0, 0.12, 0.25], [0, 0, -xOffset]);
  const word3X = useTransform(smoothProgress, [0, 0.12, 0.25], [0, 0, xOffset]);

  const subTitleY = useTransform(smoothProgress, [0, 0.1], [0, 50]);
  const subTitleOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  // Section Transitions
  const introScale = useTransform(smoothProgress, [0.15, 0.22, 0.4, 0.45], [0.8, 1, 1, 0.8]);
  const introOpacity = useTransform(smoothProgress, [0.15, 0.2, 0.42, 0.45], [0, 1, 1, 0]);
  const introY = useTransform(smoothProgress, [0.15, 0.25], [100, 0]);
  const introImageX = useTransform(smoothProgress, [0.15, 0.25], [-200, 0]);
  const introTextX = useTransform(smoothProgress, [0.15, 0.25], [200, 0]);

  // Educational Foundations Transitions
  const eduScale = useTransform(smoothProgress, [0.42, 0.48, 0.65, 0.7], [0.8, 1, 1, 0.8]);
  const eduOpacity = useTransform(smoothProgress, [0.42, 0.46, 0.68, 0.7], [0, 1, 1, 0]);
  const eduY = useTransform(smoothProgress, [0.42, 0.52], [100, 0]);
  const lineDraw = useTransform(smoothProgress, [0.45, 0.65], [0, 1]);

  // Certifications Transitions
  const certSectionScale = useTransform(smoothProgress, [0.68, 0.74, 0.95, 1.0], [0.8, 1, 1, 1]);
  const certSectionOpacity = useTransform(smoothProgress, [0.68, 0.72, 0.95, 1.0], [0, 1, 1, 1]);
  const certSectionY = useTransform(smoothProgress, [0.68, 0.75, 0.95, 1.0], [100, 0, 0, 0]);

  const certPointerEvents = useTransform(certSectionOpacity, (o) => o > 0.5 ? "auto" : "none");
  const eduPointerEvents = useTransform(eduOpacity, (o) => o > 0.5 ? "auto" : "none");
  const introPointerEvents = useTransform(introOpacity, (o) => o > 0.5 ? "auto" : "none");

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white selection:bg-blue-600 selection:text-white transition-colors duration-1000">
      <div ref={containerRef} className="relative h-[400vh]">
        {aboutLoading ? (
          <div className="h-screen w-full flex items-center justify-center bg-white fixed inset-0 z-[100]">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-[3px] border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('hero')} label="Edit Hero Section">
              <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0 px-6 bg-white dark:bg-black">
              {/* Decoration Layer */}
              <DecorationLayer 
                isAdmin={isAdmin}
                decorations={aboutData?.decorations || []}
                onUpdate={(decs) => updateAbout({ decorations: decs })}
              />

              {/* Background */}
              <motion.div 
                style={{ opacity: heroOpacity }}
                className="absolute inset-0 pointer-events-none z-0"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-zinc-50 dark:bg-white/[0.02] rounded-full blur-[120px] opacity-0" />
              </motion.div>

              <motion.div 
                style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                className="relative z-10 w-full flex flex-col items-center"
              >
                <motion.div style={{ opacity: subTitleOpacity, y: subTitleY }} className="mb-8 md:mb-12">
                  <EditableText
                    isAdmin={isAdmin}
                    initialValue={aboutData?.heroSubtitle || 'The Identity Matrix'}
                    onSave={(val) => updateAbout({ heroSubtitle: val })}
                    className="text-[10px] md:text-sm font-mono font-bold uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400 block"
                  />
                </motion.div>

                <div className="flex flex-col items-center text-center w-full uppercase">
                  {isAdmin ? (
                    <EditableText
                      isAdmin={isAdmin}
                      initialValue={aboutData?.heroTitle || "Designing Tomorrow's Intelligence"}
                      onSave={(val) => updateAbout({ heroTitle: val })}
                      className="text-4xl md:text-[8vw] font-black tracking-tight leading-[0.8] text-black dark:text-white uppercase text-center"
                    />
                  ) : aboutData?.heroTitle ? (
                    aboutData.heroTitle.split(' ').map((word: string, i: number) => (
                      <motion.h1 
                        key={i}
                        style={{ x: i % 2 === 0 ? word1X : word2X }}
                        className="text-[12vw] md:text-[8vw] font-black tracking-tight leading-[0.8] text-black dark:text-white"
                      >
                        {word}
                      </motion.h1>
                    ))
                  ) : (
                    <>
                      <motion.h1 style={{ x: word1X }} className="text-[12vw] md:text-[8vw] font-black tracking-tight leading-[0.8] text-black dark:text-white">Designing</motion.h1>
                      <motion.h1 style={{ x: word2X }} className="text-[12vw] md:text-[8vw] font-black tracking-tight leading-[0.8] text-black dark:text-white">Tomorrow's</motion.h1>
                      <motion.h1 style={{ x: word3X }} className="text-[12vw] md:text-[8vw] font-black tracking-tight leading-[0.8] text-black dark:text-white">Intelligence</motion.h1>
                    </>
                  )}
                </div>
              </motion.div>
            </section>
            </VisualEditorWrapper>

            {/* 2. DEEP INTRODUCTION - PINNED TRANSITION ON DESKTOP */}
            <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('about')} label="Edit Introduction">
              <motion.section 
                style={{ opacity: introOpacity, pointerEvents: introPointerEvents as any }}
                className="md:sticky md:top-0 min-h-screen md:h-screen w-full flex items-center justify-center bg-white dark:bg-black z-10 md:overflow-hidden py-16 md:py-0"
              >
                {/* Decoration Layer */}
                <DecorationLayer 
                  isAdmin={isAdmin}
                  decorations={aboutData?.decorations || []}
                  onUpdate={(decs) => updateAbout({ decorations: decs })}
                />
                
                <motion.div 
                  style={{ scale: introScale, y: introY }}
                  className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-24 items-center w-full pt-12 md:pt-0"
                >
                  <motion.div 
                    style={{ x: introImageX }}
                    className="lg:col-span-5 relative group order-1"
                  >
                    <div className="relative aspect-square rounded-[2rem] md:rounded-[4rem] overflow-hidden border-4 md:border-8 border-white dark:border-zinc-900 shadow-2xl">
                      <img 
                        src={getDirectLink(aboutData?.deepIntroImage || aboutData?.profileImageUrl) || "https://images.unsplash.com/photo-1544256718-3bcf237f3974"} 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 saturate-100" 
                      />
                    </div>
                  </motion.div>

                    <motion.div 
                      style={{ x: introTextX }}
                      className="lg:col-span-7 space-y-6 md:space-y-12 py-4 lg:py-0 order-2"
                    >
                      <div className="space-y-3 md:space-y-6">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 block">The Narrative</span>
                        </div>
                        <EditableText
                          isAdmin={isAdmin}
                          initialValue={aboutData?.deepIntroTitle || 'About Me.'}
                          onSave={(val) => updateAbout({ deepIntroTitle: val })}
                          className="text-4xl md:text-8xl font-black tracking-tighter uppercase text-black dark:text-white leading-none"
                        />
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-zinc-100 dark:bg-white/5 hidden lg:block" />
                        <EditableText
                          isAdmin={isAdmin}
                          multiline
                          initialValue={aboutData?.deepIntroContent || defaultIntro}
                          onSave={(val) => updateAbout({ deepIntroContent: val })}
                          className="text-zinc-400 dark:text-zinc-500 text-sm md:text-xl leading-snug font-medium tracking-tight max-w-2xl"
                        />
                      </div>
                    </motion.div>
                </motion.div>
              </motion.section>
            </VisualEditorWrapper>

            {/* 3. ACADEMIC BACKGROUND - CINEMATIC TIMELINE */}
            <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('education')} label="Manage Education">
              <motion.section 
                style={{ opacity: eduOpacity, pointerEvents: eduPointerEvents as any }}
                className="md:sticky md:top-0 min-h-screen md:h-screen w-full flex items-center justify-center bg-[#fdfcfb] dark:bg-zinc-950 z-20 md:overflow-hidden py-12 md:py-0"
              >
                <motion.div 
                  style={{ scale: eduScale, y: eduY }}
                  className="max-w-5xl mx-auto px-6 w-full flex flex-col justify-center max-h-[90vh] overflow-y-auto no-scrollbar pointer-events-auto"
                >
                  <div className="text-center mb-8 md:mb-16 space-y-3">
                    <motion.span 
                      className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.6em] text-zinc-400 font-bold block"
                    >
                      Academic Background
                    </motion.span>
                    <h2 className="text-3xl md:text-6xl font-serif italic text-zinc-900 dark:text-white tracking-tight leading-tight">
                      Educational Foundations
                    </h2>
                    <div className="w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent mx-auto mt-3 md:mt-4" />
                  </div>

                  <div className="relative max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-24 px-4 md:px-0">
                    {/* Connecting Line (Tree Branch) */}
                    <div className="absolute left-[-16px] md:left-1/2 top-4 bottom-4 w-[2px] bg-zinc-100 dark:bg-white/5 md:-translate-x-1/2">
                      <motion.div 
                        style={{ scaleY: lineDraw }}
                        className="w-full h-full bg-gradient-to-b from-blue-600/50 via-blue-400/50 to-blue-200/20 origin-top"
                      />
                    </div>

                    {/* Node 1: A/L */}
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="relative md:text-right flex flex-col items-start md:items-end group"
                    >
                      <div className="flex absolute -left-[23px] md:left-auto md:-right-[16px] top-6 md:top-8 z-10 w-4 h-4 md:w-6 md:h-6 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 group-hover:scale-125 transition-transform duration-500 items-center justify-center">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full" />
                      </div>
                      
                      <div className="w-full p-6 md:p-8 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-none group-hover:shadow-2xl group-hover:border-blue-600/20 transition-all duration-700">
                        <div className="space-y-3 md:space-y-4">
                          <GraduationCap className="text-blue-600 mb-2 md:mb-4 md:ml-auto" size={isMobileSize ? 18 : 22} />
                          <div>
                            <p className="text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1">Sri Lanka // 2022</p>
                            <h3 className="text-lg md:text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-tight">G.C.E. Advanced Level</h3>
                          </div>
                          <div className="pt-2 md:pt-3 border-t border-zinc-50 dark:border-white/5">
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Sri Rahula National School</p>
                            <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-widest leading-tight">Engineering Technology</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Node 2: B.Sc */}
                    <motion.div 
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="relative md:mt-24 flex flex-col items-start group"
                    >
                      <div className="flex absolute -left-[23px] md:-left-[16px] top-6 md:top-8 z-10 w-4 h-4 md:w-6 md:h-6 rounded-full border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 group-hover:scale-125 transition-transform duration-500 items-center justify-center">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full" />
                      </div>

                      <div className="w-full p-6 md:p-8 bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-none group-hover:shadow-2xl group-hover:border-blue-600/20 transition-all duration-700">
                        <div className="space-y-3 md:space-y-4">
                          <Binary className="text-blue-600 mb-2 md:mb-4" size={isMobileSize ? 18 : 22} />
                          <div>
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-1.5 md:mb-2 text-center">
                              Current Undergraduate
                            </div>
                            <h3 className="text-lg md:text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-tight">B.Sc (Hons) in Data Science</h3>
                          </div>
                          <div className="pt-2 md:pt-3 border-t border-zinc-50 dark:border-white/5">
                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 leading-tight text-balance">Sri Lanka Technological Campus (SLTC)</p>
                            <p className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-snug">Specializing in AI, Data Science, and Intelligent Systems integration.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.section>
            </VisualEditorWrapper>

            {/* 4. CERTIFICATIONS & ACHIEVEMENTS - DYNAMIC SHOWCASE */}
            <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('certifications')} label="Manage Certifications">
              <motion.section 
                style={{ opacity: certSectionOpacity, pointerEvents: certPointerEvents as any }}
                className="md:sticky md:top-0 min-h-screen md:h-screen w-full flex items-center justify-center bg-white dark:bg-black z-30 md:overflow-hidden py-16 md:py-0"
              >
                <motion.div 
                  style={{ scale: certSectionScale, y: certSectionY }}
                  className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center"
                >
                  <div className="text-center mb-8 md:mb-10 space-y-3">
                    <motion.span 
                      className="text-[10px] md:text-sm font-mono uppercase tracking-[0.4em] text-blue-600 font-bold block"
                    >
                      Professional Growth
                    </motion.span>
                    <h2 className="text-3xl md:text-7xl font-black tracking-tighter uppercase text-black dark:text-white leading-none">
                      Certifications & Achievements
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-4">
                      Verified Credentials • Skill Recognition • Professional Milestones
                    </p>
                  </div>

                  {/* Category Navigation */}
                  <div className="w-full flex justify-center mb-4 md:mb-6">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-white/5 shadow-inner">
                      {(['Certificates', 'Badges', 'Achievements'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-6 md:px-10 py-2 md:py-3.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer relative z-40 ${
                            activeTab === tab 
                              ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-xl scale-105 ring-1 ring-zinc-200/50 dark:ring-white/10' 
                              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative w-full max-h-[70vh] overflow-y-auto custom-scrollbar p-2 pointer-events-auto">
                    <AnimatePresence mode="popLayout">
                      {(() => {
                        const filteredCerts = certs
                          .filter(cert => cert.certificationType === activeTab)
                          .sort((a, b) => (a.priority || 0) - (b.priority || 0));

                        if (filteredCerts.length === 0) {
                          return (
                            <motion.div
                              key="empty-state"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4"
                            >
                              <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-white/5">
                                <Activity className="text-zinc-300 dark:text-zinc-700" size={32} />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm md:text-lg font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
                                  System Status: Null
                                </h4>
                                <p className="text-[10px] md:text-xs text-zinc-500 font-mono uppercase tracking-[0.2em]">
                                  No {activeTab.toLowerCase()} available for the current entry.
                                </p>
                              </div>
                            </motion.div>
                          );
                        }

                        // Use a denser grid for Badges and Achievements
                        const gridCols = activeTab === 'Certificates' 
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

                        return (
                          <div className={`grid ${gridCols} gap-4 md:gap-6 w-full pb-12`}>
                            {filteredCerts.map((cert, idx) => (
                              <motion.div
                                layout
                                key={cert.id || `cert-${idx}`}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                className={`group relative bg-zinc-50 dark:bg-white/[0.01] border border-zinc-100 dark:border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-2xl hover:scale-[1.02] transition-all duration-700 h-full flex flex-col ${activeTab !== 'Certificates' ? 'text-center items-center' : ''}`}
                              >
                                <div className={`flex items-start justify-between mb-4 w-full ${activeTab !== 'Certificates' ? 'flex-col items-center gap-4' : ''}`}>
                                  <div className={`${activeTab === 'Certificates' ? 'w-12 h-12 md:w-16 md:h-16' : 'w-16 h-16 md:w-20 md:h-20'} bg-white dark:bg-zinc-800 rounded-xl md:rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 p-2 overflow-hidden flex items-center justify-center relative group-hover:after:content-[''] group-hover:after:absolute group-hover:after:inset-0 group-hover:after:bg-gradient-to-r group-hover:after:from-transparent group-hover:after:via-white/20 group-hover:after:to-transparent group-hover:after:-translate-x-full group-hover:after:animate-[shimmer_2s_infinite]`}>
                                  <img 
                                    src={getDirectLink(cert.imageUrl) || "https://images.unsplash.com/photo-1633356122544-f134324a6cee"} 
                                    alt={cert.issuer} 
                                    className="w-full h-full object-contain" 
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                  {cert.isFeatured && (
                                    <div className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[8px] font-bold uppercase tracking-widest">
                                      Featured
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-3 flex-grow w-full">
                                  <div>
                                    <p className="text-[7px] md:text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">{cert.issuer} // {cert.date}</p>
                                    <h4 className={`${activeTab === 'Certificates' ? 'text-sm md:text-lg' : 'text-xs md:text-sm'} font-black uppercase tracking-tight text-black dark:text-white leading-tight group-hover:text-blue-600 transition-colors duration-500`}>
                                      {cert.title}
                                    </h4>
                                  </div>

                                  {activeTab === 'Certificates' && cert.description && (
                                    <RichTextRenderer 
                                      content={cert.description} 
                                      className="text-xs text-zinc-500 dark:text-zinc-500 line-clamp-2 leading-relaxed" 
                                    />
                                  )}

                                  {cert.skills && cert.skills.length > 0 && (
                                    <div className={`flex flex-wrap gap-1 pt-1 ${activeTab !== 'Certificates' ? 'justify-center' : ''}`}>
                                      {cert.skills.slice(0, activeTab === 'Certificates' ? 3 : 2).map((skill, sIdx) => (
                                        <span key={sIdx} className="text-[7px] font-mono text-zinc-400 border border-zinc-200 dark:border-white/5 px-2 py-0.5 rounded-full uppercase">
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                <div className={`pt-4 mt-4 border-t border-zinc-100 dark:border-white/5 flex items-center w-full ${activeTab !== 'Certificates' ? 'justify-center' : 'justify-between'}`}>
                                  <a 
                                    href={cert.verificationUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-[8px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors"
                                  >
                                    Verify <ArrowRight size={12} className="ml-1" />
                                  </a>
                                  {activeTab === 'Certificates' && cert.credentialId && (
                                    <span className="text-[7px] font-mono text-zinc-300 dark:text-zinc-700 uppercase">{cert.credentialId}</span>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        );
                      })()}
                    </AnimatePresence>
                  </div>

                </motion.div>
              </motion.section>
            </VisualEditorWrapper>
          </>
        )}

        <motion.div 
          className="fixed bottom-0 left-0 right-0 h-1 md:h-2 bg-blue-600 z-[100] origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* Admin Editor Drawers */}
      <EditorDrawer 
        isOpen={activeEditor === 'hero'} 
        onClose={() => setActiveEditor(null)}
        title="Hero Content"
      >
        <AboutManager />
      </EditorDrawer>

      <EditorDrawer 
        isOpen={activeEditor === 'about'} 
        onClose={() => setActiveEditor(null)}
        title="Introduction"
      >
        <AboutManager />
      </EditorDrawer>

      <EditorDrawer 
        isOpen={activeEditor === 'education'} 
        onClose={() => setActiveEditor(null)}
        title="Academic Background"
      >
        <EducationManager />
      </EditorDrawer>

      <EditorDrawer 
        isOpen={activeEditor === 'certifications'} 
        onClose={() => setActiveEditor(null)}
        title="Certifications"
      >
        <CertificationsManager />
      </EditorDrawer>

      <footer className="relative z-50 py-24 px-6 bg-white dark:bg-black border-t border-zinc-100 dark:border-white/5 overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start mb-24">
              {/* Brand & Mission */}
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">T</div>
                  <span className="text-2xl font-bold tracking-tighter">TPS.</span>
                </div>
                <p className="text-xl md:text-2xl text-zinc-500 max-w-sm leading-relaxed italic font-serif">
                  Exploring the infinite possibilities of machine intelligence and human potential.
                </p>
              </div>

              {/* Contact Information */}
              <div className="lg:col-span-7 lg:pl-12">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-blue-600 font-bold block">Connect</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <a href={`mailto:${settings?.email || 'thrithwakapreethi57@gmail.com'}`} className="group block space-y-3">
                        <div className="flex items-center gap-3">
                           <Mail size={14} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
                           <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Email</span>
                        </div>
                        <span className="text-lg md:text-xl font-medium tracking-tight text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 transition-all block break-all">
                          {settings?.email || 'thrithwakapreethi57@gmail.com'}
                        </span>
                      </a>

                      <a href={`tel:${settings?.phone?.replace(/\s/g, '') || '+94704056562'}`} className="group block space-y-3">
                        <div className="flex items-center gap-3">
                           <Phone size={14} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
                           <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Phone</span>
                        </div>
                        <span className="text-lg md:text-xl font-medium tracking-tight text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 transition-all block">
                          {settings?.phone || '+94 70 405 6562'}
                        </span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-100 dark:border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-400 block mb-6">Social Discovery</span>
                    <div className="flex flex-wrap gap-4">
                      <a href={settings?.linkedinUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all group">
                        <Linkedin size={16} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">LinkedIn</span>
                      </a>
                      <a href={settings?.githubUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all group">
                        <Github size={16} className="text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">GitHub</span>
                      </a>
                      <a href={settings?.scholarUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all group">
                        <GraduationCap size={16} className="text-zinc-400 group-hover:text-green-600 transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Scholar</span>
                      </a>
                      {settings?.orcidUrl && (
                        <a href={settings.orcidUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all group">
                          <LinkIcon size={16} className="text-zinc-400 group-hover:text-green-500 transition-colors" />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">ORCID</span>
                        </a>
                      )}
                      {settings?.researchGateUrl && (
                        <a href={settings.researchGateUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all group">
                          <Layers size={16} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">ResearchGate</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-12 border-t border-zinc-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div className="space-y-2">
                <p className="text-[9px] md:text-[10px] font-mono text-zinc-400 uppercase tracking-[0.4em]">
                  © 2026 THRITHWAKA PREETHI SHAKYA.
                </p>
                <p className="text-[9px] md:text-[10px] font-mono text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.4em]">
                  Advanced Intelligence Systems Engineer.
                </p>
              </div>
              <p className="text-[9px] md:text-[10px] font-mono text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.4em]">
                EST. 2024 — BEYOND TOMORROW.
              </p>
            </div>
          </div>
        </footer>
    </div>
  );
}

