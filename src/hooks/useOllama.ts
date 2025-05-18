import { useState, useCallback, useRef } from 'react';
import { generateStream, parseStream } from '../utils/api';
import { ChatState, Message, ModelType, OllamaResponse } from '../types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

export const useOllama = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isGenerating: false,
    error: null,
    activeModelStreams: {},
  });
  
  // Keeps track of all active stream controllers for cancellation
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  // Add a new user message to the chat
  const addUserMessage = useCallback((content: string, imageData?: string, imageName?: string) => {
    const message: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    
    // Add image data if provided
    if (imageData) {
      message.image = {
        url: imageData,
        alt: imageName || 'Uploaded image'
      };
    }
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
    
    return message;
  }, []);

  // Start a response stream from the model
  const generateResponse = useCallback(async (
    prompt: string, 
    model: ModelType = 'llama2', 
    temperature: number = 0.7,
    compareMode: boolean = false,
    imageData?: string,
    imageName?: string
  ) => {
    // If already generating and not in compare mode, cancel previous generation
    if (state.isGenerating && !compareMode) {
      stopGeneration();
    }
    
    // Add user message and get its reference (though we don't need to use it directly)
    addUserMessage(prompt, imageData, imageName);
    
    // Create models array - either just the selected model or all models for compare mode
    const models: ModelType[] = compareMode 
      ? ['llama2', 'mistral', 'codellama'] 
      : [model];
    
    // For each model, create an assistant message and start a stream
    for (const modelName of models) {
      const messageId = generateId();
      
      // Add empty assistant message that will be filled by the stream
      setState(prev => ({
        ...prev,
        isGenerating: true,
        error: null,
        messages: [
          ...prev.messages,
          {
            id: messageId,
            role: 'assistant',
            content: '',
            model: modelName,
            timestamp: Date.now(),
          },
        ],
        activeModelStreams: {
          ...prev.activeModelStreams,
          [messageId]: null, // Will be set once stream starts
        },
      }));

      try {
        // Create abort controller for this stream
        const abortController = new AbortController();
        abortControllersRef.current[messageId] = abortController;
        
        // Update state with the abort controller
        setState(prev => ({
          ...prev,
          activeModelStreams: {
            ...prev.activeModelStreams,
            [messageId]: abortController,
          },
        }));

        // Process image data if present (remove data URL prefix)
        let processedImageData: string | undefined;
        if (imageData) {
          // Check if it's a data URL and extract the base64 part
          if (imageData.startsWith('data:')) {
            // Format: data:[<mediatype>][;base64],<data>
            const base64Data = imageData.split(',')[1];
            processedImageData = base64Data;
          } else {
            processedImageData = imageData;
          }
        }
        
        // Start the stream
        const stream = await generateStream(
          {
            model: modelName,
            prompt,
            images: processedImageData ? [processedImageData] : undefined,
            options: { temperature },
          },
          abortController.signal
        );

        // Parse and process the stream
        let fullResponse = '';
        for await (const chunk of parseStream(stream)) {
          const response = chunk as OllamaResponse;
          fullResponse += response.response;
          
          // Update message content with the latest chunk
          setState(prev => ({
            ...prev,
            messages: prev.messages.map(m => 
              m.id === messageId 
                ? { ...m, content: fullResponse }
                : m
            ),
          }));
          
          // If the response is done, mark it as complete
          if (response.done) {
            delete abortControllersRef.current[messageId];
            
            setState(prev => {
              const newActiveStreams = { ...prev.activeModelStreams };
              delete newActiveStreams[messageId];
              
              return {
                ...prev,
                isGenerating: Object.keys(newActiveStreams).length > 0,
                activeModelStreams: newActiveStreams,
              };
            });
          }
        }
      } catch (error) {
        console.error(`Error generating response for ${modelName}:`, error);
        
        // If it's not an abort error, show the error to the user
        if (error instanceof Error && error.message !== 'Request was aborted') {
          setState(prev => ({
            ...prev,
            error: `Error with ${modelName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            isGenerating: Object.keys(prev.activeModelStreams).length > 1, // Keep generating if there are other active streams
          }));
        }
        
        // Clean up aborted stream
        delete abortControllersRef.current[messageId];
        setState(prev => {
          const newActiveStreams = { ...prev.activeModelStreams };
          delete newActiveStreams[messageId];
          
          return {
            ...prev,
            activeModelStreams: newActiveStreams,
            isGenerating: Object.keys(newActiveStreams).length > 0,
          };
        });
      }
    }
  }, [state.isGenerating, addUserMessage]);

  // Stop all active generation streams
  const stopGeneration = useCallback(() => {
    // Abort all active controllers
    Object.values(abortControllersRef.current).forEach(controller => {
      controller.abort();
    });
    
    // Clear the controllers
    abortControllersRef.current = {};
    
    setState(prev => ({
      ...prev,
      isGenerating: false,
      activeModelStreams: {},
    }));
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    stopGeneration();
    setState(prev => ({
      ...prev,
      messages: [],
    }));
  }, [stopGeneration]);

  // Update an existing message
  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(message => 
        message.id === messageId 
          ? { ...message, ...updates }
          : message
      ),
    }));
  }, []);

  // Delete a message by id
  const deleteMessage = useCallback((messageId: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(message => message.id !== messageId),
    }));
  }, []);

  return {
    messages: state.messages,
    isGenerating: state.isGenerating,
    error: state.error,
    generateResponse,
    stopGeneration,
    clearMessages,
    updateMessage,
    deleteMessage,
  };
};