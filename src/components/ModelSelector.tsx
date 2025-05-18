import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Sparkles, Star, StarOff, Info, Edit2, Check, X } from 'lucide-react';
import { ModelType } from '../types';
import {
  getModelMetadata,
  setModelMetadata,
  updateModelUsage,
  toggleModelFavorite,
  getAllModelMetadata
} from '../utils/modelMetadata';

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
  const [infoOpen, setInfoOpen] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [aliasInput, setAliasInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [_, forceUpdate] = useState(0); // for localStorage updates

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
    {
      value: 'gemma3',
      label: 'Gemma 3',
      description: 'Google\'s multimodal model with multi-image support',
    },
  ];

  // Get metadata for models
  const allMetadata = getAllModelMetadata();
  // Sort favorites and recents
  const favoriteModels = models.filter(m => allMetadata[m.value]?.favorite);
  const recentModels = models
    .filter(m => allMetadata[m.value]?.lastUsed && !allMetadata[m.value]?.favorite)
    .sort((a, b) => (allMetadata[b.value]?.lastUsed || 0) - (allMetadata[a.value]?.lastUsed || 0))
    .slice(0, 3);
  const otherModels = models.filter(m => !favoriteModels.includes(m) && !recentModels.includes(m));

  // Handle model select
  const handleSelect = (model: ModelType) => {
    setSelectedModel(model);
    updateModelUsage(model);
    forceUpdate(x => x + 1); // refresh metadata
  };

  // Handle alias/note edit
  const startEdit = (model: ModelType) => {
    setEditOpen(model);
    setAliasInput(allMetadata[model]?.alias || '');
    setNoteInput(allMetadata[model]?.note || '');
  };
  const saveEdit = (model: ModelType) => {
    setModelMetadata(model, { alias: aliasInput, note: noteInput });
    setEditOpen(null);
    forceUpdate(x => x + 1);
  };

  // Handle favorite toggle
  const handleFavorite = (model: ModelType) => {
    toggleModelFavorite(model);
    forceUpdate(x => x + 1);
  };

  // Render model row
  const renderModelRow = (model: { value: ModelType; label: string; description: string }) => {
    const meta = allMetadata[model.value] || {};
    return (
      <div key={model.value} className={`flex items-center justify-between px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${selectedModel === model.value ? 'bg-indigo-50 dark:bg-indigo-900/40' : ''}`}
           style={{ cursor: compareMode ? 'not-allowed' : 'pointer', opacity: compareMode ? 0.6 : 1 }}
           onClick={() => !compareMode && handleSelect(model.value)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-slate-900 dark:text-slate-200 whitespace-normal break-words">
              {meta.alias || model.label}
            </span>
            <span className="text-xs text-slate-400 ml-1 whitespace-normal break-words">{model.value}</span>
            <button
              className="ml-1 text-yellow-500 hover:text-yellow-600"
              title={meta.favorite ? 'Unfavorite' : 'Favorite'}
              onClick={e => { e.stopPropagation(); handleFavorite(model.value); }}
            >
              {meta.favorite ? <Star className="h-4 w-4 fill-yellow-400" /> : <StarOff className="h-4 w-4" />}
            </button>
            <button
              className="ml-1 text-slate-400 hover:text-indigo-500"
              title="Model info"
              onClick={e => { e.stopPropagation(); setInfoOpen(infoOpen === model.value ? null : model.value); }}
            >
              <Info className="h-4 w-4" />
            </button>
            <button
              className="ml-1 text-slate-400 hover:text-indigo-500"
              title="Edit alias/notes"
              onClick={e => { e.stopPropagation(); startEdit(model.value); }}
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-normal break-words">
            {meta.note || model.description}
          </div>
        </div>
        {/* Info Popover */}
        {infoOpen === model.value && (
          <div className="absolute z-10 mt-8 ml-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md rounded p-3 min-w-[220px] text-xs text-slate-900 dark:text-slate-100" onClick={e => e.stopPropagation()}>
            <div className="font-bold mb-1 text-slate-900 dark:text-slate-100">{meta.alias || model.label}</div>
            <div className="mb-1 text-slate-500 dark:text-slate-300">{model.value}</div>
            <div className="mb-2 text-slate-900 dark:text-slate-100">{meta.note || model.description}</div>
            {meta.lastUsed && <div className="text-slate-700 dark:text-slate-200">Last used: {new Date(meta.lastUsed).toLocaleString()}</div>}
            {typeof meta.usageCount === 'number' && <div className="text-slate-700 dark:text-slate-200">Usage count: {meta.usageCount}</div>}
            <div className="text-slate-700 dark:text-slate-200">Favorite: {meta.favorite ? 'Yes' : 'No'}</div>
            <button className="mt-2 text-xs text-indigo-600 hover:underline" onClick={e => { e.stopPropagation(); setInfoOpen(null); }}>Close</button>
          </div>
        )}
        {/* Edit Popover */}
        {editOpen === model.value && (
          <div className="absolute z-10 mt-8 ml-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md rounded p-2 min-w-[220px] w-[240px] max-w-[260px] text-xs" style={{overflow: 'visible'}} onClick={e => e.stopPropagation()}>
            <div className="font-bold mb-2 text-slate-900 dark:text-slate-100">Edit Alias/Note</div>
            <input
              className="w-full mb-2 p-1 border rounded text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
              placeholder="Alias (display name)"
              value={aliasInput}
              onChange={e => setAliasInput(e.target.value)}
            />
            <textarea
              className="w-full mb-2 p-1 border rounded text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
              placeholder="Note/description"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              rows={2}
            />
            <div className="flex flex-row gap-2 justify-end items-center w-full pt-1">
              <button className="text-xs px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 flex items-center" onClick={() => saveEdit(model.value)}><Check className="h-3 w-3 mr-1" />Save</button>
              <button className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded flex items-center border border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600" onClick={() => setEditOpen(null)}><X className="h-3 w-3 mr-1" />Cancel</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{left: number; top: number; width: number}>({left: 0, top: 0, width: 0});
  const currentMeta = allMetadata[selectedModel] || {};
  const currentModel = models.find(m => m.value === selectedModel);

  React.useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 320; // Estimate or measure menu height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      let top = rect.bottom + window.scrollY;
      let dropUp = false;
      if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
        // Drop up
        top = rect.top + window.scrollY - menuHeight;
        dropUp = true;
      }
      setDropdownPos({
        left: rect.left,
        top,
        width: rect.width,
        dropUp,
      } as any);
    }
    // Outside click handler
    function handleClickOutside(e: MouseEvent) {
      const btn = buttonRef.current;
      const menu = document.getElementById('model-selector-dropdown');
      if (
        btn && !btn.contains(e.target as Node) &&
        menu && !menu.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setInfoOpen(null);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Portal dropdown menu
  const dropdownMenu = dropdownOpen
    ? ReactDOM.createPortal(
        <div
          id="model-selector-dropdown"
          className="z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md p-2 animate-fade-in min-w-[260px]"
          style={{
            position: 'absolute',
            left: dropdownPos.left,
            top: dropdownPos.top,
            width: dropdownPos.width,
            marginBottom: 0,
            maxHeight: 320,
            overflowY: 'auto',
            minWidth: 260,
          }}
        >
          {/* Favorites */}
          {favoriteModels.length > 0 && (
            <div className="mb-1">
              <div className="text-xs text-yellow-700 dark:text-yellow-300 font-semibold mb-1">Favorites</div>
              {favoriteModels.map(renderModelRow)}
            </div>
          )}
          {/* Recents */}
          {recentModels.length > 0 && (
            <div className="mb-1">
              <div className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold mb-1">Recent</div>
              {recentModels.map(renderModelRow)}
            </div>
          )}
          {/* All others */}
          <div>
            {otherModels.map(renderModelRow)}
          </div>
          <button
            className="w-full text-xs text-slate-500 hover:text-indigo-500"
            style={{marginBottom: 0, marginTop: 8}}
            onClick={() => setDropdownOpen(false)}
          >Close</button>
        </div>,
        window.document.body
      )
    : null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
      {/* Dropdown Button */}
      <div className="min-w-[260px]">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block">Model</label>
        <button
          ref={buttonRef}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          onClick={() => setDropdownOpen(v => !v)}
          type="button"
        >
          <span className="flex items-center gap-2 truncate">
            <span className="font-semibold truncate">{currentMeta.alias || currentModel?.label || selectedModel}</span>
            <span className="text-xs text-slate-400 ml-1 truncate">{selectedModel}</span>
            {currentMeta.favorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />}
          </span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
        {dropdownMenu}
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