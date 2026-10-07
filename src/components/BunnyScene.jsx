import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

export default function BunnyScene({ onComplete }) {
  const [hopStep, setHopStep] = useState(0);

  useEffect(() => {
    // Step-by-step bunny animation sequence
    const t1 = setTimeout(() => setHopStep(1), 400);  // Initial crouch/anticipation
    const t2 = setTimeout(() => setHopStep(2), 1200); // Big hop 1
    const t3 = setTimeout(() => setHopStep(3), 2200); // Land & point/invite
    const t4 = setTimeout(() => setHopStep(4), 3600); // Hop into card portal

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Ambient background particles */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-[#FCEBE1]/40 to-[#E3EDF7]/40 blur-3xl" />

      <motion.div className="relative flex flex-col items-center max-w-sm text-center">
        {/* Magic Particles Emitter */}
        <div className="absolute -top-12 flex gap-4">
          <motion.div
            animate={{ y: [-10, -25], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-[#DFB86C]" />
          </motion.div>
          <motion.div
            animate={{ y: [-5, -20], opacity: [0, 1, 0], scale: [0.5, 1, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.7 }}
          >
            <Heart className="w-4 h-4 text-[#E8A5B8]" />
          </motion.div>
        </div>

        {/* Adorable Bunny Character */}
        <div className="relative h-44 w-full flex items-end justify-center my-4">
          <motion.div
            initial={{ x: -120, y: 0, scale: 0.9 }}
            animate={
              hopStep === 0
                ? { x: -60, y: 0, scaleY: 1, scaleX: 1 }
                : hopStep === 1
                ? { x: -40, y: 8, scaleY: 0.85, scaleX: 1.15 } // Anticipation crouch
                : hopStep === 2
                ? { x: 0, y: -45, scaleY: 1.2, scaleX: 0.85, rotate: 6 } // High Jump & Stretch
                : hopStep === 3
                ? { x: 0, y: 0, scaleY: 0.9, scaleX: 1.1 } // Squash landing
                : { x: 80, y: -20, opacity: 0, scale: 0.7 } // Final hop into next scene
            }
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 14,
            }}
            onAnimationComplete={() => {
              if (hopStep === 4) {
                onComplete();
              }
            }}
            className="relative flex flex-col items-center cursor-pointer"
            onClick={() => setHopStep(3)}
          >
            {/* Bunny Ears */}
            <div className="flex gap-2.5 -mb-2 relative z-10">
              {/* Left Ear */}
              <motion.div
                animate={{ rotate: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-5 h-12 bg-white border-2 border-[#FAF4EB] rounded-t-full shadow-sm flex items-center justify-center p-1"
              >
                <div className="w-2.5 h-8 bg-[#FCEBE1] rounded-t-full"></div>
              </motion.div>
              {/* Right Ear */}
              <motion.div
                animate={{ rotate: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="w-5 h-12 bg-white border-2 border-[#FAF4EB] rounded-t-full shadow-sm flex items-center justify-center p-1"
              >
                <div className="w-2.5 h-8 bg-[#FCEBE1] rounded-t-full"></div>
              </motion.div>
            </div>

            {/* Bunny Head & Body */}
            <div className="w-24 h-22 bg-white border-2 border-[#FAF4EB] rounded-[2.5rem] shadow-lg shadow-[#5B4E87]/5 flex flex-col items-center justify-center relative p-2">
              {/* Cheeks */}
              <div className="absolute top-10 left-3 w-4 h-2 rounded-full bg-[#E8A5B8]/40"></div>
              <div className="absolute top-10 right-3 w-4 h-2 rounded-full bg-[#E8A5B8]/40"></div>

              {/* Eyes */}
              <div className="flex gap-7 mt-3">
                <div className="w-2.5 h-3.5 bg-[#362E48] rounded-full"></div>
                <div className="w-2.5 h-3.5 bg-[#362E48] rounded-full"></div>
              </div>

              {/* Nose & Mouth */}
              <div className="w-2 h-1.5 bg-[#E8A5B8] rounded-full mt-1"></div>
              <div className="w-3 h-1 border-b border-[#362E48] rounded-b-full"></div>

              {/* Tiny Paws */}
              <div className="flex gap-6 mt-3">
                <div className="w-3 h-2 bg-[#FAF4EB] rounded-full"></div>
                <div className="w-3 h-2 bg-[#FAF4EB] rounded-full"></div>
              </div>
            </div>

            {/* Cute Fluffy Tail */}
            <div className="absolute bottom-2 -left-2 w-5 h-5 bg-white rounded-full border border-[#FAF4EB] shadow-xs"></div>
          </motion.div>
        </div>

        {/* Story Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <p className="font-script text-3xl md:text-4xl text-[#5B4E87] leading-relaxed">
            Look who brought a secret message! 🐰✨
          </p>
          <p className="font-sans text-xs text-[#7A6F96] tracking-wider uppercase mt-1">
            Follow the bunny into your birthday world
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => setHopStep(4)}
          className="mt-6 px-7 py-3 rounded-full btn-magical text-white font-sans text-sm tracking-wider font-semibold shadow-lg flex items-center gap-2 group"
        >
          <span>Step Inside</span>
          <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
