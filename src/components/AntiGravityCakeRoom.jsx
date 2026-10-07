import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, Flame, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayConfig } from '../config/birthdayConfig';

export default function AntiGravityCakeRoom({ onRestart }) {
  const [candlesLit, setCandlesLit] = useState([true, true, true]);
  const [isWishBlown, setIsWishBlown] = useState(false);

  const candleCount = 3;
  const remainingCandles = candlesLit.filter(Boolean).length;

  const handleBlowCandle = (index) => {
    if (!candlesLit[index]) return;

    const updated = [...candlesLit];
    updated[index] = false;
    setCandlesLit(updated);

    // If all candles blown out
    if (updated.every((lit) => !lit)) {
      setTimeout(() => {
        setIsWishBlown(true);

        // Golden Sparkle Burst
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#DFB86C', '#E8A5B8', '#B3A9D9', '#FAF4EB'],
          shapes: ['star', 'circle'],
          scalar: 1.3
        });
      }, 500);
    }
  };

  const handleBlowAll = () => {
    setCandlesLit([false, false, false]);
    setTimeout(() => {
      setIsWishBlown(true);
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#DFB86C', '#E8A5B8', '#B3A9D9', '#FAF4EB'],
        shapes: ['star', 'circle'],
        scalar: 1.4
      });
    }, 400);
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden transition-colors duration-1000 ${
      isWishBlown ? 'bg-[#2A2338]' : 'bg-[#FAF6F0]'
    }`}>
      {/* Anti-Gravity Floating Ambient Elements */}
      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            animate={{
              y: [0, -120, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8 + (i % 5) * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              top: `${(i * 15) % 80 + 10}%`,
              left: `${(i * 22) % 90 + 5}%`,
              width: `${20 + (i % 4) * 12}px`,
              height: `${20 + (i % 4) * 12}px`
            }}
            className="absolute rounded-full border border-white/40 bg-gradient-to-tr from-white/20 to-transparent backdrop-blur-xs shadow-inner"
          />
        ))}

        {/* Floating Flowers & Stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`flower-${i}`}
            animate={{
              y: [0, -30, 0],
              rotate: [0, (i % 2 === 0 ? 45 : -45), 0]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4
            }}
            className="absolute text-xl opacity-60"
            style={{
              top: `${(i * 25) % 75 + 15}%`,
              left: `${(i * 30) % 85 + 8}%`,
            }}
          >
            {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '✨' : '🎈'}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-md mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel text-xs text-[#DFB86C] tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Anti-Gravity Birthday Room</span>
        </div>

        <h2 className={`font-script text-4xl md:text-5xl transition-colors duration-700 ${
          isWishBlown ? 'text-[#DFB86C] text-glow-gold' : 'text-[#5B4E87]'
        }`}>
          {isWishBlown ? 'Your Wish Has Been Sent ✨' : 'Make a Wish…'}
        </h2>
        <p className={`font-sans text-xs uppercase tracking-widest mt-1 transition-colors duration-700 ${
          isWishBlown ? 'text-[#B3A9D9]' : 'text-[#7A6F96]'
        }`}>
          {isWishBlown ? 'Keep believing in magic' : 'Tap the candles to blow them out'}
        </p>
      </motion.div>

      {/* ================= ANTI-GRAVITY FLOATING CAKE CONTAINER ================= */}
      <div className="relative my-8 z-10">
        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative flex flex-col items-center cursor-pointer"
        >
          {/* Candle Flames & Candles */}
          <div className="flex gap-8 z-20 -mb-2">
            {candlesLit.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => handleBlowCandle(idx)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Animated Candle Flame */}
                <div className="h-8 flex items-center justify-center relative">
                  {isLit ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [-3, 3, -3]
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Outer Flame Glow */}
                      <div className="absolute w-6 h-6 rounded-full bg-[#DFB86C]/40 blur-xs animate-pulse"></div>
                      <Flame className="w-6 h-7 text-[#DFB86C] fill-[#DFB86C] relative z-10" />
                    </motion.div>
                  ) : (
                    /* Smoke Particle when blown out */
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -20, scale: 1.5 }}
                      transition={{ duration: 1 }}
                      className="text-xs text-slate-300 font-mono"
                    >
                      💨
                    </motion.div>
                  )}
                </div>

                {/* Candle Body */}
                <div className="w-3.5 h-12 bg-gradient-to-b from-[#FAF4EB] via-[#FCEBE1] to-[#E8A5B8] rounded-t-md shadow-md border border-white/60 relative">
                  <div className="w-full h-1 bg-[#DFB86C] rounded-full mt-2 opacity-60"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Layer 1 (Top Layer) */}
          <div className="w-48 h-16 bg-gradient-to-r from-[#FCEBE1] via-[#FFFDF9] to-[#FCEBE1] rounded-t-3xl border-2 border-white shadow-lg relative flex items-center justify-center">
            {/* Frosting Drips */}
            <div className="absolute -bottom-3 inset-x-0 flex justify-around">
              <div className="w-5 h-5 bg-[#FAF4EB] rounded-full"></div>
              <div className="w-6 h-6 bg-[#FAF4EB] rounded-full"></div>
              <div className="w-5 h-5 bg-[#FAF4EB] rounded-full"></div>
              <div className="w-6 h-6 bg-[#FAF4EB] rounded-full"></div>
            </div>
            <Sparkles className="w-4 h-4 text-[#DFB86C]" />
          </div>

          {/* Layer 2 (Bottom Layer) */}
          <div className="w-64 h-24 bg-gradient-to-r from-[#E8A5B8] via-[#FAF4EB] to-[#B3A9D9] rounded-b-3xl border-2 border-white shadow-2xl relative flex items-center justify-center">
            <span className="font-script text-2xl text-[#5B4E87]">
              {birthdayConfig.name}
            </span>
          </div>

          {/* Floating Cake Plate Glass Base */}
          <div className="w-72 h-4 rounded-full bg-white/40 backdrop-blur-md border border-white/80 shadow-xl -mt-1"></div>

          {/* Shadow underneath showing hovering height */}
          <motion.div
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-56 h-6 bg-[#5B4E87]/20 rounded-full blur-md mt-6"
          />
        </motion.div>
      </div>

      {/* Blow All Button if candles still lit */}
      {remainingCandles > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleBlowAll}
          className="mt-2 px-6 py-2.5 rounded-full glass-panel text-xs text-[#5B4E87] uppercase tracking-widest font-semibold hover:border-[#DFB86C] transition-all"
        >
          💨 Blow out all candles
        </motion.button>
      )}

      {/* Hidden Birthday Wish Message Reveal */}
      <AnimatePresence>
        {isWishBlown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-6 max-w-lg w-full glass-card p-8 rounded-3xl text-center border border-white/60 shadow-2xl relative z-20"
          >
            <Sparkles className="w-8 h-8 text-[#DFB86C] mx-auto mb-3 animate-spin-slow" />
            <h3 className="font-serif text-xl md:text-2xl text-[#DFB86C] font-semibold text-glow-gold">
              A Birthday Blessing
            </h3>
            <p className="font-script text-3xl md:text-4xl text-white mt-4 leading-relaxed">
              "{birthdayConfig.wishMessage}"
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={onRestart}
                className="px-6 py-3 rounded-full btn-magical text-white font-sans text-xs tracking-widest uppercase font-semibold flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Surprise</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
