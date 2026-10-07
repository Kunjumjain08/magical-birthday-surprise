import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';

export default function LoadingScene({ onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isVideoFinished, setIsVideoFinished] = useState(false);

  // Real-time Canvas Chroma Keying Engine: Removes black background from bunny.mp4
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animId;

    const processFrame = () => {
      if (video && video.readyState >= 2) {
        // Set canvas resolution to match video aspect
        const w = video.videoWidth || 300;
        const h = video.videoHeight || 300;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }

        // Draw current video frame onto canvas
        ctx.drawImage(video, 0, 0, w, h);

        // Fetch frame pixels
        try {
          const frame = ctx.getImageData(0, 0, w, h);
          const d = frame.data;
          const len = d.length;

          // Black Background Removal Filter (Near-black pixels -> 100% transparent)
          for (let i = 0; i < len; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];

            // Threshold for black pixels
            if (r < 32 && g < 32 && b < 32) {
              d[i + 3] = 0; // Make 100% transparent
            } else if (r < 55 && g < 55 && b < 55) {
              // Smooth anti-aliased edge feathering for dark borders
              const maxC = Math.max(r, g, b);
              d[i + 3] = Math.floor(((maxC - 32) / 23) * 255);
            }
          }

          // Write transparent pixels back to canvas
          ctx.putImageData(frame, 0, 0);
        } catch (e) {
          console.warn("Chroma key frame processing error:", e);
        }
      }

      animId = requestAnimationFrame(processFrame);
    };

    processFrame();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Attempt video playback on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked or pending interaction:", err);
      });
    }
  }, []);

  // Update progress bar based on actual video currentTime / duration
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const pct = Math.min(Math.round((video.currentTime / video.duration) * 100), 100);
      setProgress(pct);
    }
  };

  // Video actual END event listener -> ONLY updates progress to 100% and sets isVideoFinished.
  // NO AUTOMATIC NAVIGATION! Page waits indefinitely for user click on "Step Inside →".
  const handleVideoEnded = () => {
    setProgress(100);
    setIsVideoFinished(true);
  };

  // Fallback log if video file is missing or blocked
  const handleVideoError = (e) => {
    console.error("Critical: Failed to load or play bunny.mp4 asset at path:", birthdayConfig.bunnyVideoUrl, e);
    setHasError(true);
  };

  // Simulated progress ONLY for the progress bar if video errors so progress bar still fills
  useEffect(() => {
    if (hasError) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsVideoFinished(true);
            return 100;
          }
          return prev + 4;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [hasError]);

  // Explicit User Navigation Click Handler
  const handleStepInside = () => {
    onComplete();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Soft Ambient Glow Background */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#B3A9D9]/20 to-[#E8A5B8]/20 blur-3xl animate-pulse-glow pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{
          opacity: 0,
          y: -20,
          transition: { duration: 0.4, ease: "easeOut" }
        }}
        className="relative flex flex-col items-center max-w-sm text-center z-10"
      >
        {/* Decorative Top Sparkle */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg text-[#DFB86C] mb-2"
        >
          ✨
        </motion.div>

        {/* ================= LIVE ANIMATED BUNNY VIDEO (290px - 356px LARGER SIZE) ================= */}
        <div className="relative w-[290px] h-[290px] sm:w-[356px] sm:h-[356px] flex items-center justify-center mb-2">
          {/* Dual Canvas Chroma-Keying & GPU Blend Mode for 100% Guaranteed Animation Visibility */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
            style={{ background: 'transparent' }}
          />
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            onClick={() => {
              if (videoRef.current && videoRef.current.paused) {
                videoRef.current.play();
              }
            }}
            style={{
              mixBlendMode: 'screen',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            className="w-full h-full object-contain relative z-10 cursor-pointer"
          >
            <source src={birthdayConfig.bunnyVideoUrl} type="video/mp4" />
            <source src="/bunny.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Loading Text */}
        <p className="font-serif text-lg md:text-xl text-[#E8E3F5] tracking-wide font-medium italic">
          wait… something special is coming…
        </p>

        {/* Video-Driven Progress Bar */}
        <div className="w-48 h-1.5 bg-[#E8E3F5]/30 rounded-full overflow-hidden mt-4 p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#DFB86C] via-[#E8A5B8] to-[#B3A9D9] rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <span className="text-xs font-sans text-[#E8E3F5]/80 mt-2 tracking-widest font-light">
          {progress}%
        </span>

        {/* ================= MANDATORY USER INTERACTION BUTTON ================= */}
        {/* NO AUTO-NAVIGATION! The page waits indefinitely for user click on this button. */}
        <motion.button
          onClick={handleStepInside}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DFB86C] via-[#E8A5B8] to-[#B3A9D9] text-[#362E48] font-sans text-xs tracking-widest uppercase font-bold shadow-lg shadow-[#DFB86C]/20 border border-white/60 flex items-center gap-2 group cursor-pointer hover:shadow-xl transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#362E48]" />
          <span>Step Inside →</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
