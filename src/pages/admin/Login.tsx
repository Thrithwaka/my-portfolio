import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-In is not enabled in your Firebase Console. Please enable it in the Authentication tab.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site or open in a new tab.');
      } else {
        setError(err.message || 'Signal synchronization failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black p-6">
      <div className="max-w-md w-full p-12 border border-zinc-100 dark:border-white/5 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-950/50 backdrop-blur-3xl text-center space-y-10 shadow-2xl">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black text-4xl font-bold flex items-center justify-center rounded-3xl mx-auto shadow-xl">
            T
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Access Portal</h1>
          <p className="text-zinc-500 text-sm font-medium">Synchronizing with the executive digital headquarters.</p>
        </div>
        
        {error && <p className="text-red-500 text-xs font-mono bg-red-500/5 py-4 rounded-2xl">{error}</p>}
        
        <Button 
          onClick={handleLogin} 
          disabled={loading}
          className="w-full h-16 bg-blue-600 text-white hover:bg-blue-700 text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Continue with Google'}
        </Button>
        
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Authorized Access Only. Signal Encrypted.</p>
      </div>
    </div>
  );
}
