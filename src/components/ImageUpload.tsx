import { useState, useRef, ChangeEvent } from 'react';
import { Image, X, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageData: string, fileName: string) => void;
  onClearImage: () => void;
  hasImage: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUpload, 
  onClearImage,
  hasImage 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPreviewUrl(result);
          setError(null);
          onImageUpload(result, file.name);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error reading image file');
      console.error('Error reading image file:', err);
    }
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClearImage();
  };
  
  return (
    <div className="relative">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {previewUrl ? (
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <button
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="w-12 h-12 rounded-md overflow-hidden border border-slate-300 dark:border-slate-600">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClick}
          disabled={hasImage}
          className={`
            inline-flex items-center text-sm py-1 px-3 rounded-md 
            ${hasImage 
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed' 
              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
            } 
            transition-colors
          `}
          title={hasImage ? 'Remove current image first' : 'Upload an image'}
        >
          <Image className="h-4 w-4 mr-1" />
          Image
        </button>
      )}
      
      {error && (
        <div className="absolute left-0 top-full mt-1 text-xs text-red-500 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
