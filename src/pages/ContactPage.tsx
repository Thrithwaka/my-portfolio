import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Linkedin, Github, FileText, Send } from 'lucide-react';

export function ContactPage({ isAdmin }: { isAdmin?: boolean }) {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Transmission failed.');
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 md:pt-32 pb-24 px-6 bg-white dark:bg-black min-h-screen">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <div className="space-y-8 md:space-y-12">
          <header className="space-y-4 md:space-y-6">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-blue-600">Final Signal</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] md:leading-tight [text-wrap:balance]">Let's Build the <br className="hidden md:block"/>Future Together.</h1>
            <p className="text-base md:text-xl text-zinc-500 dark:text-zinc-400 max-w-xl">Available for high-impact research collaborations and strategic executive engineering projects.</p>
          </header>

          <div className="space-y-4 md:space-y-6">
            {[
              { label: 'Primary Contact', val: 'thrithwakapreethi57@gmail.com', icon: Mail, link: 'mailto:thrithwakapreethi57@gmail.com' },
              { label: 'LinkedIn Professional', val: 'LinkedIn Profile', icon: Linkedin, link: '#' },
              { label: 'Identity Repository', val: 'Github Source', icon: Github, link: '#' },
              { label: 'Executive Portfolio', val: 'Download Resume', icon: FileText, link: '#' },
            ].map(item => (
              <a 
                key={item.label}
                href={item.link}
                className="flex items-center p-4 md:p-6 border border-zinc-100 dark:border-white/5 rounded-2xl md:rounded-3xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-100 dark:bg-white/5 rounded-xl flex items-center justify-center mr-4 md:mr-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <item.icon size={18} className="md:size-[20px]" />
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-zinc-400">{item.label}</p>
                  <p className="text-base md:text-lg font-bold group-hover:text-blue-600 transition-colors">{item.val}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12 border border-zinc-100 dark:border-white/5 rounded-3xl md:rounded-[4rem] bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-3xl space-y-6 md:space-y-8 flex flex-col justify-center">
           {submitted ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-center space-y-6 py-12"
             >
               <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
                 <Send size={40} className="text-white" />
               </div>
               <h3 className="text-3xl font-bold tracking-tight">Signal Transmitted</h3>
               <p className="text-zinc-500 dark:text-zinc-400">Your message has been decrypted and sent to my inbox. I will analyze the contents and respond shortly.</p>
               <Button 
                 variant="outline" 
                 onClick={() => setSubmitted(false)}
                 className="rounded-full px-8 h-12 mt-4"
               >
                 Send Another Message
               </Button>
             </motion.div>
           ) : (
             <>
               <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Direct Message</h3>
               <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Your Identity</label>
                     <Input 
                       className="h-12 md:h-14 bg-white dark:bg-zinc-900 border-none rounded-xl md:rounded-2xl" 
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
                       className="h-12 md:h-14 bg-white dark:bg-zinc-900 border-none rounded-xl md:rounded-2xl" 
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
                     className="min-h-[150px] md:min-h-[200px] bg-white dark:bg-zinc-900 border-none rounded-xl md:rounded-2xl resize-none" 
                     placeholder="How can we innovate together?"
                     required
                     value={formData.message}
                     onChange={e => setFormData({ ...formData, message: e.target.value })}
                   />
                 </div>
                 <Button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="w-full h-14 md:h-16 bg-blue-600 text-white hover:bg-blue-700 text-base md:text-lg font-bold rounded-xl md:rounded-2xl shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isSubmitting ? 'Transmitting...' : (
                     <>Transmit Message <Send size={18} className="ml-2" /></>
                   )}
                 </Button>
               </form>
             </>
           )}
        </div>
      </div>
    </main>
  );
}
