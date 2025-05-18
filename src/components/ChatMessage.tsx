import React, { useEffect, useRef, useState } from 'react';
import { User, Bot, Wand2, Edit2, Trash2, Save, X } from 'lucide-react';
import { Message } from '../types';
import ImageGeneration from './ImageGeneration';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
  autoSpeak?: boolean;
  speak?: (text: string) => void;
  onImageGenerated?: (messageId: string, imageData: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, autoSpeak, speak, onImageGenerated, onEditMessage, onDeleteMessage }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showImageGeneration, setShowImageGeneration] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showMenu, setShowMenu] = useState(false);
  
  // Check if message content suggests image modification
  const suggestsImageModification = message.role === 'assistant' && (
    message.content.includes('image with') ||
    message.content.includes('modified image') ||
    message.content.includes('changed image') ||
    message.content.includes('edited image') ||
    message.content.includes('generated image') ||
    message.content.includes('create an image') ||
    (message.content.includes('<start_of_image>') && message.content.includes('</start_of_image>'))
  );
  
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
            {/* Edit/Delete menu for user messages */}
            {message.role === 'user' && (onEditMessage || onDeleteMessage) && (
              <div className="relative ml-2">
                <button
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                  onClick={() => setShowMenu((v) => !v)}
                  aria-label="Show message actions"
                >
                  <Edit2 className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded z-10">
                    <button
                      className="flex items-center px-3 py-2 w-full hover:bg-slate-100 dark:hover:bg-slate-700 text-sm"
                      onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </button>
                    <button
                      className="flex items-center px-3 py-2 w-full hover:bg-red-100 dark:hover:bg-red-800 text-sm text-red-600 dark:text-red-400"
                      onClick={() => onDeleteMessage && onDeleteMessage(message.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message content (with markdown/code support and editing) */}
          <div ref={contentRef} className="text-sm whitespace-pre-wrap break-words">
            {/* Display image if present */}
            {message.image && (
              <div className="mb-2 max-w-xs">
                <img
                  src={message.image.url}
                  alt={message.image.alt}
                  className="rounded-md max-w-full max-h-64 border border-slate-200 dark:border-slate-700"
                />
              </div>
            )}

            {/* Editing mode */}
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full rounded border p-2 text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                  rows={Math.max(2, editContent.split('\n').length)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    className="flex items-center px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs"
                    onClick={() => {
                      setIsEditing(false);
                      if (onEditMessage) onEditMessage(message.id, editContent);
                    }}
                  >
                    <Save className="h-3 w-3 mr-1" /> Save
                  </button>
                  <button
                    className="flex items-center px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs"
                    onClick={() => { setIsEditing(false); setEditContent(message.content); }}
                  >
                    <X className="h-3 w-3 mr-1" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              message.content ? (
                <ReactMarkdown
                  children={message.content}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                />
              ) : (
                <span className="text-slate-500 dark:text-slate-400 italic">
                  Generating...
                </span>
              )
            )}

            {/* Image generation button for assistant messages that suggest image modifications */}
            {suggestsImageModification && !showImageGeneration && (
              <div className="mt-3">
                <button
                  onClick={() => setShowImageGeneration(true)}
                  className="flex items-center px-3 py-1.5 text-xs rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
                >
                  <Wand2 className="h-3.5 w-3.5 mr-1.5" />
                  Visualize this image
                </button>
              </div>
            )}

            {/* Image generation component */}
            {showImageGeneration && (
              <div className="mt-4">
                <ImageGeneration
                  inputImage={message.image?.url}
                  prompt={message.content}
                  onImageGenerated={(imageData) => {
                    if (onImageGenerated) {
                      onImageGenerated(message.id, imageData);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;