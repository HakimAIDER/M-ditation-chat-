
import React, { useState, useCallback } from 'react';
import { MeditationForm } from './components/MeditationForm';
import { MeditationPlayer } from './components/MeditationPlayer';
import { ChatBot } from './components/ChatBot';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import type { MeditationSession, View } from './types';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('generator');
  const [meditationSession, setMeditationSession] = useState<MeditationSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMeditation = useCallback(async (topic: string, duration: string, style: string) => {
    setIsLoading(true);
    setError(null);
    setMeditationSession(null);

    try {
      setLoadingMessage("Crafting your meditation script...");
      const script = await geminiService.generateMeditationScript(topic, duration, style);
      if (!script) throw new Error("Failed to generate script.");

      setLoadingMessage("Creating a serene visual...");
      const imagePrompt = `A serene, tranquil, and beautiful digital art masterpiece representing ${style} meditation on the topic of ${topic}. Photorealistic, calming colors, peaceful atmosphere.`;
      const imageUrl = await geminiService.generateMeditationImage(imagePrompt);
      if (!imageUrl) throw new Error("Failed to generate image.");

      setLoadingMessage("Synthesizing a calming voiceover...");
      const audioData = await geminiService.generateMeditationAudio(script);
      if (!audioData) throw new Error("Failed to generate audio.");

      setMeditationSession({ script, imageUrl, audioData });
      setCurrentView('player');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error("Meditation generation failed:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleBackToGenerator = () => {
    setMeditationSession(null);
    setCurrentView('generator');
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Generation Failed</h2>
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    switch (currentView) {
      case 'player':
        return meditationSession ? (
          <MeditationPlayer session={meditationSession} onBack={handleBackToGenerator} />
        ) : (
          <MeditationForm onSubmit={handleGenerateMeditation} isLoading={isLoading} />
        );
      case 'chat':
        return <ChatBot />;
      case 'generator':
      default:
        return <MeditationForm onSubmit={handleGenerateMeditation} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-sans antialiased">
      {isLoading && <Loader message={loadingMessage} />}
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Powered by Gemini. For mindfulness and relaxation.</p>
      </footer>
    </div>
  );
};

export default App;
