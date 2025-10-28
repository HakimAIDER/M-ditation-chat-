
import React from 'react';
import type { MeditationSession } from '../types';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface MeditationPlayerProps {
  session: MeditationSession;
  onBack: () => void;
}

export const MeditationPlayer: React.FC<MeditationPlayerProps> = ({ session, onBack }) => {
  const { isPlaying, togglePlayPause, isLoading } = useAudioPlayer(session.audioData);

  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
  );

  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
  );
  
  const LoaderIcon = () => (
     <svg className="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-700 min-h-[70vh] flex flex-col justify-between">
      <img src={session.imageUrl} alt="Meditation Background" className="absolute top-0 left-0 w-full h-full object-cover z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>

      <div className="relative z-20 p-6 flex justify-end">
        <button onClick={onBack} className="bg-slate-800/70 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; New Session
        </button>
      </div>
      
      <div className="relative z-20 p-6 sm:p-8 flex-grow overflow-y-auto text-center flex flex-col items-center justify-center">
        <div className="max-w-2xl bg-slate-900/70 backdrop-blur-md p-6 rounded-xl">
           <h3 className="text-xl font-semibold mb-4 text-indigo-300">Meditation Script</h3>
           <p className="text-slate-200 leading-relaxed text-left max-h-60 overflow-y-auto pr-2">{session.script}</p>
        </div>
      </div>
      
      <div className="relative z-20 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center space-y-4">
        <button 
          onClick={togglePlayPause} 
          disabled={isLoading}
          className="w-20 h-20 bg-indigo-600/80 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-400 disabled:bg-slate-600 disabled:scale-100"
        >
          {isLoading ? <LoaderIcon /> : (isPlaying ? <PauseIcon /> : <PlayIcon />)}
        </button>
        <p className="text-slate-400 text-sm">{isLoading ? 'Preparing Audio...' : (isPlaying ? 'Playing' : 'Paused')}</p>
      </div>
    </div>
  );
};
