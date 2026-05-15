import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useContent } from '@/src/hooks/useContent';
import { useCollection } from '@/src/hooks/useCollection';
import { getDirectLink } from '@/lib/utils';
import { ChevronRight, ArrowRight, Brain, Code, Globe, Shield, Database, Cpu, MessageSquare, Lightbulb, Users, Target, Zap, Github, Linkedin, GraduationCap, Mail, Phone, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RichTextRenderer } from '@/src/components/RichTextRenderer';
import { VisualEditorWrapper } from './admin/VisualEditorWrapper';
import { EditorDrawer } from './admin/EditorDrawer';

// Admin Managers
import { HeroManager } from '../pages/admin/HeroManager';
import { AboutManager } from '../pages/admin/AboutManager';
import { EndorsementsManager } from '../pages/admin/EndorsementsManager';
import { ToolkitManager } from '../pages/admin/ToolkitManager';

import { EditableText } from './admin/EditableText';
import { DecorationLayer } from './admin/DecorationLayer';

export function CinematicPortfolio({ isAdmin }: { isAdmin?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeEditor, setActiveEditor] = useState<string | null>(null);

  const { data: heroData, update: updateHero } = useContent<any>('sections/hero');
  const { data: aboutData, update: updateAbout } = useContent<any>('sections/about');
  const { data: settings, update: updateSettings } = useContent<any>('settings/global');
  const { data: endorsements } = useCollection<any>('endorsements', 'priority');
  const { data: skills } = useCollection<any>('skills');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hero Animations
  const heroOpacity = useTransform(smoothProgress, [0, 0.15, 0.22], [1, 1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0.9]);
  
  // Responsive transformation values
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const xOffset = isMobile ? 200 : 500;

  const name1X = useTransform(smoothProgress, [0, 0.15, 0.25], [0, 0, xOffset]);
  const name2X = useTransform(smoothProgress, [0, 0.15, 0.3], [0, 0, -xOffset]);
  const name3X = useTransform(smoothProgress, [0, 0.15, 0.35], [0, 0, xOffset]);

  const subTitleY = useTransform(smoothProgress, [0, 0.1], [0, 50]);
  const subTitleOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);

  // Section Transitions
  // Beat 2: About Me (0.22 - 0.48)
  const aboutScale = useTransform(smoothProgress, [0.22, 0.3, 0.45, 0.52], [0.8, 1, 1, 0.8]);
  const aboutOpacity = useTransform(smoothProgress, [0.22, 0.28, 0.48, 0.52], [0, 1, 1, 0]);
  const aboutY = useTransform(smoothProgress, [0.22, 0.35, 0.48, 0.52], [100, 0, 0, -50]);

  // Beat 3: Recommendations (0.5 - 0.75)
  const recScale = useTransform(smoothProgress, [0.48, 0.55, 0.7, 0.78], [0.8, 1, 1, 0.8]);
  const recOpacity = useTransform(smoothProgress, [0.48, 0.53, 0.72, 0.78], [0, 1, 1, 0]);
  const recY = useTransform(smoothProgress, [0.48, 0.6, 0.72, 0.78], [50, 0, 0, -50]);

  // Beat 4: Skills (0.75 - 0.98)
  const skillScale = useTransform(smoothProgress, [0.75, 0.82, 0.95, 0.98], [0.8, 1, 1, 0.9]);
  const skillOpacity = useTransform(smoothProgress, [0.75, 0.8, 0.95, 0.98], [0, 1, 1, 0]);
  const skillY = useTransform(smoothProgress, [0.75, 0.85, 0.95, 0.98], [50, 0, 0, -50]);

  const aboutPointerEvents = useTransform(aboutOpacity, (o) => o > 0.5 ? "auto" : "none");
  const recPointerEvents = useTransform(recOpacity, (o) => o > 0.5 ? "auto" : "none");
  const skillPointerEvents = useTransform(skillOpacity, (o) => o > 0.5 ? "auto" : "none");

  return (
    <>
      <div ref={containerRef} className="relative h-[550vh] bg-white dark:bg-black selection:bg-blue-600 selection:text-white transition-colors duration-1000">
      
      {/* 1. HERO - PINNED */}
      <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('hero')} label="Edit Hero Section">
        <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0 bg-white dark:bg-black">
          {/* Decoration Layer */}
          <DecorationLayer 
            isAdmin={isAdmin}
            decorations={heroData?.decorations || []}
            onUpdate={(decs) => updateHero({ decorations: decs })}
          />

          {/* Background Visual Asset */}
          <motion.div 
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {heroData?.bgImageUrl ? (
              <div className="relative w-full h-full">
                <img 
                  src={getDirectLink(heroData.bgImageUrl)} 
                  className="w-full h-full object-cover dark:opacity-40 opacity-20 transition-opacity duration-1000" 
                  alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white dark:from-black/0 dark:via-black/50 dark:to-black" />
              </div>
            ) : null}
          </motion.div>

          <motion.div 
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="relative z-10 flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full px-6"
          >
            <motion.div style={{ opacity: subTitleOpacity, y: subTitleY }} className="space-y-2 md:space-y-4 text-center">
              <span className="text-[10px] md:text-xs font-mono font-medium uppercase tracking-[0.3em] md:tracking-[0.5em] text-blue-600 dark:text-blue-400">
                Personal Headquarters
              </span>
            </motion.div>

            {isAdmin ? (
              <div className="flex flex-col items-center text-center w-full uppercase">
                <EditableText
                  isAdmin={isAdmin}
                  initialValue={heroData?.title1 || "Thrithwaka"}
                  onSave={(val) => updateHero({ title1: val })}
                  className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase"
                  style={{ x: name1X } as any}
                />
                <EditableText
                  isAdmin={isAdmin}
                  initialValue={heroData?.title2 || "Preethi"}
                  onSave={(val) => updateHero({ title2: val })}
                  className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase"
                  style={{ x: name2X } as any}
                />
                <EditableText
                  isAdmin={isAdmin}
                  initialValue={heroData?.title3 || "Shakya"}
                  onSave={(val) => updateHero({ title3: val })}
                  className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase"
                  style={{ x: name3X } as any}
                />
              </div>
            ) : heroData?.title1 ? (
              <div className="flex flex-col items-center text-center w-full uppercase">
                <motion.h1 style={{ x: name1X }} className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase">{heroData.title1}</motion.h1>
                <motion.h1 style={{ x: name2X }} className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase">{heroData.title2}</motion.h1>
                <motion.h1 style={{ x: name3X }} className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase">{heroData.title3}</motion.h1>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center w-full uppercase">
                <motion.h1 style={{ x: name1X }} className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase">Thrithwaka</motion.h1>
                <motion.h1 style={{ x: name2X }} className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase">Preethi</motion.h1>
                <motion.h1 style={{ x: name3X }} className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter text-black dark:text-white uppercase">Shakya</motion.h1>
              </div>
            )}

            <motion.div style={{ opacity: subTitleOpacity }} className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pt-6 md:pt-12">
              <EditableText
                isAdmin={isAdmin}
                initialValue={heroData?.subtitle || 'AI Engineer | Researcher | Innovator'}
                onSave={(val) => updateHero({ subtitle: val })}
                className="text-[10px] md:text-base font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] text-zinc-400 dark:text-zinc-500"
              />
              <div className="hidden md:block w-12 h-px bg-zinc-200 dark:bg-white/10" />
              <EditableText
                isAdmin={isAdmin}
                initialValue={heroData?.ctaText || 'Scroll to Explore'}
                onSave={(val) => updateHero({ ctaText: val })}
                className="text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors animate-pulse text-black dark:text-white"
              />
            </motion.div>
          </motion.div>
        </section>
      </VisualEditorWrapper>

      {/* 2. ABOUT ME - PINNED TRANSITION */}
      <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('about')} label="Edit About Section">
        <motion.section 
          style={{ opacity: aboutOpacity, pointerEvents: aboutPointerEvents as any }}
          className="sticky top-0 h-screen w-full flex items-center justify-center bg-white dark:bg-black z-10 pt-16 lg:pt-0"
        >
          {/* Decoration Layer */}
          <DecorationLayer 
            isAdmin={isAdmin}
            decorations={aboutData?.decorations || []}
            onUpdate={(decs) => updateAbout({ decorations: decs })}
          />

          <motion.div 
            style={{ scale: aboutScale, y: aboutY }}
            className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 items-center pointer-events-auto max-h-[85vh] lg:max-h-none overflow-y-auto no-scrollbar"
          >
            <div className="space-y-4 md:space-y-10">
              <h2 className="text-[10px] md:text-sm font-mono uppercase tracking-[0.3em] text-blue-600">The Mission</h2>
              <EditableText
                isAdmin={isAdmin}
                initialValue={aboutData?.vision || "Pioneer AI. Human Focus."}
                onSave={(val) => updateAbout({ vision: val })}
                className="text-4xl md:text-8xl font-black leading-[0.9] tracking-tighter text-black dark:text-white"
              />
              <EditableText
                isAdmin={isAdmin}
                multiline
                initialValue={aboutData?.missionStatement || "I am a visionary AI Engineer dedicated to crafting systems that not only solve complex problems but redefine how we interact with technology..."}
                onSave={(val) => updateAbout({ missionStatement: val })}
                className="text-base md:text-2xl text-zinc-400 dark:text-zinc-500 leading-tight max-w-2xl font-medium tracking-tight"
              />
              <Link to="/about" className="inline-flex items-center text-[10px] md:text-sm font-bold uppercase tracking-widest h-10 md:h-14 px-6 md:px-10 bg-black dark:bg-white text-white dark:text-black rounded-full hover:scale-105 transition-transform">
                Digital Identity <ChevronRight size={16} className="ml-2" />
              </Link>
            </div>
            
            <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl max-w-sm mx-auto md:ml-auto">
              {aboutData?.profileImageUrl ? (
                <img src={getDirectLink(aboutData.profileImageUrl)} alt="Portrait" className="w-full h-full object-cover transition-all duration-1000 saturate-100" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-800 font-mono text-sm md:text-xl uppercase">Signal_Offline_</div>
              )}
            </div>
          </motion.div>
        </motion.section>
      </VisualEditorWrapper>
      {/* 3. RECOMMENDATIONS - CINEMATIC PINNED */}
      <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('endorsements')} label="Manage Testimonials">
        <motion.section 
          style={{ opacity: recOpacity, pointerEvents: recPointerEvents as any }}
          className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black z-20"
        >
          {/* Decoration Layer */}
          <DecorationLayer 
            isAdmin={isAdmin}
            decorations={aboutData?.decorations || []}
            onUpdate={(decs) => updateAbout({ decorations: decs })}
          />

          <motion.div 
            style={{ scale: recScale, y: recY }}
            className="w-full space-y-8 md:space-y-16 flex flex-col items-center"
          >
            <div className="text-center space-y-2 md:space-y-4 px-6">
              <h2 className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-blue-600">Strategic Validation</h2>
              <h3 className="text-4xl md:text-7xl font-bold tracking-tighter text-black dark:text-white">Professional Trust.</h3>
            </div>

            <div className="relative w-full overflow-hidden py-10">
                <motion.div 
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ 
                    duration: 40, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="flex space-x-6 w-max"
                >
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex space-x-6">
                      {(endorsements?.length > 0 ? endorsements : [
                        { quote: "Thrithwaka's approach to AI is remarkably precise. He doesn't just build models; he builds value.", name: "Dr. Elena Vance", role: "Principal Scientist", company: "MIT Lab" },
                        { quote: "A rare talent who understands the hardware, the software, and the human impact simultaneously.", name: "Marcus Thorne", role: "CTO", company: "Neural systems" },
                        { quote: "The level of engineering polish in his research publications sets a new industry standard.", name: "Sarah Chen", role: "Director of Innovation", company: "DataFlow AI" }
                      ]).map((rec: any, j: number) => {
                        const CardContent = (
                          <div className="inline-block w-[320px] md:w-[450px] p-8 md:p-10 border border-zinc-100 dark:border-white/5 rounded-[2rem] md:rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-xl whitespace-normal h-full">
                            <RichTextRenderer 
                              content={rec.quote} 
                              className="text-lg md:text-xl font-medium leading-relaxed text-zinc-800 dark:text-zinc-200 italic font-serif mb-8" 
                            />
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden cursor-pointer">
                                 {rec.linkedInUrl ? (
                                   <a href={rec.linkedInUrl} target="_blank" rel="noreferrer">
                                     {rec.imageUrl ? <img src={getDirectLink(rec.imageUrl)} alt={rec.name} className="w-full h-full object-cover" /> : <UserIcon size={20} className="w-full h-full p-2 text-zinc-500" />}
                                   </a>
                                 ) : (
                                   rec.imageUrl ? <img src={getDirectLink(rec.imageUrl)} alt={rec.name} className="w-full h-full object-cover" /> : <UserIcon size={20} className="w-full h-full p-2 text-zinc-500" />
                                 )}
                              </div>
                              <div>
                                 {rec.linkedInUrl ? (
                                   <a href={rec.linkedInUrl} target="_blank" rel="noreferrer" className="font-bold text-sm md:text-base text-black dark:text-white hover:text-blue-600 transition-colors block">
                                     {rec.name}
                                   </a>
                                 ) : (
                                   <p className="font-bold text-sm md:text-base text-black dark:text-white">{rec.name}</p>
                                 )}
                                <p className="text-[9px] font-mono uppercase tracking-[0.1em] text-zinc-400">{rec.role} {rec.company ? `@ ${rec.company}` : ''}</p>
                              </div>
                            </div>
                          </div>
                        );

                        return <div key={`${i}-${j}`}>{CardContent}</div>;
                      })}
                    </div>
                  ))}
                </motion.div>
              
              <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
            </div>
          </motion.div>
        </motion.section>
      </VisualEditorWrapper>

      {/* 4. SKILLS - CINEMATIC PINNED */}
      <VisualEditorWrapper isAdmin={isAdmin} onEdit={() => setActiveEditor('toolkit')} label="Manage Toolkit">
        <motion.section 
          style={{ opacity: skillOpacity, pointerEvents: skillPointerEvents as any }}
          className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black z-30"
        >
          {/* Decoration Layer */}
          <DecorationLayer 
            isAdmin={isAdmin}
            decorations={aboutData?.decorations || []}
            onUpdate={(decs) => updateAbout({ decorations: decs })}
          />

          <motion.div 
            style={{ scale: skillScale, y: skillY }}
            className="relative z-10 max-w-7xl mx-auto w-full px-6 space-y-8 md:space-y-12 max-h-[90vh] overflow-y-auto no-scrollbar pointer-events-auto"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-16 border-b border-zinc-100 dark:border-white/5 pb-6 md:pb-10">
              <div className="space-y-2 md:space-y-4">
                <h2 className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 font-black">Toolkit Mastery</h2>
                <h3 className="text-4xl md:text-7xl font-black tracking-tighter text-black dark:text-white leading-[0.85]">Capabilities.</h3>
              </div>
              <p className="text-zinc-400 dark:text-zinc-500 max-w-md text-xs md:text-lg font-medium leading-tight tracking-tight">
                Categorized intelligence systems and strategic frameworks driving global transformation through AI-led innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
              <div className="space-y-6 md:space-y-10">
                <h4 className="text-xl md:text-3xl font-black flex items-center gap-4 text-black dark:text-white uppercase tracking-tighter">
                  <span className="text-blue-600/30 font-mono text-sm md:text-lg">01</span> technical_systems
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {(skills?.filter((s:any) => s.category === 'technical_systems').length > 0 
                    ? skills.filter((s:any) => s.category === 'technical_systems')
                    : [
                        { name: 'Artificial Intelligence' }, 
                        { name: 'Machine Learning' }, 
                        { name: 'NLP' }, 
                        { name: 'Cloud Engineering' }, 
                        { name: 'Full-Stack' }, 
                        { name: 'Cybersecurity' }
                      ]
                  ).map((s: any) => (
                    <motion.div 
                      key={s.name} 
                      whileHover={{ y: -5 }}
                      className="group relative"
                    >
                      <div className="p-6 md:p-8 border border-zinc-100 dark:border-white/5 rounded-[2rem] bg-zinc-50/30 dark:bg-white/[0.01] hover:bg-white dark:hover:bg-white/[0.03] hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500">
                        <span className="text-xs md:text-base font-black tracking-widest uppercase text-zinc-900 dark:text-zinc-100">{s.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 md:space-y-10">
                <h4 className="text-xl md:text-3xl font-black flex items-center gap-4 text-black dark:text-white uppercase tracking-tighter">
                  <span className="text-green-600/30 font-mono text-sm md:text-lg">02</span> strategic_impact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {(skills?.filter((s:any) => s.category === 'strategic_impact').length > 0 
                    ? skills.filter((s:any) => s.category === 'strategic_impact')
                    : [
                        { name: 'Leadership' }, 
                        { name: 'Communication' }, 
                        { name: 'Creativity' }, 
                        { name: 'Strategy' }, 
                        { name: 'Collaboration' }
                      ]
                  ).map((s: any) => (
                    <motion.div 
                      key={s.name} 
                      whileHover={{ y: -5 }}
                      className="group relative"
                    >
                      <div className="p-6 md:p-8 border border-zinc-100 dark:border-white/5 rounded-[2rem] bg-zinc-50/30 dark:bg-white/[0.01] hover:bg-white dark:hover:bg-white/[0.03] hover:shadow-2xl hover:shadow-green-600/5 transition-all duration-500">
                        <span className="text-xs md:text-base font-black tracking-widest uppercase text-zinc-900 dark:text-zinc-100">{s.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </VisualEditorWrapper>
    </div>

    {/* Editor Drawers */}
    <EditorDrawer 
      isOpen={activeEditor === 'hero'} 
      onClose={() => setActiveEditor(null)}
      title="Hero Identity"
    >
      <HeroManager />
    </EditorDrawer>

    <EditorDrawer 
      isOpen={activeEditor === 'about'} 
      onClose={() => setActiveEditor(null)}
      title="About Mission"
    >
      <AboutManager />
    </EditorDrawer>

    <EditorDrawer 
      isOpen={activeEditor === 'endorsements'} 
      onClose={() => setActiveEditor(null)}
      title="Endorsements"
    >
      <EndorsementsManager />
    </EditorDrawer>

    <EditorDrawer 
      isOpen={activeEditor === 'toolkit'} 
      onClose={() => setActiveEditor(null)}
      title="Toolkit Mastery"
    >
      <ToolkitManager />
    </EditorDrawer>

    {/* 5. FOOTER - AFTER PINNED CONTENT */}
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
                    {settings?.researchGateUrl && (
                      <a href={settings.researchGateUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all group">
                        <Globe size={16} className="text-zinc-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">ResearchGate</span>
                      </a>
                    )}
                    {settings?.orcidUrl && (
                      <a href={settings.orcidUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/5 rounded-full hover:bg-zinc-100 dark:hover:bg-white/[0.08] transition-all group">
                        <GraduationCap size={16} className="text-zinc-400 group-hover:text-amber-500 transition-colors" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">ORCID</span>
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

      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-1 bg-blue-600 z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
    </>
  );
}

