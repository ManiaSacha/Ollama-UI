import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message, ModelType } from '../types';
import { ExternalLink, Trash2 } from 'lucide-react';

interface ChatProps {
  messages: Message[];
  isGenerating: boolean;
  error: string | null;
  onSendMessage: (message: string, model: ModelType, temperature: number, compareMode: boolean) => void;
  onStopGeneration: () => void;
  onClearMessages: () => void;
  ttsEnabled: boolean;
  toggleTTS: () => void;
  speak: (text: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  isGenerating,
  error,
  onSendMessage,
  onStopGeneration,
  onClearMessages,
  ttsEnabled,
  toggleTTS,
  speak,
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Chat
          </h2>
          
          <div className="flex items-center space-x-2">
            <a
              href="http://localhost:11434"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
            >
              Ollama API
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            
            <button
              onClick={onClearMessages}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800/50"
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 max-w-md rounded-lg bg-white dark:bg-slate-800 shadow-md">
                <h3 className="text-lg font-medium mb-2 text-slate-800 dark:text-white">
                  Welcome to Ollama Chat
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  This app connects to your local Ollama server to interact with LLMs.
                  Try asking a question to get started!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Make sure your Ollama server is running at http://localhost:11434
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                autoSpeak={ttsEnabled}
                speak={speak}
              />
            ))
          )}
          
          {/* Error message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4 rounded">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Error: {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input area */}
      <ChatInput
        onSendMessage={onSendMessage}
        onStopGeneration={onStopGeneration}
        isGenerating={isGenerating}
        ttsEnabled={ttsEnabled}
        toggleTTS={toggleTTS}
      />
    </div>
  );
};

export default Chat;