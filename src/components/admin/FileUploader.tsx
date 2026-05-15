import React, { useState } from 'react';
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

    const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError('Cloudinary configuration missing.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const p = Math.round((event.loaded / event.total) * 100);
        setProgress(p);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        onUploadComplete(response.secure_url);
        setProgress(0);
      } else {
        const response = JSON.parse(xhr.responseText);
        setError(response.error?.message || 'Upload failed.');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Network error during upload.');
    };

    xhr.send(formData);
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
