import React from 'react';
import { Moon, Sun, BrainCog } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <BrainCog className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Ollama Chat
          </h1>
        </div>
        
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-600 shadow-sm"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="mr-2 text-sm font-medium hidden sm:inline">
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;