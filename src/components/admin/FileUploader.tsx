import React, { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Loader2, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
}

export function FileUploader({ onUploadComplete, folder = 'uploads', accept = 'image/*,video/*', label = 'Upload Media' }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(p));
      },
      (err) => {
        console.error('Upload error:', err);
        setError('Upload failed. Please try again.');
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadURL);
          setUploading(false);
          setProgress(0);
        } catch (err) {
          console.error('Error getting download URL:', err);
          setError('Failed to retrieve file URL.');
          setUploading(false);
        }
      }
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative group">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
        <div className={`
          flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[2rem] transition-all
          ${uploading ? 'bg-blue-600/10 border-blue-600/50' : 'bg-black/40 border-white/5 group-hover:border-blue-500/50 group-hover:bg-blue-600/5'}
        `}>
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-600">
                  {progress}%
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600 animate-pulse">
                Transferring Data...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Upload className="text-zinc-400 group-hover:text-white" size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white uppercase tracking-tight">{label}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Drag & Drop or Click to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
