import React, { useState, useRef, ChangeEvent } from 'react';
import { FileText, Upload, Check, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileContent: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileContent }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      setStatus('error');
      setError('Only .txt and .md files are supported');
      return;
    }
    
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setStatus('error');
      setError('File size must be less than 2MB');
      return;
    }
    
    try {
      const text = await file.text();
      setFileName(file.name);
      setStatus('success');
      setError(null);
      onFileContent(text);
    } catch (err) {
      setStatus('error');
      setError('Error reading file');
      console.error('Error reading file:', err);
    }
  };
  
  const clearFile = () => {
    setFileName(null);
    setStatus('idle');
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className="relative">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept=".txt,.md"
        onChange={handleFileChange}
      />
      
      {fileName ? (
        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={clearFile}
            className="py-1 px-2 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <FileText className="h-4 w-4 mr-1" />
            <span className="truncate max-w-[150px]">{fileName}</span>
            {status === 'success' && <Check className="h-4 w-4 ml-1 text-green-500" />}
            {status === 'error' && <AlertCircle className="h-4 w-4 ml-1 text-red-500" />}
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="inline-flex items-center text-sm py-1 px-3 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload File
        </button>
      )}
      
      {error && (
        <div className="absolute left-0 top-full mt-1 text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;