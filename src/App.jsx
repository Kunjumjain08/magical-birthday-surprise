import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ParticleBackground from './components/ParticleBackground';
import MusicController from './components/MusicController';
import CustomCursor from './components/CustomCursor';

import LoadingScene from './components/LoadingScene';
import BirthdayCard from './components/BirthdayCard';

export default function App() {
  // Scene sequence: 0 = Opening Loading Screen, 1 = Master Birthday Card
  // ABSOLUTELY NO AUTO-NAVIGATION! EVERY TRANSITION IS USER CLICK-TRIGGERED.
  const [currentScene, setCurrentScene] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const goToCard = () => {
    setCurrentScene(1);
  };

  const handleCardOpened = () => {
    setIsMusicPlaying(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#251A36] text-[#FAF2F5] font-sans overflow-x-hidden selection:bg-[#E8A5B8]/30">
      {/* Ambient Particle Canvas */}
      <ParticleBackground />

      {/* Custom Dream Cursor */}
      <CustomCursor />

      {/* Music Controller */}
      <MusicController
        isPlaying={isMusicPlaying}
        setIsPlaying={setIsMusicPlaying}
      />

      {/* Main Experience Container */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <motion.div
              key="loading"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)", transition: { duration: 0.5 } }}
            >
              <LoadingScene onComplete={goToCard} />
            </motion.div>
          )}

          {currentScene >= 1 && (
            <motion.div
              key="master-card"
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <BirthdayCard
                onCardOpened={handleCardOpened}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
