# Ollama Client

A modern, responsive web interface for interacting with Ollama language models. This application provides a clean, intuitive chat interface for communicating with various Ollama models.

![Ollama Client Interface](https://via.placeholder.com/800x450.png?text=Ollama+Client+Interface)

## Features

- **Interactive Chat Interface**: Communicate with Ollama models through a clean, user-friendly interface
- **Multiple Model Support**: Switch between different models (llama2, mistral, codellama)
- **Temperature Control**: Adjust the creativity/randomness of model responses
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Text-to-Speech**: Listen to model responses with built-in TTS functionality
- **Voice Input**: Speak to the model using speech recognition (where supported)
- **File Upload**: Share files with the model for context or analysis
- **Comparison Mode**: Compare responses from multiple models simultaneously
- **Stream Processing**: View responses as they're generated in real-time
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Ollama](https://ollama.ai/) running locally on port 11434

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ollama-client.git
   cd ollama-client
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

## Usage

1. Ensure Ollama is running locally with your desired models pulled
2. Select a model from the dropdown menu
3. Adjust the temperature slider if desired
4. Type your message in the input field and press Enter or click the send button
5. View the model's response in the chat window
6. Toggle additional features like dark mode or text-to-speech as needed

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory and can be served using any static file server.

## Project Structure

```
src/
├── components/         # UI components
│   ├── Chat.tsx        # Main chat container
│   ├── ChatInput.tsx   # Message input with controls
│   ├── ChatMessage.tsx # Individual message display
│   ├── FileUpload.tsx  # File upload functionality
│   ├── Header.tsx      # App header with controls
│   ├── ModelSelector.tsx # Model selection dropdown
│   ├── TemperatureControl.tsx # Temperature adjustment
│   └── VoiceInput.tsx  # Speech recognition input
├── hooks/              # Custom React hooks
│   ├── useDarkMode.ts  # Dark mode toggle functionality
│   ├── useOllama.ts    # Ollama API integration
│   ├── useSpeechRecognition.ts # Voice input functionality
│   └── useSpeechSynthesis.ts # Text-to-speech functionality
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── api.ts          # API communication helpers
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Technologies Used

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons

## API Integration

The application communicates with Ollama's API running locally on port 11434. The main endpoint used is:

```
http://localhost:11434/api/generate
```

Responses are streamed from the API and processed in real-time to provide a smooth user experience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ollama](https://ollama.ai/) for providing the local LLM runtime
- All contributors and open source projects that made this possible
