
import { useState, useRef, useEffect, useCallback } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';
import type { UseAudioPlayerReturn } from '../types';

const SAMPLE_RATE = 24000;
const NUM_CHANNELS = 1;

export const useAudioPlayer = (base64AudioData: string): UseAudioPlayerReturn => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        setIsLoading(true);
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: SAMPLE_RATE
          });
        }
        
        const decodedBytes = decode(base64AudioData);
        const buffer = await decodeAudioData(decodedBytes, audioContextRef.current, SAMPLE_RATE, NUM_CHANNELS);
        audioBufferRef.current = buffer;
      } catch (error) {
        console.error("Failed to initialize audio:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAudio();

    return () => {
      // Cleanup on unmount or when audio data changes
      sourceNodeRef.current?.stop();
      audioContextRef.current?.close().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base64AudioData]);

  const play = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current || isPlaying) return;

    // Resume context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBufferRef.current;
    source.connect(audioContextRef.current.destination);
    source.start();
    source.onended = () => {
      setIsPlaying(false);
    };

    sourceNodeRef.current = source;
    setIsPlaying(true);
  }, [isPlaying]);

  const pause = useCallback(() => {
    if (!sourceNodeRef.current || !isPlaying) return;
    sourceNodeRef.current.stop();
    sourceNodeRef.current = null; // Can't reuse source nodes
    setIsPlaying(false);
  }, [isPlaying]);

  const togglePlayPause = useCallback(() => {
    if (isLoading) return;
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isLoading, isPlaying, pause, play]);

  return { isPlaying, togglePlayPause, isLoading };
};
