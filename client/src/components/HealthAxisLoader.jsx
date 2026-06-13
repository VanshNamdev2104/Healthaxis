import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const HealthAxisLoader = ({
  onComplete,
  duration = 4800,
  organizationName = "HealthAxis"
}) => {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("");
  const [stats, setStats] = useState({ records: "0", networks: "0", uptime: "0.00" });
  const [exitState, setExitState] = useState(false);

  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const statusBarRef = useRef(null);
  const logoHeartbeatRef = useRef(null);
  const ecgRef = useRef(null);
  const ecgContainerRef = useRef(null);
  const gridFlashRef = useRef(null);
  const flashRef = useRef(null);
  const overlayRef = useRef(null);

  // Floating Icons Refs
  const heartRef = useRef(null);
  const dnaRef = useRef(null);
  const shieldRef = useRef(null);
  const brainRef = useRef(null);

  // Load GSAP CDN dynamically if not already present
  useEffect(() => {
    const loadScript = (url, id) => {
      return new Promise((resolve) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = url;
        script.id = id;
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", "gsap-core-cdn"),
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", "gsap-st-cdn")
    ]).then(() => {
      setGsapLoaded(true);
    });
  }, []);

  // System clock handler
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hrs}:${mins}:${secs}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Particle field (Canvas 2D)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const numParticles = 60;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 1
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#050C17";
      ctx.fillRect(0, 0, width, height);

      // Faint neural-network connections
      ctx.strokeStyle = "rgba(0, 212, 255, 0.04)";
      ctx.lineWidth = 0.8;
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles drawing
      ctx.fillStyle = "rgba(0, 212, 255, 0.3)";
      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // GSAP Animations orchestrator
  useEffect(() => {
    if (!gsapLoaded) return;
    const gsap = window.gsap;

    // Prefers-reduced-motion fallback
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setTimeout(() => {
        setProgress(100);
        setStats({ records: "847,293", networks: "12", uptime: "99.97" });
        if (onComplete) onComplete();
      }, 0);
      return;
    }

    // 1. Initial Entrances Timeline
    const entryTl = gsap.timeline();
    
    // Status Bar down
    entryTl.fromTo(
      statusBarRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );

    // Main Card Scale in
    entryTl.fromTo(
      cardRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "expo.out" },
      "-=0.6"
    );

    // Logo SVG draw-on
    entryTl.fromTo(
      logoHeartbeatRef.current,
      { strokeDashoffset: 160, strokeDasharray: 160 },
      { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" },
      "-=0.6"
    );

    // Stagger floaters in
    gsap.fromTo(
      ".floating-icon-card",
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.15, ease: "back.out(1.7)", delay: 1.4 }
    );

    // Ambient floating loops
    gsap.to(heartRef.current, { scale: 1.08, duration: 1, yoyo: true, repeat: -1, ease: "power1.inOut" });
    gsap.to(dnaRef.current, { rotation: 360, duration: 8, repeat: -1, ease: "none" });
    gsap.to(shieldRef.current, { y: -10, duration: 2, yoyo: true, repeat: -1, ease: "power1.inOut" });
    gsap.to(brainRef.current, { opacity: 0.7, duration: 1.5, yoyo: true, repeat: -1, ease: "power1.inOut" });

    // 2. ECG Heartbeat strip horizontal scrolling
    gsap.to(ecgRef.current, {
      x: -200,
      duration: 2.5,
      ease: "none",
      repeat: -1
    });

    // 3. Heartbeat visual QRS spikes synchronization
    const heartbeatPulseTl = gsap.timeline({ repeat: -1 });
    heartbeatPulseTl
      .to(logoHeartbeatRef.current, { stroke: "#FF4757", scale: 1.15, duration: 0.12, ease: "power1.out", delay: 0.8 })
      .to(logoHeartbeatRef.current, { stroke: "#00D4FF", scale: 1.0, duration: 0.3, ease: "power1.in" })
      .to(gridFlashRef.current, { opacity: 0.15, duration: 0.1, ease: "power1.out" }, "<")
      .to(gridFlashRef.current, { opacity: 0, duration: 0.3, ease: "power1.in" })
      .to(ecgContainerRef.current, { filter: "drop-shadow(0 0 12px #00D4FF) brightness(1.4)", duration: 0.12 }, "<")
      .to(ecgContainerRef.current, { filter: "drop-shadow(0 0 6px #00D4FF) brightness(1.0)", duration: 0.3 });

    // 4. Progress Loading Sequence
    const progressObj = { value: 0 };
    gsap.to(progressObj, {
      value: 100,
      duration: duration / 1000,
      ease: "power1.inOut",
      delay: 0.8,
      onUpdate: () => {
        setProgress(Math.floor(progressObj.value));
      },
      onComplete: () => {
        // Morph text and execute exit sequence
        setExitState(true);
        const exitTl = gsap.timeline();
        
        exitTl
          // Center radial gradient bloom flash
          .to(flashRef.current, { opacity: 1, duration: 0.25, ease: "power2.out" })
          // Fade/Scale out components
          .to(
            [cardRef.current, statusBarRef.current, ecgContainerRef.current, ".floating-icon-card"],
            { scale: 0.95, opacity: 0, duration: 0.6, ease: "power2.inOut" },
            "<"
          )
          // White flash frame transition
          .to(flashRef.current, { opacity: 0, duration: 0.2 })
          .to(overlayRef.current, { backgroundColor: "#ffffff", opacity: 1, duration: 0.08 })
          // Black screen handoff
          .to(overlayRef.current, {
            backgroundColor: "#050C17",
            duration: 0.45,
            onComplete: () => {
              
              if (onComplete) onComplete();
            }
          });
      }
    });

    // 5. Stats counter sequence
    const statsObj = { records: 0, networks: 0, uptime: 0 };
    gsap.to(statsObj, {
      records: 847293,
      networks: 12,
      uptime: 99.97,
      duration: 3.5,
      delay: 1.2,
      ease: "power3.out",
      onUpdate: () => {
        setStats({
          records: Math.floor(statsObj.records).toLocaleString(),
          networks: Math.floor(statsObj.networks),
          uptime: statsObj.uptime.toFixed(2)
        });
      }
    });

    return () => {
      gsap.killTweensOf("*");
      heartbeatPulseTl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gsapLoaded]);

  // Generating coordinates for repeating ECG Waveform
  const generateECGPoints = () => {
    let points = [];
    const cycleWidth = 200;
    const numCycles = 15;
    for (let i = 0; i < numCycles; i++) {
      const start = i * cycleWidth;
      points.push(`${start},50`);
      points.push(`${start + 30},50`);
      points.push(`${start + 40},43`);
      points.push(`${start + 45},50`);
      points.push(`${start + 55},50`);
      points.push(`${start + 60},65`);
      points.push(`${start + 65},10`);
      points.push(`${start + 70},80`);
      points.push(`${start + 75},50`);
      points.push(`${start + 85},50`);
      points.push(`${start + 95},42`);
      points.push(`${start + 105},50`);
      points.push(`${start + 200},50`);
    }
    return points.join(" ");
  };

  const checklistItems = [
    { text: "Establishing encrypted tunnel", threshold: 15 },
    { text: "Loading clinical NLP models (3.2GB)", threshold: 30 },
    { text: "Syncing patient schema validator", threshold: 45 },
    { text: "Calibrating diagnostic inference engine", threshold: 62 },
    { text: "Verifying HIPAA compliance modules", threshold: 78 },
    { text: "Initializing HealthAxis Core v4.2", threshold: 95 }
  ];

  // Circle properties for 120px diameter arc (stroke-dasharray: 314.16)
  const radius = 50;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050C17] text-[#E8F4FD] select-none font-sans">
      {/* Import Premium Google Fonts via CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@500;700&display=swap');
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }
        .font-body { font-family: 'Inter', sans-serif; }
      `}} />

      {/* Layer 0: Canvas Particle Field */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-[0]" aria-hidden="true" />

      {/* Layer 1: HUD Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
        aria-hidden="true"
      />

      {/* Heartbeat Grid Flash */}
      <div
        ref={gridFlashRef}
        className="absolute inset-0 pointer-events-none bg-radial-gradient from-[#00D4FF]/30 to-transparent opacity-0 z-[1] transition-opacity duration-75"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)"
        }}
        aria-hidden="true"
      />

      {/* Layer 2: Floating Medical Icons */}
      <div className="absolute inset-0 pointer-events-none z-[2] hidden sm:block">
        {/* Heart Icon - Top Right */}
        <div className="floating-icon-card absolute top-[15%] right-[10%] bg-[#0A1628]/40 backdrop-blur-md border border-[#00D4FF]/10 p-3.5 rounded-[16px] opacity-0 shadow-[0_8px_32px_rgba(5,12,23,0.3)]">
          <div ref={heartRef} style={{ transformOrigin: "center" }}>
            <svg className="w-8 h-8 text-[#00D4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
        </div>

        {/* DNA Icon - Left Middle */}
        <div className="floating-icon-card absolute top-[45%] left-[8%] bg-[#0A1628]/40 backdrop-blur-md border border-[#00D4FF]/10 p-3.5 rounded-[16px] opacity-0 shadow-[0_8px_32px_rgba(5,12,23,0.3)]">
          <div ref={dnaRef} style={{ transformOrigin: "center" }}>
            <svg className="w-8 h-8 text-[#7B61FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 10.5C4.5 7.5 7.5 4.5 10.5 4.5" />
              <path d="M13.5 19.5C16.5 19.5 19.5 16.5 19.5 13.5" />
              <path d="M9 9l6 6" />
              <path d="M6 18a6 6 0 0 1 12-12" />
              <circle cx="6" cy="18" r="1.5" fill="currentColor" />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Shield with Cross - Bottom Left */}
        <div className="floating-icon-card absolute bottom-[22%] left-[12%] bg-[#0A1628]/40 backdrop-blur-md border border-[#00D4FF]/10 p-3.5 rounded-[16px] opacity-0 shadow-[0_8px_32px_rgba(5,12,23,0.3)]">
          <div ref={shieldRef} style={{ transformOrigin: "center" }}>
            <svg className="w-8 h-8 text-[#00FF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v8" />
              <path d="M9 12h6" />
            </svg>
          </div>
        </div>

        {/* Brain Icon - Top Left */}
        <div className="floating-icon-card absolute top-[18%] left-[10%] bg-[#0A1628]/40 backdrop-blur-md border border-[#00D4FF]/10 p-3.5 rounded-[16px] opacity-0 shadow-[0_8px_32px_rgba(5,12,23,0.3)]">
          <div ref={brainRef} style={{ transformOrigin: "center" }}>
            <svg className="w-8 h-8 text-[#00D4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Layer 5: Top Status Bar */}
      <header
        ref={statusBarRef}
        className="absolute top-0 left-0 w-full px-6 py-4 flex items-center justify-between border-b border-[#00D4FF]/10 bg-[#050C17]/80 backdrop-blur-sm z-[5] opacity-0"
      >
        <div className="font-mono-custom text-xs text-[#4A7FA5] tracking-widest uppercase">
          HEALTHAXIS OS v4.2.1
        </div>
        <div className="flex items-center gap-6 font-mono-custom text-xs">
          <div className="text-[#E8F4FD] font-semibold">{time}</div>
          <div className="flex items-center gap-2 text-[#00FF88]">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="tracking-wider font-semibold">SECURE CONNECTION</span>
          </div>
        </div>
      </header>

      {/* Layer 3: Main Centered Card */}
      <main className="absolute inset-0 flex items-center justify-center px-4 z-[3]">
        <div
          ref={cardRef}
          className="w-full max-w-[480px] bg-[#0A1628]/60 backdrop-blur-xl border border-[#00D4FF]/15 p-8 rounded-[24px] shadow-[0_16px_64px_rgba(5,12,23,0.6)] opacity-0 relative"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <path
                  ref={logoHeartbeatRef}
                  d="M 10,50 L 35,50 L 42,30 L 48,70 L 54,45 L 58,55 L 62,50 L 90,50"
                  stroke="#00D4FF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transformOrigin: "center" }}
                />
              </svg>
            </div>
            <h1 className="font-space text-4xl font-bold tracking-tight text-[#E8F4FD]">
              {organizationName}
            </h1>
            <p className="font-body text-sm text-[#4A7FA5] mt-1 font-medium">
              {exitState ? "Initializing Dashboard..." : "Clinical Intelligence Platform"}
            </p>
          </div>

          {/* Progress Arc */}
          <div className="flex justify-center mb-8">
            <div
              className={`relative rounded-full p-2 transition-all duration-500 ${
                progress > 80
                  ? "shadow-[0_0_30px_rgba(0,212,255,0.25)] border border-[#00D4FF]"
                  : "border border-[#00D4FF]/10"
              }`}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <svg className="w-[120px] h-[120px] transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(0, 212, 255, 0.05)"
                  strokeWidth={strokeWidth}
                />
                {/* Active Arc */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="#00D4FF"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-75"
                />
              </svg>
              {/* Counter Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono-custom text-3xl font-bold text-[#E8F4FD]">
                  {progress}%
                </span>
                <span className="font-mono-custom text-[9px] uppercase tracking-wider text-[#4A7FA5]">
                  Engine
                </span>
              </div>
            </div>
          </div>

          {/* AI Initialization Checklist */}
          <div className="space-y-3.5 mb-8" role="status" aria-live="polite">
            {checklistItems.map((item, idx) => {
              const prevThreshold = idx === 0 ? 0 : checklistItems[idx - 1].threshold;
              const isComplete = progress >= item.threshold;
              const isActive = progress >= prevThreshold && progress < item.threshold;

              let icon;
              let itemClass = "font-mono-custom text-xs transition-colors duration-300 ";

              if (isComplete) {
                itemClass += "text-[#00FF88]/90 font-medium";
                icon = (
                  <svg className="w-4 h-4 text-[#00FF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                );
              } else if (isActive) {
                itemClass += "text-[#00D4FF] font-bold";
                icon = (
                  <svg className="w-4 h-4 text-[#00D4FF] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="12" y1="18" x2="12" y2="22" />
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                    <line x1="2" y1="12" x2="6" y2="12" />
                    <line x1="18" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                  </svg>
                );
              } else {
                itemClass += "text-[#4A7FA5]/60";
                icon = (
                  <svg className="w-4 h-4 text-[#4A7FA5]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                );
              }

              return (
                <div key={idx} className={`flex items-center gap-3 ${itemClass}`}>
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {icon}
                  </div>
                  <span className="relative inline-block overflow-hidden">
                    {item.text}
                    <span
                      className="absolute left-0 top-1/2 h-[1px] bg-[#00FF88] transition-all duration-500 ease-out"
                      style={{ width: isComplete ? "100%" : "0%" }}
                    />
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Statistics Bar */}
          <div className="border-t border-[#00D4FF]/10 pt-6">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="font-mono-custom text-sm font-bold text-[#E8F4FD]">
                  {stats.records}
                </div>
                <div className="font-mono-custom text-[8px] uppercase tracking-wider text-[#4A7FA5] mt-1">
                  Records
                </div>
              </div>
              <div>
                <div className="font-mono-custom text-sm font-bold text-[#E8F4FD]">
                  {stats.networks}
                </div>
                <div className="font-mono-custom text-[8px] uppercase tracking-wider text-[#4A7FA5] mt-1">
                  Networks
                </div>
              </div>
              <div>
                <div className="font-mono-custom text-sm font-bold text-[#E8F4FD]">
                  {stats.uptime}%
                </div>
                <div className="font-mono-custom text-[8px] uppercase tracking-wider text-[#4A7FA5] mt-1">
                  Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Layer 4: ECG Heartbeat Strip */}
      <footer
        ref={ecgContainerRef}
        className="absolute bottom-0 left-0 w-full h-[20%] border-t border-[#00D4FF]/10 bg-[#050C17]/95 overflow-hidden z-[4]"
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#00D4FF 1px, transparent 1px)",
            backgroundSize: "100% 10px"
          }}
        />
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100" fill="none">
          <g ref={ecgRef}>
            <polyline
              points={generateECGPoints()}
              stroke="#00D4FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </footer>

      {/* Transition: Radial bloom flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none opacity-0 z-[10]"
        style={{
          background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(5,12,23,0) 80%)"
        }}
        aria-hidden="true"
      />

      {/* Transition: Final frame flash / Black handoff */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none opacity-0 bg-transparent z-[20]"
        aria-hidden="true"
      />
    </div>
  );
};

HealthAxisLoader.propTypes = {
  onComplete: PropTypes.func,
  duration: PropTypes.number,
  organizationName: PropTypes.string
};

export default HealthAxisLoader;
