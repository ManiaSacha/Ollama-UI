import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  // Function to get initial dark mode state
  const getInitialDarkMode = (): boolean => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return false;
    
    // Check for stored preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    
    // Check for system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  
  // Initialize with stored preference or system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode());

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Set dark mode explicitly
  const setDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
  };

  // Apply dark mode to document and save preference
  useEffect(() => {
    // Apply class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
    
    // Force a repaint to ensure styles are applied
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Log the current state for debugging
    console.log('Dark mode:', isDarkMode, 'Class present:', document.documentElement.classList.contains('dark'));
    
    // Force update to ensure Tailwind styles are applied
    const currentBackground = window.getComputedStyle(document.documentElement).backgroundColor;
    console.log('Current background color:', currentBackground);
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('theme') === null) {
        setIsDarkMode(e.matches);
      }
    };
    
    // Add event listener with compatibility for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange as any);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange as any);
      }
    };
  }, []);

  return { isDarkMode, toggleDarkMode, setDarkMode };
};