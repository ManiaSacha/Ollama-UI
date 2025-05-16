import React, { useState } from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import { useOllama } from './hooks/useOllama';
import { useDarkMode } from './hooks/useDarkMode';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { 
    messages, 
    isGenerating, 
    error,
    generateResponse, 
    stopGeneration,
    clearMessages
  } = useOllama();
  
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
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
        />
      </main>
    </div>
  );
}

export default App;