// Utility for managing model metadata in localStorage
// Metadata: alias, note, favorite, lastUsed, usageCount

export interface ModelMetadata {
  alias?: string;
  note?: string;
  favorite?: boolean;
  lastUsed?: number;
  usageCount?: number;
}

const STORAGE_KEY = 'ollama_model_metadata';

export function getAllModelMetadata(): Record<string, ModelMetadata> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getModelMetadata(model: string): ModelMetadata {
  const all = getAllModelMetadata();
  return all[model] || {};
}

export function setModelMetadata(model: string, meta: Partial<ModelMetadata>) {
  const all = getAllModelMetadata();
  all[model] = { ...all[model], ...meta };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateModelUsage(model: string) {
  const meta = getModelMetadata(model);
  setModelMetadata(model, {
    lastUsed: Date.now(),
    usageCount: (meta.usageCount || 0) + 1,
  });
}

export function toggleModelFavorite(model: string) {
  const meta = getModelMetadata(model);
  setModelMetadata(model, { favorite: !meta.favorite });
}
