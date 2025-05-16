import React, { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  autoSpeak?: boolean;
  speak?: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, autoSpeak, speak }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Format the timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Auto-speak assistant messages when they're fully loaded
  useEffect(() => {
    if (
      message.role === 'assistant' && 
      message.content && 
      !message.content.endsWith('...') && 
      autoSpeak && 
      speak
    ) {
      speak(message.content);
    }
  }, [message, autoSpeak, speak]);

  return (
    <div 
      className={`flex w-full mb-4 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div 
        className={`
          flex max-w-[80%] rounded-lg p-3 
          ${message.role === 'user' 
            ? 'bg-indigo-100 dark:bg-indigo-900/40 text-slate-800 dark:text-white ml-auto' 
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'}
          ${message.model ? 'relative' : ''}
        `}
      >
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3">
          {message.role === 'user' ? (
            <div className="bg-indigo-500 p-1 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
          ) : (
            <div className="bg-emerald-500 p-1 rounded-full">
              <Bot className="h-5 w-5 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          {/* Message header */}
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">
              {message.role === 'user' ? 'You' : 'Assistant'}
              {message.model && ` (${message.model})`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
              {formattedTime}
            </span>
          </div>
          
          {/* Message content */}
          <div 
            ref={contentRef}
            className="text-sm whitespace-pre-wrap break-words"
          >
            {message.content || (
              <span className="text-slate-500 dark:text-slate-400 italic">
                Generating...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;