import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '@/src/hooks/useContent';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Menu, X, ChevronDown, ExternalLink, Sun, Moon } from 'lucide-react';

export function Navbar({ user, isAdmin: isGlobalAdmin }: { user: User | null; isAdmin?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { data: settings } = useContent<any>('settings/global');
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      // For cinematic home and about, show navbar after hero starts clearing (~20% of viewport)
      const threshold = (location.pathname === '/' || location.pathname === '/about') ? window.innerHeight * 0.2 : 50;
      setIsScrolled(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Check initially
    handleScroll();
    if (document.documentElement.classList.contains('light')) {
      setTheme('light');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Me', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  const blogLinks = [
    { name: 'Medium', href: settings?.mediumUrl || 'https://medium.com/@wisecxai', icon: ExternalLink },
    { name: 'ResearchGate', href: settings?.researchGateUrl || '#', icon: ExternalLink },
    { name: 'ORCID', href: settings?.orcidUrl || '#', icon: ExternalLink },
    { name: 'Google Scholar', href: settings?.scholarUrl || 'https://scholar.google.com/', icon: ExternalLink },
  ];

  // Secret admin access shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        window.location.href = user ? '/admin/dashboard' : '/admin/login';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  const handleNavLinkClick = (href: string) => {
    setIsOpen(false);
    if (location.pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <AnimatePresence>
        {(isScrolled || isAdminPath) && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 py-4"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
              <Link to="/" onClick={() => handleNavLinkClick('/')} className="text-lg font-bold tracking-tighter flex items-center group">
                <span className="text-black dark:text-white transition-opacity group-hover:opacity-60">TPS.</span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center space-x-10">
                {!isAdminPath && navLinks.map(link => (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    onClick={() => handleNavLinkClick(link.href)}
                    className={`text-xs font-medium uppercase tracking-[0.1em] transition-all hover:text-blue-600 dark:hover:text-blue-400 ${
                      location.pathname === link.href ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Blogs Dropdown */}
                {!isAdminPath && (
                  <div className="relative group" onMouseEnter={() => setIsBlogOpen(true)} onMouseLeave={() => setIsBlogOpen(false)}>
                    <button className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-400 flex items-center group-hover:text-black dark:group-hover:text-white transition-colors text-left uppercase">
                      Blogs <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${isBlogOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isBlogOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full right-0 w-48 mt-4 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-3xl overflow-hidden"
                        >
                          {blogLinks.map(blog => (
                            <a 
                              key={blog.name} 
                              href={blog.href} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center justify-between px-4 py-3 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all"
                            >
                              {blog.name}
                              <blog.icon size={12} className="opacity-50" />
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {isGlobalAdmin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                
                {user ? (
                  <div className="flex items-center space-x-6 pl-8 border-l border-zinc-200 dark:border-white/10">
                    <button 
                      onClick={() => signOut(auth)}
                      className="text-xs font-medium uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                    >
                      Exit
                    </button>
                    <button 
                      onClick={toggleTheme}
                      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors text-zinc-900 dark:text-white"
                    >
                      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={toggleTheme}
                      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors text-zinc-900 dark:text-white"
                    >
                      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Toggle */}
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-zinc-900 dark:text-white">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white dark:bg-black z-[110] flex flex-col p-12"
          >
             <div className="flex justify-between items-center mb-16">
               <span className="text-xl font-bold tracking-tighter">TPS.</span>
               <button onClick={() => setIsOpen(false)}><X size={32} /></button>
             </div>
             <div className="space-y-8">
               {navLinks.map(link => (
                 <Link 
                   key={link.name} 
                   to={link.href} 
                   onClick={() => handleNavLinkClick(link.href)}
                   className="block text-4xl font-bold tracking-tight text-zinc-900 dark:text-white"
                 >
                   {link.name}
                 </Link>
               ))}
               <div className="space-y-4 pt-8">
                 <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Thought Leadership</p>
                 {blogLinks.map(blog => (
                   <a 
                     key={blog.name} 
                     href={blog.href} 
                     target="_blank" 
                     rel="noreferrer"
                     className="block text-2xl font-bold text-blue-600"
                   >
                     {blog.name}
                   </a>
                 ))}
               </div>
             </div>
             <div className="mt-auto space-y-6">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={toggleTheme}
                    className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white flex items-center gap-3 font-bold text-sm uppercase tracking-widest"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  
                  {user && (
                    <button 
                      onClick={() => signOut(auth)}
                      className="text-sm font-bold uppercase tracking-widest text-red-500"
                    >
                      Exit System
                    </button>
                  )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
