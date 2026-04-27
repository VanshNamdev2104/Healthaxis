import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  ChevronDown,
  Zap,
  Microscope,
  Shield,
  Home,
  AlertCircle,
  Flame,
  BookOpen,
  Sparkles,
} from 'lucide-react';

// ─── Severity map (based on symptom count) ─────────────────────────────────
const getSeverity = (count = 0) => {
  if (count >= 8) return { label: 'High Risk', color: '#ba1a1a', bg: 'rgba(186,26,26,0.08)', glow: 'rgba(186,26,26,0.25)' };
  if (count >= 5) return { label: 'Moderate', color: '#b8620a', bg: 'rgba(184,98,10,0.08)', glow: 'rgba(184,98,10,0.25)' };
  return { label: 'Low Risk', color: '#2e7d32', bg: 'rgba(46,125,50,0.08)', glow: 'rgba(46,125,50,0.25)' };
};

// ─── Stat Badge ─────────────────────────────────────────────────────────────
const StatBadge = ({ icon: Icon, label, value, color }) => (
  <div
    className="flex items-center gap-2 px-3 py-1.5 rounded-full font-manrope"
    style={{
      background: `${color}18`,
      border: `1px solid ${color}30`,
      boxShadow: `0 0 12px ${color}18`,
    }}
  >
    <Icon size={13} style={{ color }} />
    <span className="text-[11px] font-black uppercase tracking-wider" style={{ color }}>
      {value}
    </span>
    <span className="text-[10px] font-semibold opacity-60" style={{ color }}>
      {label}
    </span>
  </div>
);

