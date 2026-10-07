import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';

export default function MusicController({ isPlaying, setIsPlaying, autoStart = false }) {
  const audioRef = useRef(null);
  const synthContextRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const [usingSynth, setUsingSynth] = useState(!birthdayConfig.musicUrl);

  // Notes for Happy Birthday in dreamy music-box format (Frequencies in Hz)
  // G4, G4, A4, G4, C5, B4, G4, G4, A4, G4, D5, C5...
  const notes = [
    { note: 261.63, dur: 0.5 }, { note: 261.63, dur: 0.5 }, { note: 293.66, dur: 1.0 }, { note: 261.63, dur: 1.0 },
    { note: 349.23, dur: 1.0 }, { note: 329.63, dur: 2.0 },
    { note: 261.63, dur: 0.5 }, { note: 261.63, dur: 0.5 }, { note: 293.66, dur: 1.0 }, { note: 261.63, dur: 1.0 },
    { note: 392.00, dur: 1.0 }, { note: 349.23, dur: 2.0 },
    { note: 261.63, dur: 0.5 }, { note: 261.63, dur: 0.5 }, { note: 523.25, dur: 1.0 }, { note: 440.00, dur: 1.0 },
    { note: 349.23, dur: 1.0 }, { note: 329.63, dur: 1.0 }, { note: 293.66, dur: 1.5 },
    { note: 466.16, dur: 0.5 }, { note: 466.16, dur: 0.5 }, { note: 440.00, dur: 1.0 }, { note: 349.23, dur: 1.0 },
    { note: 392.00, dur: 1.0 }, { note: 349.23, dur: 2.5 },
  ];

  // Play single music box tone via Web Audio
  const playTone = (freq, duration, ctx) => {
    if (!ctx || ctx.state === 'suspended') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Triangle/Sine mix for soft music-box / kalimba sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration * 1.5);
    } catch (e) {
      console.error(e);
    }
  };

  const startSynthMelody = () => {
    if (!synthContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      synthContextRef.current = new AudioCtx();
    }
    const ctx = synthContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    let noteIdx = 0;
    const step = () => {
      if (!synthContextRef.current) return;
      const current = notes[noteIdx];
      playTone(current.note, current.dur, ctx);
      
      // Also add subtle harmony note on key steps
      if (noteIdx % 4 === 0) {
        playTone(current.note / 2, current.dur * 2, ctx);
      }

      noteIdx = (noteIdx + 1) % notes.length;
      const nextDelay = current.dur * 600; // Tempo setting
      synthIntervalRef.current = setTimeout(step, nextDelay);
    };

    step();
  };

  const stopSynthMelody = () => {
    if (synthIntervalRef.current) {
      clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (synthContextRef.current && synthContextRef.current.state === 'running') {
      synthContextRef.current.suspend();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (birthdayConfig.musicUrl) {
        audioRef.current?.play().catch(() => setIsPlaying(false));
      } else {
        startSynthMelody();
      }
    } else {
      if (birthdayConfig.musicUrl) {
        audioRef.current?.pause();
      } else {
        stopSynthMelody();
      }
    }
    return () => stopSynthMelody();
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      {birthdayConfig.musicUrl && (
        <audio ref={audioRef} src={birthdayConfig.musicUrl} loop prefetch="auto" />
      )}
      
      <button
        onClick={toggleMusic}
        aria-label="Toggle background music"
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full glass-panel text-xs tracking-wider transition-all duration-300 ${
          isPlaying 
            ? 'border-[#DFB86C]/50 text-[#5B4E87] shadow-lg shadow-[#DFB86C]/20' 
            : 'border-white/50 text-[#7A6F96] hover:text-[#5B4E87]'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <span className="relative flex h-3.5 w-3.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DFB86C] opacity-75"></span>
              <Volume2 className="h-3.5 w-3.5 text-[#DFB86C] relative z-10" />
            </span>
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-[#7A6F96]" />
          )}
        </div>
        
        <span className="font-medium font-sans uppercase">
          {isPlaying ? '♪ Playing Music' : 'Music Off'}
        </span>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 h-2 bg-[#DFB86C] animate-pulse"></span>
            <span className="w-0.5 h-3 bg-[#E8A5B8] animate-pulse delay-75"></span>
            <span className="w-0.5 h-1.5 bg-[#B3A9D9] animate-pulse delay-150"></span>
          </div>
        )}
      </button>
    </div>
  );
}
