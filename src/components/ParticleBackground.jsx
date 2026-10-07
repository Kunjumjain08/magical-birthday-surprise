import React, { useEffect, useRef } from 'react';

export default function ParticleBackground({ themeMode = 'dream' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palette for dream sparkles
    const colors = [
      'rgba(223, 184, 108, ',  // Champagne gold
      'rgba(232, 165, 184, ',  // Soft rose
      'rgba(179, 169, 217, ',  // Dusty lavender
      'rgba(252, 235, 225, ',  // Soft peach
      'rgba(227, 237, 247, ',  // Powder blue
    ];

    const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.5 + 0.8;
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(Math.random() * 0.5 + 0.15); // gentle upward float
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.pulseDir = 1;
        this.isStar = Math.random() > 0.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Twinkle/pulse alpha
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha >= 0.85) this.pulseDir = -1;
        if (this.alpha <= 0.15) this.pulseDir = 1;

        // Reset if floating out of bounds
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
          this.y = height + 10;
        }
      }

      draw() {
        ctx.save();
        ctx.fillStyle = `${this.baseColor}${this.alpha})`;
        ctx.shadowBlur = this.radius * 4;
        ctx.shadowColor = `${this.baseColor}0.8)`;

        if (this.isStar) {
          // Draw tiny 4-pointed star
          ctx.beginPath();
          const r = this.radius * 1.8;
          ctx.moveTo(this.x, this.y - r);
          ctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
          ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + r);
          ctx.quadraticCurveTo(this.x, this.y, this.x - r, this.y);
          ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - r);
          ctx.fill();
        } else {
          // Soft circular glowing dust particle
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Interactive mouse / touch dust trail
    const touchParticles = [];
    const handleMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      const y = e.clientY || (e.touches && e.touches[0]?.clientY);
      if (x && y && Math.random() > 0.5) {
        touchParticles.push({
          x,
          y,
          radius: Math.random() * 3 + 1,
          alpha: 0.9,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render main atmospheric sparkles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Render touch trail sparkles
      for (let i = touchParticles.length - 1; i >= 0; i--) {
        const tp = touchParticles[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.alpha -= 0.025;

        if (tp.alpha <= 0) {
          touchParticles.splice(i, 1);
        } else {
          ctx.save();
          ctx.fillStyle = `${tp.color}${tp.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = tp.color + '0.9)';
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
}
