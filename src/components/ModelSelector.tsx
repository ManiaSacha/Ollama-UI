import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { ModelType } from '../types';

interface ModelSelectorProps {
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  compareMode: boolean;
  setCompareMode: (compare: boolean) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  setSelectedModel,
  compareMode,
  setCompareMode,
}) => {
  const models: { value: ModelType; label: string; description: string }[] = [
    {
      value: 'llama2',
      label: 'Llama 2',
      description: 'Meta\'s general purpose language model',
    },
    {
      value: 'mistral',
      label: 'Mistral',
      description: 'Efficient and powerful language model',
    },
    {
      value: 'codellama',
      label: 'CodeLlama',
      description: 'Specialized for coding tasks and programming',
    },
    {
      value: 'llama3.2',
      label: 'Llama 3.2',
      description: 'Meta\'s latest and most advanced language model',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="relative group">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">
          Model
        </label>
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as ModelType)}
            disabled={compareMode}
            className={`
              w-full appearance-none rounded-md border border-slate-300 dark:border-slate-600 
              bg-white dark:bg-slate-800 py-2 pl-3 pr-10 text-slate-800 dark:text-slate-200 
              shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
              ${compareMode ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="flex items-start sm:items-end">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:checked:bg-indigo-600"
          />
          <span className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <Sparkles className="h-4 w-4 mr-1 text-amber-500" />
            Compare Models
          </span>
        </label>
      </div>
    </div>
  );
};

export default ModelSelector;