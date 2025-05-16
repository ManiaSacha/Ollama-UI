export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isGenerating: boolean;
  error: string | null;
  activeModelStreams: Record<string, AbortController | null>;
}

export type ModelType = 'llama2' | 'mistral' | 'codellama' | 'llama3.2';

export interface OllamaRequestOptions {
  model: ModelType;
  prompt: string;
  options?: {
    temperature?: number;
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}