import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, RotateCcw, Camera, ZoomIn, X, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayConfig } from '../config/birthdayConfig';

export default function BirthdayCard({ onCardOpened }) {
  // Card Internal Page state:
  // 0 = Closed Cover
  // 1 = Inside Page 1 (Left = Birthday Video, Right = Happy Birthday Ram)
  // 2 = Inside Page 2 (Treasured Memories Scrapbook - 7 Uploaded Photos)
  // 3 = Inside Page 3 (3D Bakery Birthday Cake Ceremony)
  const [cardPage, setCardPage] = useState(0);
  const [isPageTurning, setIsPageTurning] = useState(false);

  // Video Ref
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Desktop Mouse 3D Tilt State
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const cardRef = useRef(null);

  // Memory Lightbox Photo Modal State
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // ================= CAKE SECTION STATE MACHINE =================
  // 'lit' -> 'blowing' -> 'blown' -> 'cutting' -> 'cut' -> 'celebrating'
  const [cakeState, setCakeState] = useState('lit');

  // Try playing video when entering Page 1
  useEffect(() => {
    if (cardPage === 1 && videoRef.current) {
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch((err) => {
        console.warn("Video autoplay waiting for user interaction:", err);
      });
    }
  }, [cardPage]);

  const handleMouseMove = (e) => {
    if (cardPage > 0 || isPageTurning || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      rotateX: (-y / rect.height) * 10,
      rotateY: (x / rect.width) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Turn to Next Internal Card Page with 3D Paper Animation
  const goToPage = (nextPageIndex) => {
    if (isPageTurning) return;
    setIsPageTurning(true);

    if (cardPage === 0 && onCardOpened) {
      onCardOpened(); // Start background music on first unseal
    }

    setTimeout(() => {
      setCardPage(nextPageIndex);
      setIsPageTurning(false);

      if (nextPageIndex === 1) {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#DFB86C', '#E8A5B8', '#B3A9D9', '#FAF0F4', '#F7B8A0'],
          shapes: ['star', 'circle'],
          scalar: 1.2,
        });
      }
    }, 600);
  };

  // ================= CAKE SECTION INTERACTION FLOW =================
  const handleBlowCandles = () => {
    if (cakeState !== 'lit') return;
    setCakeState('blowing');

    setTimeout(() => {
      setCakeState('blown');
    }, 1800);
  };

  const handleCutCake = () => {
    if (cakeState !== 'blown') return;
    setCakeState('cutting');

    setTimeout(() => {
      setCakeState('cut');

      setTimeout(() => {
        setCakeState('celebrating');

        const end = Date.now() + 3 * 1000;
        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 60,
            origin: { x: 0.1, y: 0.4 },
            colors: ['#DFB86C', '#E8A5B8', '#B3A9D9', '#FAF4EB'],
            shapes: ['star', 'circle'],
            scalar: 1.2,
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 60,
            origin: { x: 0.9, y: 0.4 },
            colors: ['#DFB86C', '#E8A5B8', '#B3A9D9', '#FAF4EB'],
            shapes: ['star', 'circle'],
            scalar: 1.2,
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      }, 400);
    }, 2200);
  };

  const restartCakeCeremony = () => {
    setCakeState('lit');
  };

  const restartCard = () => {
    setCakeState('lit');
    setCardPage(0);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center py-6 px-4 overflow-hidden bg-gradient-to-b from-[#251A36] via-[#352749] to-[#20152F] text-[#4A3B5C]">
      {/* Deep Twilight Atmosphere Ambient Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-[#F7B8A0]/25 via-[#E8A5B8]/20 to-[#B3A9D9]/20 blur-3xl pointer-events-none transition-all duration-1000"
        style={{ transform: cardPage > 0 ? 'translate(-50%, -50%) scale(1.4)' : 'translate(-50%, -50%) scale(1)' }}
      />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#DFB86C]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#5B4E87]/30 blur-3xl pointer-events-none" />

      {/* Background Fireworks Layer during Celebration */}
      {cakeState === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#DFB86C]/20 blur-3xl animate-ping" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-[#E8A5B8]/20 blur-3xl animate-ping delay-500" />
        </div>
      )}

      {/* Camera 3D Stage */}
      <div
        className="relative z-10 w-full flex items-center justify-center"
        style={{ perspective: '1800px' }}
      >
        {/* ================= MASTER PHYSICAL CARD CONTAINER ================= */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateX: cardPage > 0 ? 0 : tilt.rotateX,
            rotateY: cardPage > 0 ? 0 : tilt.rotateY,
            y: isPageTurning ? -12 : [0, -6, 0],
            scale: isPageTurning ? 1.02 : 1,
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            rotateX: { duration: 0.1 },
            rotateY: { duration: 0.1 },
          }}
          className={`relative transition-all duration-700 ${
            cardPage > 0
              ? 'w-full max-w-4xl h-[76vh] min-h-[580px] max-h-[750px]'
              : 'w-[300px] sm:w-[340px] md:w-[370px] aspect-[3/4.6] h-[68vh] min-h-[520px] max-h-[640px]'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Realistic Multi-Layered Drop Shadows Underneath Single Card */}
          <div
            className="absolute inset-0 rounded-[2.2rem] transition-all duration-700 pointer-events-none"
            style={{
              boxShadow: cardPage > 0
                ? '0 40px 80px -15px rgba(10, 6, 18, 0.75), 0 0 60px 10px rgba(247, 184, 160, 0.25)'
                : '0 25px 55px -10px rgba(12, 8, 22, 0.8), 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 35px 5px rgba(223, 184, 108, 0.2)',
              transform: 'translateZ(-30px)',
            }}
          />

          {/* ================= SINGLE CONTINUOUS PHYSICAL CARD SHELL ================= */}
          <div className="w-full h-full relative rounded-[2.2rem] bg-[#FAF2F5] border-2 border-white/90 shadow-2xl overflow-hidden flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>

            {/* Paper Texture Grain */}
            <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none z-0" />

            {/* Center Crease Vertical Hinge Shadow for Opened Two-Panel Spread */}
            {cardPage > 0 && (
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/10 via-black/20 to-black/10 z-30 pointer-events-none opacity-80 hidden md:block" />
            )}

            {/* Dynamic Page Content Render inside the SAME Card */}
            <AnimatePresence mode="wait">

              {/* ================= PAGE 0: CLOSED CARD COVER ================= */}
              {cardPage === 0 && (
                <motion.div
                  key="page-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, rotateY: -90, transition: { duration: 0.5 } }}
                  onClick={() => goToPage(1)}
                  className="w-full h-full flex flex-col items-center justify-between p-7 md:p-9 text-center cursor-pointer relative z-10 group"
                >
                  <div className="absolute inset-3 border border-[#DFB86C]/40 rounded-[1.5rem] pointer-events-none" />
                  <div className="absolute inset-4 border border-dashed border-[#DFB86C]/25 rounded-[1.3rem] pointer-events-none" />

                  {/* Top Wax Seal */}
                  <div className="relative mt-2">
                    <motion.div
                      animate={{ rotate: [0, 6, -6, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#DFB86C] via-[#E8A5B8] to-[#B3A9D9] p-0.5 shadow-md flex items-center justify-center"
                    >
                      <div className="w-full h-full rounded-full bg-[#FAF2F5] flex items-center justify-center border border-white">
                        <Sparkles className="w-7 h-7 text-[#DFB86C]" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Cover Message */}
                  <div className="my-auto py-4">
                    <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#8A7B9B] font-semibold block mb-2">
                      Secret Birthday Card
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#4A3B5C] leading-snug">
                      Something special<br />is waiting for you…
                    </h2>
                    <p className="font-serif italic text-xs md:text-sm text-[#7A6B8B] mt-3 font-light">
                      A little surprise, made just for you.
                    </p>
                  </div>

                  {/* OPEN THE CARD Button */}
                  <div className="w-full mb-2">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPage(1);
                      }}
                      className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E8A5B8] via-[#B3A9D9] to-[#DFB86C] text-[#362E48] font-sans text-xs tracking-[0.2em] uppercase font-bold shadow-lg shadow-[#E8A5B8]/30 flex items-center justify-center gap-2 group-hover:shadow-xl transition-all duration-300 border border-white/50"
                    >
                      <Sparkles className="w-4 h-4 text-[#362E48] animate-pulse" />
                      <span>Open The Card</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ================= PAGE 1: INSIDE PAGE 1 (LEFT = BIRTHDAY VIDEO, RIGHT = HAPPY BIRTHDAY Ram) ================= */}
              {cardPage === 1 && (
                <motion.div
                  key="page-message"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-5 p-5 sm:p-7 md:p-8 relative z-10 overflow-y-auto"
                >
                  {/* LEFT PANEL: EMBEDDED BIRTHDAY VIDEO */}
                  <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col justify-between items-center text-center border border-white/80 shadow-xs relative bg-gradient-to-b from-white/70 to-[#F5E8EE]/40 h-full">
                    <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#DFB86C] font-bold block mb-2">
                      A LITTLE SURPRISE FOR YOU
                    </span>

                    <div className="relative w-full h-full max-h-[460px] flex-1 rounded-xl overflow-hidden border border-[#DFB86C]/40 shadow-md bg-gradient-to-tr from-[#251A36] to-[#352749] flex items-center justify-center group my-auto">
                      <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onClick={() => {
                          if (videoRef.current) {
                            if (videoRef.current.paused) {
                              videoRef.current.play();
                              setIsVideoPlaying(true);
                            } else {
                              videoRef.current.pause();
                              setIsVideoPlaying(false);
                            }
                          }
                        }}
                        style={{ objectFit: 'contain', objectPosition: 'center center' }}
                        className="w-full h-full rounded-xl cursor-pointer"
                      >
                        <source src={birthdayConfig.birthdayVideoUrl} type="video/mp4" />
                        <source src="/birthday.mp4" type="video/mp4" />
                      </video>

                      {!isVideoPlaying && (
                        <div
                          onClick={() => {
                            if (videoRef.current) {
                              videoRef.current.play();
                              setIsVideoPlaying(true);
                            }
                          }}
                          className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#8A7B9B] mt-2">
                      <span className="h-px w-6 bg-[#DFB86C]/40" />
                      <Star className="w-3 h-3 text-[#DFB86C] fill-[#DFB86C]" />
                      <span className="h-px w-6 bg-[#DFB86C]/40" />
                    </div>
                  </div>

                  {/* RIGHT PANEL: HAPPY BIRTHDAY Ram */}
                  <div className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col justify-between items-center text-center border border-white/80 shadow-xs relative bg-gradient-to-b from-white/80 to-[#F5E8EE]/50 h-full my-auto">
                    <div className="flex items-center justify-center gap-2 text-xs text-[#DFB86C] font-semibold tracking-widest uppercase mb-1">
                      <span>✦</span>
                      <span className="text-[10px] font-sans tracking-[0.25em] text-[#DFB86C]">A SPECIAL BIRTHDAY MESSAGE</span>
                      <span>✦</span>
                    </div>

                    <div className="my-auto py-2 flex flex-col items-center w-full">
                      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#4A3B5C] font-semibold leading-tight tracking-wide uppercase">
                        HAPPY<br />BIRTHDAY
                      </h1>

                      <div className="font-script text-5xl sm:text-6xl md:text-7xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#DFB86C] via-[#E8A5B8] to-[#B3A9D9] tracking-wider my-2.5 drop-shadow-xs">
                        Ram
                      </div>

                      <div className="flex items-center justify-center gap-3 text-xs text-[#8A7B9B] my-2 w-full">
                        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#DFB86C]/60 to-transparent" />
                        <Star className="w-3.5 h-3.5 text-[#DFB86C] fill-[#DFB86C]" />
                        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#DFB86C]/60 to-transparent" />
                      </div>

                      <p className="font-serif italic text-xs md:text-sm text-[#7A6B8B] font-light max-w-xs mx-auto leading-relaxed mt-1">
                        Wishing you a day filled with boundless joy, warm laughter, and all the magic your heart can hold.
                      </p>
                    </div>

                    <div className="w-full mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => goToPage(2)}
                        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#DFB86C] via-[#E8A5B8] to-[#B3A9D9] text-[#362E48] font-sans text-xs tracking-widest uppercase font-bold shadow-md flex items-center justify-center gap-2 group hover:shadow-lg transition-all border border-white/60"
                      >
                        <span>Continue To Memories →</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= PAGE 2: INSIDE MEMORIES SCRAPBOOK PAGE (7 UPLOADED PHOTOS: 1..7) ================= */}
              {cardPage === 2 && (
                <motion.div
                  key="page-memories"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex flex-col justify-between p-4 sm:p-7 relative z-10 overflow-y-auto"
                >
                  {/* Inside Header */}
                  <div className="text-center max-w-lg mx-auto mb-1">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-panel text-[10px] text-[#DFB86C] font-semibold tracking-widest uppercase mb-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#DFB86C]" />
                      <span>TREASURED MOMENTS</span>
                    </div>
                    <p className="font-script text-2xl sm:text-3xl text-[#4A3B5C] leading-snug font-semibold px-2">
                      {birthdayConfig.message}
                    </p>
                  </div>

                  {/* 7 Photo Scrapbook Collage: Top Row (4 photos), Bottom Row (3 photos centered) */}
                  <div className="flex flex-col gap-2.5 sm:gap-3.5 my-auto py-1 w-full max-w-3xl mx-auto">
                    {/* Top Row: 4 Photos */}
                    <div className="flex justify-center items-center gap-1.5 sm:gap-3.5 w-full">
                      {birthdayConfig.photos.slice(0, 4).map((photo) => (
                        <motion.div
                          key={photo.id}
                          whileHover={{ scale: 1.06, rotate: 0, zIndex: 20 }}
                          style={{ rotate: `${photo.rotation}deg` }}
                          onClick={() => setSelectedPhoto(photo)}
                          className="flex-1 max-w-[130px] sm:max-w-[165px] glass-card p-1.5 pb-2 rounded-lg border border-white shadow-md cursor-pointer transition-all relative group"
                        >
                          {/* Tape Strip */}
                          <div
                            className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 sm:w-9 h-2.5 rounded-xs opacity-85 z-10"
                            style={{ backgroundColor: photo.tapeColor || '#E8C5C8' }}
                          />
                          <div className="aspect-[4/3] w-full rounded-md overflow-hidden bg-slate-100 relative">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              style={{ objectFit: 'cover', objectPosition: 'center center' }}
                              className="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px]">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <p className="font-script text-[11px] sm:text-xs text-[#362E48] text-center mt-1 truncate px-0.5 font-semibold">
                            {photo.caption}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom Row: 3 Photos Centered Underneath */}
                    <div className="flex justify-center items-center gap-1.5 sm:gap-3.5 w-full">
                      {birthdayConfig.photos.slice(4, 7).map((photo) => (
                        <motion.div
                          key={photo.id}
                          whileHover={{ scale: 1.06, rotate: 0, zIndex: 20 }}
                          style={{ rotate: `${photo.rotation}deg` }}
                          onClick={() => setSelectedPhoto(photo)}
                          className="flex-1 max-w-[135px] sm:max-w-[170px] glass-card p-1.5 pb-2 rounded-lg border border-white shadow-md cursor-pointer transition-all relative group"
                        >
                          {/* Tape Strip */}
                          <div
                            className="absolute -top-2 left-1/2 -translate-x-1/2 w-7 sm:w-9 h-2.5 rounded-xs opacity-85 z-10"
                            style={{ backgroundColor: photo.tapeColor || '#E8C5C8' }}
                          />
                          <div className="aspect-[4/3] w-full rounded-md overflow-hidden bg-slate-100 relative">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              style={{ objectFit: 'cover', objectPosition: 'center center' }}
                              className="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px]">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <p className="font-script text-[11px] sm:text-xs text-[#362E48] text-center mt-1 truncate px-0.5 font-semibold">
                            {photo.caption}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* MOVE NEXT Button */}
                  <div className="w-full mt-2 flex justify-center">
                    <button
                      onClick={() => goToPage(3)}
                      className="w-full max-w-sm py-3 px-6 rounded-full bg-gradient-to-r from-[#DFB86C] via-[#E8A5B8] to-[#B3A9D9] text-[#362E48] font-sans text-xs tracking-widest uppercase font-bold shadow-md flex items-center justify-center gap-2 group hover:shadow-lg transition-all border border-white/60"
                    >
                      <span>Move Next →</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ================= PAGE 3: NEW BEAUTIFUL 3D BAKERY BIRTHDAY CAKE CEREMONY ================= */}
              {cardPage === 3 && (
                <motion.div
                  key="page-cake"
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full flex flex-col justify-between items-center text-center p-5 sm:p-7 relative z-10 overflow-hidden"
                >
                  {/* Subtle falling confetti sprinklings on card during celebrating */}
                  {cakeState === 'celebrating' && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={`sprinkle-${i}`}
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 350, opacity: [0, 0.8, 0], x: (i % 2 === 0 ? 15 : -15) }}
                          transition={{ duration: 3.5, delay: i * 0.3, repeat: Infinity }}
                          style={{ left: `${(i * 10) % 90 + 5}%` }}
                          className="absolute text-xs"
                        >
                          {i % 3 === 0 ? '✨' : i % 3 === 1 ? '🌸' : '⭐'}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Header Stage with HIGH CONTRAST Text Colors */}
                  <div className="relative z-20">
                    <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#DFB86C] font-bold block mb-1">
                      {cakeState === 'celebrating'
                        ? '🎆 CELEBRATION TIME 💖'
                        : cakeState === 'blown' || cakeState === 'cutting' || cakeState === 'cut'
                        ? 'WISH MADE ✨'
                        : 'MAGICAL BIRTHDAY CAKE'}
                    </span>
                    <h2 className="font-script text-3xl sm:text-4xl text-[#4A3B5C] font-semibold">
                      {cakeState === 'celebrating'
                        ? 'Let’s Celebrate! 💖'
                        : cakeState === 'blown' || cakeState === 'cutting' || cakeState === 'cut'
                        ? "Now let's cut the cake!"
                        : 'Make a Wish…'}
                    </h2>
                  </div>

                  {/* ================= NEW BEAUTIFUL 3D BAKERY CAKE MODEL ================= */}
                  <div className="relative my-auto flex flex-col items-center justify-center z-20 w-full max-w-xs">

                    {/* Wind Airflow Particles Stream during 'blowing' */}
                    {cakeState === 'blowing' && (
                      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={`wind-${i}`}
                            initial={{ x: -140, y: (i - 3) * 12, opacity: 0, scale: 0.5 }}
                            animate={{ x: 70, y: (i - 3) * 8, opacity: [0, 0.9, 0], scale: 1.2 }}
                            transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                            className="absolute text-xl text-white/90 font-mono"
                          >
                            💨
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Smoke Wisps rising from extinguished candle wicks */}
                    {(cakeState === 'blown' || cakeState === 'cutting' || cakeState === 'cut' || cakeState === 'celebrating') && (
                      <div className="absolute -top-8 z-30 flex gap-8 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={`smoke-${i}`}
                            initial={{ y: 0, opacity: 0.8, scale: 0.6 }}
                            animate={{ y: -35, opacity: 0, scale: 1.6 }}
                            transition={{ duration: 2, delay: i * 0.3 }}
                            className="text-xs text-[#5B4E87]/60 font-mono"
                          >
                            💨
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* REAL ANIMATED CANDLE FLAMES (Extinguish completely after blow!) */}
                    {(cakeState === 'lit' || cakeState === 'blowing') && (
                      <div className="absolute -top-7 z-30 flex gap-7 sm:gap-9 pointer-events-none">
                        {[...Array(3)].map((_, idx) => (
                          <motion.div
                            key={`flame-${idx}`}
                            animate={
                              cakeState === 'blowing'
                                ? { rotate: 45, skewX: 25, scale: [1, 0.3, 0], opacity: [1, 0.4, 0] }
                                : { scale: [1, 1.15, 0.95, 1], rotate: [-4, 4, -4], y: [0, -2, 0] }
                            }
                            transition={{
                              duration: cakeState === 'blowing' ? 1.4 : 1.1 + idx * 0.2,
                              repeat: cakeState === 'blowing' ? 0 : Infinity,
                              ease: "easeInOut",
                            }}
                            className="relative flex items-center justify-center"
                          >
                            <div className="absolute w-5 h-5 rounded-full bg-[#DFB86C]/60 blur-xs animate-pulse" />
                            <div className="w-3.5 h-5 rounded-full bg-gradient-to-t from-[#EF476F] via-[#FFD166] to-[#FFF3B0] shadow-md border border-white/40" />
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* CAKE CUTTING KNIFE ANIMATION (Visually Intersects Cake Body!) */}
                    {(cakeState === 'cutting' || cakeState === 'cut') && (
                      <motion.div
                        initial={{ x: 0, y: -90, opacity: 0, rotate: -20 }}
                        animate={
                          cakeState === 'cutting'
                            ? {
                                x: [0, 0, 0, 0],
                                y: [-90, -10, 60, -90],
                                opacity: [0, 1, 1, 0],
                                rotate: [-20, 0, 0, -20]
                              }
                            : { opacity: 0 }
                        }
                        transition={{ duration: 2.2, ease: "easeInOut" }}
                        className="absolute top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-5xl filter drop-shadow-2xl"
                      >
                        🔪
                      </motion.div>
                    )}

                    {/* ================= NEW GENERATED 3D BAKERY CAKE STRUCTURE ================= */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-10 flex flex-col items-center justify-center w-full my-2 cursor-pointer"
                    >
                      {/* Cake Topper */}
                      <div className="z-20 -mb-2 flex flex-col items-center">
                        <span className="font-script text-base text-[#DFB86C] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#DFB86C]/40 shadow-xs font-semibold">
                          Ram ✨
                        </span>
                        {/* Candle Wicks */}
                        <div className="flex gap-7 mt-1">
                          <div className="w-2.5 h-7 bg-gradient-to-b from-white via-[#FAF4EB] to-[#E8A5B8] rounded-t-sm shadow-xs border border-white/80" />
                          <div className="w-2.5 h-7 bg-gradient-to-b from-white via-[#FAF4EB] to-[#DFB86C] rounded-t-sm shadow-xs border border-white/80" />
                          <div className="w-2.5 h-7 bg-gradient-to-b from-white via-[#FAF4EB] to-[#B3A9D9] rounded-t-sm shadow-xs border border-white/80" />
                        </div>
                      </div>

                      {/* TOP TIER: Cream & Pink Frosting with Piped Details */}
                      <div className="w-44 h-16 bg-gradient-to-r from-[#FCEBE1] via-[#FFFDF9] to-[#FCEBE1] rounded-t-3xl border-2 border-white shadow-lg relative flex items-center justify-center overflow-hidden">
                        <div className="absolute top-1 inset-x-0 flex justify-around opacity-70">
                          <span className="text-[10px] text-[#E8A5B8]">🌸</span>
                          <span className="text-[10px] text-[#DFB86C]">✨</span>
                          <span className="text-[10px] text-[#E8A5B8]">🌸</span>
                        </div>
                        {/* Frosting Drips */}
                        <div className="absolute -bottom-2 inset-x-0 flex justify-around">
                          <div className="w-5 h-4 bg-[#FAF4EB] rounded-b-full"></div>
                          <div className="w-6 h-5 bg-[#FAF4EB] rounded-b-full"></div>
                          <div className="w-5 h-4 bg-[#FAF4EB] rounded-b-full"></div>
                        </div>
                      </div>

                      {/* BOTTOM TIER: Soft Rose Lavender Frosting with Gold Foil Band */}
                      <div className={`w-60 h-24 bg-gradient-to-r from-[#E8A5B8] via-[#FAF4EB] to-[#B3A9D9] rounded-b-3xl border-2 border-white shadow-2xl relative flex flex-col items-center justify-center transition-transform duration-700 ${
                        cakeState === 'cut' || cakeState === 'celebrating' ? 'translate-x-2' : ''
                      }`}>
                        <div className="w-full h-2 bg-[#DFB86C]/50 border-y border-white/60 mb-1" />
                        <span className="font-script text-2xl text-[#4A3B5C] font-semibold">
                          Happy Birthday
                        </span>
                      </div>

                      {/* Slice Cut Separation Line */}
                      {(cakeState === 'cut' || cakeState === 'celebrating') && (
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1 h-28 bg-gradient-to-b from-[#DFB86C] via-white to-transparent shadow-lg z-30 pointer-events-none"
                        />
                      )}

                      {/* Glass Cake Stand */}
                      <div className="w-68 h-4 rounded-full bg-white/50 backdrop-blur-md border border-white/80 shadow-md -mt-1"></div>
                    </motion.div>

                    {/* Soft Ambient Shadow Underneath Cake */}
                    <motion.div
                      animate={{ scale: [0.85, 1, 0.85], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-52 h-3.5 bg-[#251A36]/50 rounded-full blur-sm mt-1 z-0"
                    />
                  </div>

                  {/* ================= CONTROLS STAGE (HIGH CONTRAST TEXT) ================= */}
                  <div className="relative z-20 w-full max-w-sm mt-3">
                    {cakeState === 'lit' && (
                      <button
                        onClick={handleBlowCandles}
                        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#DFB86C] via-[#E8A5B8] to-[#B3A9D9] text-[#362E48] font-sans text-xs tracking-widest uppercase font-bold shadow-lg flex items-center justify-center gap-2 group hover:shadow-xl transition-all border border-white/60"
                      >
                        <Sparkles className="w-4 h-4 text-[#362E48]" />
                        <span>Blow The Candles ✨</span>
                      </button>
                    )}

                    {cakeState === 'blowing' && (
                      <div className="py-3 px-6 rounded-full glass-panel text-xs text-[#4A3B5C] uppercase tracking-widest font-semibold inline-flex items-center gap-2">
                        <span>💨 Blowing out candles…</span>
                      </div>
                    )}

                    {(cakeState === 'blown' || cakeState === 'cutting' || cakeState === 'cut' || cakeState === 'celebrating') && cakeState !== 'celebrating' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full flex flex-col items-center gap-2"
                      >
                        {cakeState === 'blown' && (
                          <button
                            onClick={handleCutCake}
                            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E8A5B8] via-[#B3A9D9] to-[#DFB86C] text-[#362E48] font-sans text-xs tracking-widest uppercase font-bold shadow-lg flex items-center justify-center gap-2 group hover:shadow-xl transition-all border border-white/60"
                          >
                            <span>Cut The Cake 🔪</span>
                          </button>
                        )}
                        {cakeState === 'cutting' && (
                          <div className="py-3 px-6 rounded-full glass-panel text-xs text-[#4A3B5C] uppercase tracking-widest font-semibold inline-flex items-center gap-2">
                            <span>🔪 Slicing the cake…</span>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {cakeState === 'celebrating' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex flex-col items-center gap-3"
                      >
                        <div className="p-3 glass-card rounded-xl border border-white w-full text-center">
                          <p className="font-script text-2xl text-[#4A3B5C] font-semibold">
                            {birthdayConfig.wishMessage}
                          </p>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={restartCakeCeremony}
                            className="flex-1 py-3 px-4 rounded-full glass-panel text-xs text-[#4A3B5C] uppercase tracking-widest font-bold hover:border-[#DFB86C] transition-all flex items-center justify-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Cut Again</span>
                          </button>
                          <button
                            onClick={restartCard}
                            className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#DFB86C] to-[#E8A5B8] text-[#362E48] font-sans text-xs tracking-widest uppercase font-bold shadow-md flex items-center justify-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Replay Card</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Photo Modal inside Card */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full glass-card p-5 rounded-2xl border border-white shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#5B4E87]"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-full rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 mb-3">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption}
                  style={{ objectFit: 'cover', objectPosition: 'center center' }}
                  className="w-full h-full"
                />
              </div>
              <p className="font-script text-2xl text-[#4A3B5C] text-center font-semibold">
                {selectedPhoto.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
