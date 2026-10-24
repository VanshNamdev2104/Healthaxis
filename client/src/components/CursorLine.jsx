// CursorGlow.jsx - Premium cursor animation with multiple effects
import React, { useEffect, useRef, useState } from 'react';

const CursorGlow = () => {
  const canvasRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const particlesRef = useRef([]);
  const sparklesRef = useRef([]);
  const animationRef = useRef(null);

  // Main particle class with gradient colors
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 6 + 2;
      this.life = 1;
      this.decay = 0.008 + Math.random() * 0.015;
      this.hue = 200 + Math.random() * 60; // Blue to purple range
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.life -= this.decay;
      this.size *= 0.995;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      
      const alpha = this.life;
      const radius = this.size * this.life;
      
      // Glow effect
      ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${alpha * 0.5})`;
      ctx.shadowBlur = 20;
      
      // Main circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha * 0.8})`;
      ctx.fill();
      
      // Inner bright core
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(this.x, this.y, radius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue + 30}, 100%, 90%, ${alpha * 0.6})`;
      ctx.fill();
    }
  }

  // Sparkle class for extra flair
  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.02 + Math.random() * 0.03;
      this.life = 1;
      this.decay = 0.02 + Math.random() * 0.02;
      this.distance = Math.random() * 30 + 10;
    }

    update() {
      this.angle += this.speed;
      this.life -= this.decay;
      this.size *= 0.99;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      
      const x = this.x + Math.cos(this.angle) * this.distance * (1 - this.life);
      const y = this.y + Math.sin(this.angle) * this.distance * (1 - this.life);
      
      ctx.shadowColor = `rgba(255, 255, 255, ${this.life * 0.3})`;
      ctx.shadowBlur = 10;
      
      // Star shape
      const size = this.size * this.life;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + this.angle;
        const radius = i % 2 === 0 ? size : size * 0.3;
        const xPos = x + Math.cos(angle) * radius;
        const yPos = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 255, 255, ${this.life * 0.8})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        setMouse({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    handleResize();

    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(11, 13, 21, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Emit particles
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(new Particle(mouse.x, mouse.y));
      }

      // Emit sparkles occasionally
      if (Math.random() < 0.3) {
        sparklesRef.current.push(new Sparkle(mouse.x, mouse.y));
      }

      // Limit particles
      if (particlesRef.current.length > 200) {
        particlesRef.current = particlesRef.current.slice(-150);
      }
      if (sparklesRef.current.length > 50) {
        sparklesRef.current = sparklesRef.current.slice(-40);
      }

      // Draw connecting lines between nearby particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length - 1; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80 && particles[i].life > 0.3 && particles[j].life > 0.3) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - distance / 80) * 0.2;
            ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.shadowColor = `rgba(100, 200, 255, ${alpha * 0.3})`;
            ctx.shadowBlur = 5;
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      // Update and draw sparkles
      for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
        const s = sparklesRef.current[i];
        s.update();
        s.draw(ctx);
        if (s.life <= 0) {
          sparklesRef.current.splice(i, 1);
        }
      }

      // Draw cursor ring
      const time = Date.now() * 0.002;
      const ringRadius = 25 + Math.sin(time) * 3;
      
      // Outer ring
      ctx.shadowColor = 'rgba(100, 180, 255, 0.3)';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${210 + Math.sin(time) * 20}, 100%, 70%, 0.4)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Inner ring
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, ringRadius * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${240 + Math.cos(time * 0.7) * 20}, 100%, 80%, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.shadowBlur = 0;

      // Draw center glow
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 30);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(0.5, 'rgba(100, 180, 255, 0.08)');
      gradient.addColorStop(1, 'rgba(100, 180, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

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
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
};

export default CursorGlow;