import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, X, ZoomIn, Camera, Pin } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';

export default function MemoryCollage({ onNextSurprise }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <div className="relative min-h-screen w-full py-16 px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Subtle Gradient Orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#E8A5B8]/15 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#DFB86C]/15 blur-3xl" />

      {/* Main Collage Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl mb-12 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-xs text-[#5B4E87] uppercase tracking-widest mb-3">
          <Camera className="w-3.5 h-3.5 text-[#DFB86C]" />
          <span>Digital Memory Scrapbook</span>
        </div>

        <h2 className="font-script text-4xl md:text-5xl lg:text-6xl text-[#5B4E87] leading-tight">
          Treasured Moments
        </h2>

        {/* Editable Handwritten Message Banner */}
        <div className="relative mt-4 p-6 glass-card rounded-2xl border border-white shadow-lg rotate-[-1deg]">
          <Pin className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 text-[#E8A5B8]" />
          <p className="font-script text-2xl md:text-3xl text-[#5B4E87] leading-relaxed">
            "{birthdayConfig.message}"
          </p>
        </div>
      </motion.div>

      {/* Scrapbook Photo Collage Container */}
      <div className="relative w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 my-6 px-2 z-10">
        {birthdayConfig.photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
            whileHover={{
              scale: 1.05,
              rotate: 0,
              zIndex: 30,
              transition: { duration: 0.3 }
            }}
            style={{ rotate: `${photo.rotation}deg` }}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative glass-card p-3 pb-5 rounded-xl border border-white shadow-xl cursor-pointer transition-all duration-300"
          >
            {/* Decorative Tape Strip */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded-xs opacity-85 shadow-xs z-20"
              style={{ backgroundColor: photo.tapeColor || '#E8C5C8' }}
            />

            {/* Photo Frame Container */}
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-100 shadow-inner">
              <img
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-white text-xs font-sans flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> Tap to view memory
                </span>
              </div>
            </div>

            {/* Polaroid Handwritten Caption */}
            <div className="mt-3 px-1 text-center">
              <p className="font-script text-xl text-[#362E48] tracking-wide truncate">
                {photo.caption}
              </p>
              <span className="text-[10px] font-mono text-[#7A6F96] tracking-widest block uppercase mt-0.5">
                [{photo.id}]
              </span>
            </div>

            {/* Floating Sparkle on Hover */}
            <Sparkles className="absolute bottom-2 right-2 w-4 h-4 text-[#DFB86C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>

      {/* Button to proceed to Anti-Gravity Cake Room */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 z-10"
      >
        <button
          onClick={onNextSurprise}
          className="btn-magical px-8 py-4 rounded-full text-white font-sans text-sm tracking-widest uppercase font-semibold shadow-xl flex items-center gap-3 group"
        >
          <span>One More Surprise →</span>
        </button>
      </motion.div>

      {/* ================= PHOTO INTERACTION LIGHTBOX MODAL ================= */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-[#362E48]/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full glass-card p-5 md:p-6 rounded-2xl border border-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-[#5B4E87] hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Enlarged Photo */}
              <div className="w-full rounded-xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-100">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption details */}
              <div className="mt-4 text-center">
                <p className="font-script text-2xl md:text-3xl text-[#5B4E87]">
                  {selectedPhoto.caption}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#7A6F96]">
                  <Heart className="w-3.5 h-3.5 text-[#E8A5B8] fill-[#E8A5B8]" />
                  <span>A precious moment shared together</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
