<div align="center">

# 🤖 Ollama UI

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**A modern, feature-rich web interface for interacting with Ollama language models**

<img src="https://via.placeholder.com/800x450.png?text=Ollama+UI+Interface" alt="Ollama UI Interface" width="800"/>

</div>

## ✨ Features

### 💬 Chat Capabilities
- **Interactive Chat Interface**: Clean, intuitive UI for communicating with Ollama models
- **Multiple Model Support**: Seamlessly switch between models (llama2, mistral, codellama, and more)
- **Model Metadata**: Customize model aliases and add notes for better organization
- **Stream Processing**: View responses as they're generated in real-time

### 🎨 User Experience
- **Enhanced Model Selector**: Improved dropdown with better text wrapping and positioning
- **Dark/Light Mode**: Toggle between themes for comfortable viewing in any environment
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Keyboard Shortcuts**: Navigate and control the interface efficiently

### 🔧 Advanced Features
- **Temperature Control**: Fine-tune the creativity/randomness of model responses
- **Text-to-Speech**: Listen to model responses with built-in TTS functionality
- **Voice Input**: Speak to the model using speech recognition (where supported)
- **File Upload**: Share files with the model for context or analysis
- **Comparison Mode**: Compare responses from multiple models simultaneously
- **Image Generation**: Create images using compatible models
- **Image Upload**: Share images with the model for analysis

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.ai/) running locally on port 11434

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ManiaSacha/Ollama-UI.git
   cd Ollama-UI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## 📝 Usage

1. Ensure Ollama is running locally with your desired models pulled
2. Select a model from the enhanced dropdown menu
3. Adjust the temperature slider if desired
4. Type your message in the input field and press Enter or click the send button
5. View the model's response in the chat window
6. Use additional features:
   - Toggle dark/light mode for comfortable viewing
   - Enable text-to-speech to listen to responses
   - Use voice input to speak to the model
   - Upload files or images for analysis
   - Generate images with compatible models
   - Compare responses from multiple models simultaneously

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory and can be served using any static file server.

## 📂 Project Structure

```
src/
├── components/              # UI components
│   ├── Chat.tsx             # Main chat container
│   ├── ChatInput.tsx        # Message input with controls
│   ├── ChatMessage.tsx      # Individual message display
│   ├── FileUpload.tsx       # File upload functionality
│   ├── Header.tsx           # App header with controls
│   ├── ImageGeneration.tsx  # Image generation interface
│   ├── ImageUpload.tsx      # Image upload functionality
│   ├── ModelSelector.tsx    # Enhanced model selection dropdown
│   ├── TemperatureControl.tsx # Temperature adjustment
│   └── VoiceInput.tsx       # Speech recognition input
├── hooks/                   # Custom React hooks
│   ├── useDarkMode.ts       # Dark mode toggle functionality
│   ├── useOllama.ts         # Ollama API integration
│   ├── useSpeechRecognition.ts # Voice input functionality
│   └── useSpeechSynthesis.ts # Text-to-speech functionality
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│   ├── api.ts               # API communication helpers
│   ├── imageGeneration.ts   # Image generation utilities
│   └── modelMetadata.ts     # Model metadata management
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## 🛠️ Technologies Used

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Voice input and text-to-speech

## 🔌 API Integration

The application communicates with Ollama's API running locally on port 11434. Key endpoints include:

- **Text Generation**: `http://localhost:11434/api/generate`
- **Image Generation**: `http://localhost:11434/api/generate` (with specific parameters)
- **Model List**: `http://localhost:11434/api/tags`

Responses are streamed from the API and processed in real-time to provide a smooth user experience.

## 🆕 Recent Updates

### May 2025
- Enhanced ModelSelector UI with improved text wrapping and dropdown behavior
- Fixed dropdown positioning to open upward when space is limited
- Improved edit popover sizing and readability in dark mode
- Added image generation capabilities for compatible models
- Implemented model metadata management for custom aliases and notes

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for providing the local LLM runtime
- All contributors and open source projects that made this possible

---

<div align="center">
Made with ❤️ by <a href="https://github.com/ManiaSacha">ManiaSacha</a>
</div>
