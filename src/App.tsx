import React, { useState } from 'react';
import { Mic, Music, Send } from 'lucide-react';
import OpenAI from 'openai';

// Check if API key is available and valid (not the example value)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isValidApiKey = apiKey && !apiKey.includes('your-api-key-here');

// Only create OpenAI client if API key is valid
const openai = isValidApiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true
}) : null;

function App() {
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateLyrics = async () => {
    if (!openai) {
      setError('Please add your actual OpenAI API key to the .env file. You can get your API key from https://platform.openai.com/account/api-keys');
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a skilled hip-hop lyricist. Create hip-hop lyrics in the style of modern rap music. Include a verse and a hook. Format the output with clear section labels and line breaks."
          },
          {
            role: "user",
            content: `Write hip-hop lyrics about: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const generatedLyrics = response.choices[0]?.message?.content;
      if (generatedLyrics) {
        setLyrics(generatedLyrics);
      } else {
        setError('Failed to generate lyrics. Please try again.');
      }
    } catch (err) {
      setError('Error connecting to OpenAI. Please check your API key and try again.');
      console.error('OpenAI Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Mic className="w-8 h-8 text-purple-400" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Hip-Hop Lyrics Generator
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            {!isValidApiKey && (
              <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg text-yellow-200">
                <p>⚠️ OpenAI API key is not configured correctly. Please follow these steps:</p>
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  <li>Get your API key from <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100">OpenAI's website</a></li>
                  <li>Create a <code className="bg-yellow-900/50 px-1 rounded">.env</code> file in the project root</li>
                  <li>Add your API key as: <code className="bg-yellow-900/50 px-1 rounded">VITE_OPENAI_API_KEY=your-actual-api-key</code></li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your prompt
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write about hustling in the city..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={generateLyrics}
                  disabled={!prompt || isGenerating || !isValidApiKey}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Music className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {lyrics && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4 text-purple-400">Generated Lyrics:</h2>
                <div className="bg-gray-900 rounded-lg p-6 whitespace-pre-line">
                  {lyrics}
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-gray-400 mt-4 text-sm">
            Enter a prompt describing what you want your lyrics to be about, and let the magic happen!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;