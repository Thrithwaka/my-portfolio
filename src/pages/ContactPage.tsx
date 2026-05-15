import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Linkedin, Github, FileText, Send } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from Portfolio: ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:thrithwakapreethi57@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="pt-32 pb-24 px-6 bg-white dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <header className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.4em] text-blue-600">Final Signal</span>
            <h1 className="text-7xl font-bold tracking-tighter leading-tight">Let's Build the <br/>Future Together.</h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400">Available for high-impact research collaborations and strategic executive engineering projects.</p>
          </header>

          <div className="space-y-6">
            {[
              { label: 'Primary Contact', val: 'thrithwakapreethi57@gmail.com', icon: Mail, link: 'mailto:thrithwakapreethi57@gmail.com' },
              { label: 'LinkedIn Professional', val: 'LinkedIn Profile', icon: Linkedin, link: '#' },
              { label: 'Identity Repository', val: 'Github Source', icon: Github, link: '#' },
              { label: 'Executive Portfolio', val: 'Download Resume', icon: FileText, link: '#' },
            ].map(item => (
              <a 
                key={item.label}
                href={item.link}
                className="flex items-center p-6 border border-zinc-100 dark:border-white/5 rounded-3xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-xl flex items-center justify-center mr-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">{item.label}</p>
                  <p className="text-lg font-bold group-hover:text-blue-600 transition-colors">{item.val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="p-12 border border-zinc-100 dark:border-white/5 rounded-[4rem] bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-3xl space-y-8">
           <h3 className="text-3xl font-bold tracking-tight">Direct Message</h3>
           <form className="space-y-6" onSubmit={handleSubmit}>
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Your Identity</label>
                 <Input 
                   className="h-14 bg-white dark:bg-zinc-900 border-none rounded-2xl" 
                   placeholder="E.g. Elon Musk"
                   required
                   value={formData.name}
                   onChange={e => setFormData({ ...formData, name: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Signal Source</label>
                 <Input 
                   type="email"
                   className="h-14 bg-white dark:bg-zinc-900 border-none rounded-2xl" 
                   placeholder="Email Address"
                   required
                   value={formData.email}
                   onChange={e => setFormData({ ...formData, email: e.target.value })}
                 />
               </div>
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">The Message</label>
               <Textarea 
                 className="min-h-[200px] bg-white dark:bg-zinc-900 border-none rounded-2xl resize-none" 
                 placeholder="How can we innovate together?"
                 required
                 value={formData.message}
                 onChange={e => setFormData({ ...formData, message: e.target.value })}
               />
             </div>
             <Button 
               type="submit" 
               className="w-full h-16 bg-blue-600 text-white hover:bg-blue-700 text-lg font-bold rounded-2xl shadow-xl shadow-blue-500/20"
             >
               Transmit Message <Send size={18} className="ml-2" />
             </Button>
           </form>
        </div>
      </div>
    </main>
  );
}
