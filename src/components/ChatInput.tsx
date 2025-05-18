import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, StopCircle, Volume2, VolumeX } from 'lucide-react';
import TemperatureControl from './TemperatureControl';
import ModelSelector from './ModelSelector';
import FileUpload from './FileUpload';
import ImageUpload from './ImageUpload';
import VoiceInput from './VoiceInput';
import { ModelType } from '../types';

interface ChatInputProps {
  onSendMessage: (
    message: string, 
    model: ModelType, 
    temperature: number, 
    compareMode: boolean,
    imageData?: string,
    imageName?: string
  ) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  ttsEnabled: boolean;
  toggleTTS: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopGeneration,
  isGenerating,
  ttsEnabled,
  toggleTTS,
}) => {
  const [message, setMessage] = useState('');
  const [model, setModel] = useState<ModelType>('llama2');
  const [temperature, setTemperature] = useState(0.7);
  const [compareMode, setCompareMode] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() || imageData) {
      onSendMessage(
        message.trim(), 
        model, 
        temperature, 
        compareMode, 
        imageData || undefined, 
        imageName || undefined
      );
      setMessage('');
      setImageData(null);
      setImageName(null);
      
      // Reset height after clearing
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Handle Enter key to send (with Shift+Enter for new line)
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file upload
  const handleFileContent = (content: string) => {
    setMessage((prev) => prev + (prev ? '\n\n' : '') + content);
  };
  
  // Handle image upload
  const handleImageUpload = (imageData: string, fileName: string) => {
    setImageData(imageData);
    setImageName(fileName);
  };
  
  // Clear image
  const handleClearImage = () => {
    setImageData(null);
    setImageName(null);
  };

  // Handle voice input
  const handleTranscript = (transcript: string) => {
    setMessage(transcript);
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-4">
          <ModelSelector 
            selectedModel={model}
            setSelectedModel={setModel}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
          />
          
          <div className="w-48">
            <TemperatureControl 
              temperature={temperature}
              setTemperature={setTemperature}
            />
          </div>
        </div>
        
        {/* Input area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full p-3 pr-16 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
            disabled={isGenerating}
          />
          
          {/* Button row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <FileUpload onFileContent={handleFileContent} />
              <ImageUpload 
                onImageUpload={handleImageUpload} 
                onClearImage={handleClearImage}
                hasImage={!!imageData}
              />
              <VoiceInput onTranscript={handleTranscript} />
              
              <button
                onClick={toggleTTS}
                className="inline-flex items-center text-sm py-1 px-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                title={ttsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
              >
                {ttsEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div>
              {isGenerating ? (
                <button
                  onClick={onStopGeneration}
                  className="inline-flex items-center justify-center p-2 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                >
                  <StopCircle className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() && !imageData}
                  className={`
                    inline-flex items-center justify-center p-2 rounded-md 
                    ${message.trim() || imageData
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' 
                      : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'}
                    transition-colors
                  `}
                >
                  <Send className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;