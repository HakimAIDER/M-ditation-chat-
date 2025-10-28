
import React, { useState } from 'react';

interface MeditationFormProps {
  onSubmit: (topic: string, duration: string, style: string) => void;
  isLoading: boolean;
}

const styles = ["Mindfulness", "Body Scan", "Loving-Kindness", "Visualization", "Transcendental"];
const durations = ["1 minute", "3 minutes", "5 minutes", "10 minutes", "15 minutes"];

export const MeditationForm: React.FC<MeditationFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState<string>('releasing anxiety');
  const [duration, setDuration] = useState<string>('5 minutes');
  const [style, setStyle] = useState<string>('Mindfulness');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic, duration, style);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Create Your Custom Meditation</h2>
        <p className="text-slate-400 mt-2">Describe your focus, choose a style, and set the duration.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">Focus Topic</label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., finding peace, deep sleep"
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-slate-300 mb-2">Meditation Style</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 text-white rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
            disabled={isLoading}
          >
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-2">Duration</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {durations.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    disabled={isLoading}
                    className={`p-3 text-sm rounded-lg transition-colors ${
                        duration === d 
                        ? 'bg-indigo-600 text-white font-semibold ring-2 ring-indigo-400' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    }`}
                  >
                    {d}
                  </button>
              ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <span>Begin Session</span>
          )}
        </button>
      </form>
    </div>
  );
};
