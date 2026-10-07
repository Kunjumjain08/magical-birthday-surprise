import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.onclick ||
          target.closest('button') ||
          target.closest('.cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Outer subtle glow ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#DFB86C]/50 transition-transform duration-150 ease-out ${
          isHovered ? 'w-10 h-10 -mt-5 -ml-5 bg-[#DFB86C]/10 backdrop-blur-2xs scale-125' : 'w-6 h-6 -mt-3 -ml-3'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />

      {/* Inner glowing dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 -mt-1 -ml-1 pointer-events-none z-50 rounded-full bg-[#DFB86C] shadow-lg shadow-[#DFB86C]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
    </>
  );
}
