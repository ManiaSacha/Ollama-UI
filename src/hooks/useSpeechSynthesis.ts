import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeechSynthesisHook {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSynthesisSupported: boolean;
  error: string | null;
}

export const useSpeechSynthesis = (): SpeechSynthesisHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Check if speech synthesis is supported
  const isSynthesisSupported = 'speechSynthesis' in window;

  // Setup event listeners for utterance
  const setupUtterance = useCallback((text: string) => {
    if (!isSynthesisSupported) {
      setError('Speech synthesis not supported in this browser');
      return null;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Get a suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.includes('en-'));
    
    if (englishVoices.length > 0) {
      // Prefer a natural-sounding voice if available
      const naturalVoice = englishVoices.find(voice => 
        voice.name.toLowerCase().includes('natural') || 
        !voice.name.toLowerCase().includes('google'));
      
      utterance.voice = naturalVoice || englishVoices[0];
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utterance.onerror = (event) => {
      setError(`Speech synthesis error: ${event.error}`);
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    return utterance;
  }, [isSynthesisSupported]);

  // Speak the provided text
  const speak = useCallback((text: string) => {
    if (!isSynthesisSupported) {
      setError('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    stop();
    
    try {
      const utterance = setupUtterance(text);
      if (utterance) {
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      setError('Error starting speech synthesis');
      console.error('Speech synthesis error:', err);
    }
  }, [isSynthesisSupported, setupUtterance]);

  // Stop any ongoing speech
  const stop = useCallback(() => {
    if (isSynthesisSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSynthesisSupported]);

  // Safari and Chrome have a bug where the speech synthesis stops after ~15 seconds
  // This is a workaround to keep it going
  useEffect(() => {
    if (!isSynthesisSupported) return;
    
    const interval = setInterval(() => {
      if (isSpeaking && !isPaused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isSpeaking, isPaused, isSynthesisSupported]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSynthesisSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSynthesisSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isPaused,
    isSynthesisSupported,
    error,
  };
};