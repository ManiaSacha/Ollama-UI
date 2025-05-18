import { useState, useRef } from 'react';
import { Wand2, Settings, Image as ImageIcon, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { 
  generateImage, 
  modifyImage, 
  ImageGenerationConfig, 
  defaultConfig,
  testConnection
} from '../utils/imageGeneration';

interface ImageGenerationProps {
  inputImage?: string;
  prompt: string;
  onImageGenerated: (imageData: string) => void;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({
  inputImage,
  prompt,
  onImageGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<ImageGenerationConfig>(defaultConfig);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  const downloadRef = useRef<HTMLAnchorElement>(null);
  
  // Handle image generation
  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please provide a prompt for image generation');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      let response;
      
      if (inputImage) {
        // Modify existing image
        response = await modifyImage(inputImage, prompt, config);
      } else {
        // Generate new image
        response = await generateImage({ prompt }, config);
      }
      
      if (response.images && response.images.length > 0) {
        const imageData = response.images[0];
        setGeneratedImage(imageData);
        onImageGenerated(imageData);
      } else {
        setError('No images were generated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating image');
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle downloading the generated image
  const handleDownload = () => {
    if (!generatedImage) return;
    
    // Create a download link
    const link = downloadRef.current;
    if (link) {
      // Create a timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.href = generatedImage;
      link.download = `generated-image-${timestamp}.png`;
      link.click();
    }
  };
  
  // Test connection to the image generation server
  const handleTestConnection = async () => {
    setIsConnected(null);
    try {
      const connected = await testConnection(config);
      setIsConnected(connected);
    } catch (err) {
      setIsConnected(false);
      console.error('Connection test error:', err);
    }
  };
  
  // Update configuration
  const handleConfigChange = (field: keyof ImageGenerationConfig, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
      {/* Settings toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-slate-800 dark:text-white">
          Image Generation
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
          title="Settings"
        >
          <Settings className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="mb-4 p-3 border rounded-md bg-slate-50 dark:bg-slate-700/50">
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Server Type
            </label>
            <select
              value={config.serverType}
              onChange={(e) => handleConfigChange('serverType', e.target.value as any)}
              className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              <option value="stable-diffusion">Stable Diffusion</option>
              <option value="comfyui">ComfyUI</option>
              <option value="automatic1111">Automatic1111</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Server URL
            </label>
            <input
              type="text"
              value={config.serverUrl}
              onChange={(e) => handleConfigChange('serverUrl', e.target.value)}
              placeholder="http://localhost:7860"
              className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              API Key (if required)
            </label>
            <input
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="Leave blank if not required"
              className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            />
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handleTestConnection}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-600 rounded-md text-sm flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Test Connection
            </button>
            
            {isConnected !== null && (
              <span className={`text-sm ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isConnected ? 'Connected successfully' : 'Connection failed'}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Preview area */}
      <div className="mb-4">
        {inputImage && (
          <div className="mb-2">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Input Image:</p>
            <div className="border rounded-md overflow-hidden">
              <img 
                src={inputImage} 
                alt="Input" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        )}
        
        {generatedImage && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-slate-600 dark:text-slate-400">Generated Image:</p>
              <button
                onClick={handleDownload}
                className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400"
                title="Download image"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="border rounded-md overflow-hidden">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Prompt display */}
      <div className="mb-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">Prompt:</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 italic">{prompt || 'No prompt provided'}</p>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className={`
            flex items-center px-4 py-2 rounded-md 
            ${isGenerating || !prompt
              ? 'bg-slate-300 text-slate-500 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
            }
          `}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : inputImage ? (
            <>
              <ImageIcon className="h-4 w-4 mr-2" />
              Modify Image
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Image
            </>
          )}
        </button>
        
        {/* Hidden download link */}
        <a ref={downloadRef} className="hidden" />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm flex items-start">
          <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageGeneration;
