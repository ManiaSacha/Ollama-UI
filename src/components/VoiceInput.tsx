import React, { useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    isSpeechSupported,
  } = useSpeechRecognition();

  // Update parent component with transcript when it changes
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  if (!isSpeechSupported) {
    return (
      <button
        disabled
        className="inline-flex items-center text-sm py-1 px-2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
        title="Speech recognition not supported in this browser"
      >
        <MicOff className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`
          inline-flex items-center text-sm py-1 px-2 rounded-md transition-colors
          ${isListening 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse' 
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'}
        `}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <Mic className="h-4 w-4 text-red-500" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>
      
      {error && (
        <div className="absolute left-0 top-full mt-1 text-xs text-red-500 whitespace-nowrap">
          {error}
        </div>
      )}
      
      {isListening && (
        <div className="absolute left-0 top-full mt-1 text-xs text-green-500 whitespace-nowrap">
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceInput;