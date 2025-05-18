import { useState, useEffect } from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import { useOllama } from './hooks/useOllama';
import { useDarkMode } from './hooks/useDarkMode';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { testConnection } from './utils/imageGeneration';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { 
    messages, 
    isGenerating, 
    error,
    generateResponse, 
    stopGeneration,
    clearMessages,
    updateMessage,
    deleteMessage
  } = useOllama();
  
  // State for image generation server status
  const [imageServerStatus, setImageServerStatus] = useState<boolean | null>(null);
  
  const { 
    speak, 
    stop: stopSpeaking,
    isSynthesisSupported 
  } = useSpeechSynthesis();
  
  const [ttsEnabled, setTtsEnabled] = useState(false);
  
  const toggleTTS = () => {
    if (!isSynthesisSupported) return;
    
    if (ttsEnabled) {
      stopSpeaking();
    }
    setTtsEnabled(!ttsEnabled);
  };
  
  // Check image generation server status on startup
  useEffect(() => {
    const checkImageServer = async () => {
      try {
        const status = await testConnection();
        setImageServerStatus(status);
        console.log('Image generation server status:', status ? 'Connected' : 'Not connected');
      } catch (err) {
        setImageServerStatus(false);
        console.error('Error checking image server:', err);
      }
    };
    
    checkImageServer();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="h-[calc(100vh-4rem)]">
        <Chat
          messages={messages}
          isGenerating={isGenerating}
          error={error}
          onSendMessage={generateResponse}
          onStopGeneration={stopGeneration}
          onClearMessages={clearMessages}
          ttsEnabled={ttsEnabled && isSynthesisSupported}
          toggleTTS={toggleTTS}
          speak={speak}
          onUpdateMessage={updateMessage}
          onDeleteMessage={deleteMessage}
        />
        
        {/* Image generation server status indicator (only visible in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-2 right-2 text-xs px-2 py-1 rounded-md opacity-70 hover:opacity-100 transition-opacity
            ${imageServerStatus === true ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
              imageServerStatus === false ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
              'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'}"
          >
            Image Server: {imageServerStatus === true ? 'Connected' : 
                          imageServerStatus === false ? 'Not Connected' : 
                          'Checking...'}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;