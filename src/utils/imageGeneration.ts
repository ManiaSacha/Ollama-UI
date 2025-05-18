// Image generation API utilities for connecting to local models

// Supported local image generation servers
export type ImageGenerationServer = 'stable-diffusion' | 'comfyui' | 'automatic1111';

// Configuration for image generation
export interface ImageGenerationConfig {
  serverType: ImageGenerationServer;
  serverUrl: string;
  apiKey?: string; // Some local servers might require API keys
}

// Default configuration
export const defaultConfig: ImageGenerationConfig = {
  serverType: 'stable-diffusion',
  serverUrl: 'http://localhost:7860', // Default port for many SD interfaces
};

// Request parameters for image generation
export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  inputImage?: string; // Base64 image for img2img
  width?: number;
  height?: number;
  steps?: number;
  guidanceScale?: number;
  seed?: number;
}

// Response from image generation
export interface ImageGenerationResponse {
  images: string[]; // Base64 encoded images
  parameters?: Record<string, any>; // Parameters used for generation
  info?: string; // Additional information
}

/**
 * Generate an image using a local image generation model
 */
export const generateImage = async (
  request: ImageGenerationRequest,
  config: ImageGenerationConfig = defaultConfig
): Promise<ImageGenerationResponse> => {
  try {
    // Adapt the request based on the server type
    let endpoint = '';
    let requestBody: any = {};
    
    switch (config.serverType) {
      case 'stable-diffusion':
        // For basic Stable Diffusion API
        endpoint = `${config.serverUrl}/sdapi/v1/txt2img`;
        if (request.inputImage) {
          endpoint = `${config.serverUrl}/sdapi/v1/img2img`;
        }
        
        requestBody = {
          prompt: request.prompt,
          negative_prompt: request.negativePrompt || '',
          width: request.width || 512,
          height: request.height || 512,
          steps: request.steps || 20,
          cfg_scale: request.guidanceScale || 7,
          seed: request.seed || -1,
        };
        
        if (request.inputImage) {
          requestBody.init_images = [request.inputImage];
        }
        break;
        
      case 'comfyui':
        // ComfyUI has a different API structure
        endpoint = `${config.serverUrl}/api/predict`;
        // Simplified for now - would need to be expanded based on ComfyUI's workflow structure
        requestBody = {
          prompt: request.prompt,
          // Other parameters would need to be mapped to ComfyUI's workflow format
        };
        break;
        
      case 'automatic1111':
        // Automatic1111 WebUI API
        endpoint = `${config.serverUrl}/api/predict`;
        requestBody = {
          prompt: request.prompt,
          negative_prompt: request.negativePrompt || '',
          width: request.width || 512,
          height: request.height || 512,
          steps: request.steps || 20,
          cfg_scale: request.guidanceScale || 7,
          seed: request.seed || -1,
        };
        break;
        
      default:
        throw new Error(`Unsupported server type: ${config.serverType}`);
    }
    
    // Make the API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}),
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Format the response based on server type
    let formattedResponse: ImageGenerationResponse = {
      images: [],
    };
    
    switch (config.serverType) {
      case 'stable-diffusion':
        formattedResponse = {
          images: data.images || [],
          parameters: data.parameters,
          info: data.info,
        };
        break;
        
      case 'comfyui':
        // Extract images from ComfyUI response format
        formattedResponse = {
          images: data.output ? [data.output] : [],
          info: JSON.stringify(data),
        };
        break;
        
      case 'automatic1111':
        formattedResponse = {
          images: data.images || [],
          parameters: data.parameters,
          info: data.info,
        };
        break;
    }
    
    return formattedResponse;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

/**
 * Modify an existing image based on a text prompt
 */
export const modifyImage = async (
  imageData: string,
  prompt: string,
  config: ImageGenerationConfig = defaultConfig
): Promise<ImageGenerationResponse> => {
  // For image modification, we use the img2img endpoint
  return generateImage({
    prompt,
    inputImage: imageData,
    steps: 20,
    guidanceScale: 7.5,
  }, config);
};

/**
 * Test the connection to the image generation server
 */
export const testConnection = async (
  config: ImageGenerationConfig = defaultConfig
): Promise<boolean> => {
  try {
    // Different endpoints to test based on server type
    let endpoint = '';
    
    switch (config.serverType) {
      case 'stable-diffusion':
        endpoint = `${config.serverUrl}/sdapi/v1/options`;
        break;
      case 'comfyui':
        endpoint = `${config.serverUrl}/system_stats`;
        break;
      case 'automatic1111':
        endpoint = `${config.serverUrl}/api/system-info`;
        break;
      default:
        throw new Error(`Unsupported server type: ${config.serverType}`);
    }
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}),
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error testing connection:', error);
    return false;
  }
};
