import React, { useEffect, useRef, useState } from 'react';

const CursorParticle = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mouseState, setMouseState] = useState({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  // ---- Particle class ----
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 3.5;
      this.vy = (Math.random() - 0.5) * 3.5;
      this.size = Math.random() * 9 + 3;
      this.maxLife = 45 + Math.random() * 35;
      this.life = this.maxLife;
      // vibrant hue range: cyan → purple → pink
      const hue = 200 + Math.random() * 80;
      this.color = `hsla(${hue}, 85%, 70%, 0.9)`;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.life -= 1;
      this.size *= 0.99;
    }

    draw(ctx) {
      const alpha = Math.min(1, (this.life / this.maxLife) * 1.3);
      const radius = Math.max(0.4, this.size * (this.life / this.maxLife));
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha * 0.85;
      // glow effect
      ctx.shadowColor = 'rgba(120, 200, 255, 0.5)';
      ctx.shadowBlur = 18;
      ctx.fill();
      // reset shadow for next draw
      ctx.shadowBlur = 0;
    }
  }

  // ---- setup canvas & mouse tracking ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      const pos = { x: e.clientX, y: e.clientY };
      mouseRef.current = pos;
      setMouseState(pos);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const pos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        mouseRef.current = pos;
        setMouseState(pos);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    handleResize();

    // ---- animation loop ----
    const animate = () => {
      if (!canvasRef.current) return;
      const width = canvas.width;
      const height = canvas.height;

      // clear with fade trail effect
      ctx.clearRect(0, 0, width, height);

      // add new particles at cursor position if cursor has coordinates
      if (mouseRef.current.x !== 0 || mouseRef.current.y !== 0) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(new Particle(mouseRef.current.x, mouseRef.current.y));
        }
      }

      // limit particles for performance
      if (particlesRef.current.length > 220) {
        particlesRef.current = particlesRef.current.slice(-180);
      }

      // update & draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // start animation
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none z-[9999]">
      {/* Canvas — fullscreen particle layer */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full block"
      />

      {/* invisible cursor follower for extra polish (optional) */}
      <div
        className="fixed w-4 h-4 rounded-full bg-white/5 border border-white/10 pointer-events-none"
        style={{
          left: mouseState.x - 8,
          top: mouseState.y - 8,
          transition: 'all 0.08s ease-out',
          boxShadow: '0 0 20px rgba(120, 200, 255, 0.15)',
        }}
      />
    </div>
  );
};

export default CursorParticle;