// ─── Section Header ──────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, color = '#553722' }) => (
  <div className="flex items-center gap-2 mb-3">
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center"
      style={{ background: `${color}15`, boxShadow: `0 0 10px ${color}20` }}
    >
      <Icon size={14} style={{ color }} />
    </div>
    <h4
      className="text-[11px] font-black uppercase tracking-[0.18em]"
      style={{ color, fontFamily: 'Manrope, sans-serif' }}
    >
      {title}
    </h4>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const DiseaseUserCard = ({ disease }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const chevronRef = useRef(null);
  const glowRef = useRef(null);
  const headerBarRef = useRef(null);
  const initialized = useRef(false);

  const severity = getSeverity(disease?.symptoms?.length);

  // ── Accordion animation ──────────────────────────────────────────────────
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (!initialized.current) {
      gsap.set(el, { height: 0, opacity: 0, overflow: 'hidden' });
      initialized.current = true;
      return;
    }

    if (isExpanded) {
      gsap.set(el, { overflow: 'hidden' });
      gsap.to(el, {
        height: 'auto',
        opacity: 1,
        duration: 0.55,
        ease: 'expo.out',
        onComplete: () => gsap.set(el, { overflow: 'visible' }),
      });
      gsap.to(chevronRef.current, { rotate: 180, duration: 0.4, ease: 'back.out(1.5)' });
      // Glow pulse on expand
      gsap.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    } else {
      gsap.set(el, { overflow: 'hidden' });
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: 'power3.in' });
      gsap.to(chevronRef.current, { rotate: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, [isExpanded]);

  // ── Hover effects ────────────────────────────────────────────────────────
  const onEnter = useCallback(() => {
    gsap.to(cardRef.current, {
      y: -4,
      boxShadow: `0 24px 60px rgba(85,55,34,0.10), 0 0 0 2px rgba(251,188,0,0.30)`,
      duration: 0.35,
      ease: 'power2.out',
    });
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 8px 32px rgba(85,55,34,0.06)',
      duration: 0.35,
      ease: 'power2.inOut',
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative w-full rounded-3xl overflow-hidden"
      style={{
        background: '#ffffff',
        boxShadow: '0 8px 32px rgba(85,55,34,0.06)',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      {/* ── Ambient glow blob ────────────────────────────────────────────── */}
      <div
        ref={glowRef}
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none transition-opacity"
        style={{
          background: `radial-gradient(circle, ${severity.glow} 0%, transparent 70%)`,
          filter: 'blur(24px)',
          opacity: isExpanded ? 1 : 0.3,
        }}
      />

      {/* ── Gradient header bar ──────────────────────────────────────────── */}
      <div
        ref={headerBarRef}
        className="h-1.5 w-full"
        style={{ background: 'linear-gradient(135deg, #3c220e 0%, #553722 50%, #fbbc00 100%)' }}
      />

      {/* ── Collapsed / Always-visible header ───────────────────────────── */}
      <div
        className="relative p-6 cursor-pointer select-none"
        onClick={() => setIsExpanded((v) => !v)}
      >
        {/* Top row: Registry label + Severity badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={12} className="opacity-40" style={{ color: '#553722' }} />
            <span
              className="text-[9px] font-black uppercase tracking-[0.3em]"
              style={{ color: '#553722', opacity: 0.5 }}
            >
              Medical Codex
            </span>
          </div>
          {/* Severity pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
            style={{
              background: severity.bg,
              color: severity.color,
              boxShadow: `0 0 12px ${severity.glow}`,
            }}
          >
            <Flame size={10} />
            {severity.label}
          </div>
        </div>

        {/* Disease name */}
        <h3
          className="text-2xl md:text-3xl font-bold leading-tight mb-2"
          style={{ fontFamily: 'Noto Serif, serif', color: '#1a1c19' }}
        >
          {disease?.name}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4 max-w-3xl"
          style={{ color: '#50443e', lineHeight: '1.7' }}
        >
          {disease?.description}
        </p>

        {/* Stat badges row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(disease?.symptoms?.length > 0) && (
            <StatBadge icon={Zap} label="Symptoms" value={disease.symptoms.length} color="#b8620a" />
          )}
          {(disease?.causes?.length > 0) && (
            <StatBadge icon={Microscope} label="Causes" value={disease.causes.length} color="#553722" />
          )}
          {(disease?.precautions?.length > 0) && (
            <StatBadge icon={Shield} label="Precautions" value={disease.precautions.length} color="#2e7d32" />
          )}
          {(disease?.homeRemedies?.length > 0) && (
            <StatBadge icon={Home} label="Remedies" value={disease.homeRemedies.length} color="#725a39" />
          )}
        </div>

        {/* Expand button */}
        <div className="flex items-center gap-2 mt-1">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all"
            style={{
              background: isExpanded ? '#553722' : '#f4f4ef',
              color: isExpanded ? '#fff' : '#553722',
              boxShadow: isExpanded ? '0 0 20px rgba(85,55,34,0.30)' : 'none',
            }}
          >
            <Sparkles size={12} />
            {isExpanded ? 'Collapse Entry' : 'Explore Entry'}
          </div>
          <div
            ref={chevronRef}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: '#f4f4ef', color: '#553722' }}
          >
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* ── Expanded content ─────────────────────────────────────────────── */}
      <div ref={contentRef}>
        <div
          className="px-6 pb-8"
          style={{ borderTop: '1px solid rgba(212,195,186,0.25)' }}
        >
          {/* XP-bar divider */}
          <div className="mt-5 mb-6 h-1.5 rounded-full overflow-hidden" style={{ background: '#e8e8e4' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(((disease?.symptoms?.length || 0) / 12) * 100, 100)}%`,
                background: 'linear-gradient(90deg, #725a39 0%, #fbbc00 100%)',
                boxShadow: '0 0 10px rgba(251,188,0,0.4)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Symptoms */}
            {disease?.symptoms?.length > 0 && (
              <div>
                <SectionHeader icon={Zap} title="Key Symptoms" color="#b8620a" />
                <div className="flex flex-wrap gap-2">
                  {disease.symptoms.map((s, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(184,98,10,0.08)', color: '#b8620a' }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: '#b8620a', boxShadow: '0 0 6px #b8620a' }}
                      />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Causes */}
            {disease?.causes?.length > 0 && (
              <div>
                <SectionHeader icon={Microscope} title="Potential Causes" color="#553722" />
                <div className="flex flex-col gap-2">
                  {disease.causes.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
                      style={{
                        background: '#f4f4ef',
                        borderLeft: '3px solid #553722',
                        color: '#1a1c19',
                      }}
                    >
                      <Microscope size={13} style={{ color: '#553722', flexShrink: 0 }} />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Precautions */}
            {disease?.precautions?.length > 0 && (
              <div>
                <SectionHeader icon={Shield} title="Precautions" color="#2e7d32" />
                <div className="flex flex-wrap gap-2">
                  {disease.precautions.map((p, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(46,125,50,0.08)',
                        color: '#2e7d32',
                        border: '1px solid rgba(46,125,50,0.20)',
                      }}
                    >
                      <Shield size={10} />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Home Remedies */}
            {disease?.homeRemedies?.length > 0 && (
              <div>
                <SectionHeader icon={Home} title="Home Remedies" color="#725a39" />
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, #3c220e 0%, #553722 100%)',
                    boxShadow: '0 8px 24px rgba(85,55,34,0.20)',
                  }}
                >
                  <ul className="space-y-2">
                    {disease.homeRemedies.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm font-medium"
                        style={{ color: 'rgba(255,220,198,0.9)' }}
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: '#fbbc00', boxShadow: '0 0 6px #fbbc00' }}
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Diagnosis */}
            {disease?.diagnosis?.length > 0 && (
              <div className="md:col-span-2">
                <SectionHeader icon={AlertCircle} title="Diagnosis Methods" color="#4a2060" />
                <div className="flex flex-wrap gap-2">
                  {disease.diagnosis.map((d, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 rounded-xl text-sm font-bold"
                      style={{
                        background: '#ffffff',
                        color: '#1a1c19',
                        boxShadow: '0 2px 12px rgba(85,55,34,0.08)',
                        border: '1px solid rgba(212,195,186,0.4)',
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {disease?.images?.length > 0 && (
              <div className="md:col-span-2">
                <SectionHeader icon={BookOpen} title="Clinical Visuals" color="#553722" />
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {disease.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`${disease.name} visual ${i + 1}`}
                      className="w-44 h-28 object-cover rounded-2xl shrink-0"
                      style={{ boxShadow: '0 4px 16px rgba(85,55,34,0.12)' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer stamp */}
          <div className="mt-6 flex items-center gap-2 opacity-30">
            <Sparkles size={10} style={{ color: '#553722' }} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: '#553722' }}>
              Healthaxis • Therapeutic Library
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseUserCard;
