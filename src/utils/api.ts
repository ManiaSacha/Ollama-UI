import { OllamaRequestOptions } from '../types';

const API_URL = 'http://localhost:11434/api/generate';

/**
 * Sends a request to the Ollama API with the provided options.
 * Returns a ReadableStream for processing the streamed response.
 */
export const generateStream = async (
  options: OllamaRequestOptions,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request was aborted');
    }
    throw error;
  }
};

/**
 * Parses the stream data into individual JSON responses.
 */
export const parseStream = async function* (
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<any, void, unknown> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            yield JSON.parse(line);
          } catch (e) {
            console.error('Error parsing JSON from stream:', e, 'Line:', line);
          }
        }
      }
    }
    
    // Handle any remaining data in the buffer
    if (buffer.trim()) {
      try {
        yield JSON.parse(buffer);
      } catch (e) {
        console.error('Error parsing JSON from final buffer:', e);
      }
    }
  } finally {
    reader.releaseLock();
  }
};