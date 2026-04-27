import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  ChevronDown,
  Info,
  AlertTriangle,
  Beaker,
  Thermometer,
  ShieldAlert,
  Sparkles,
  ClipboardList,
  Stethoscope,
} from 'lucide-react';

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
const MedicineUserCard = ({ medicine }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const chevronRef = useRef(null);
  const glowRef = useRef(null);
  const headerBarRef = useRef(null);
  const initialized = useRef(false);

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
          background: `radial-gradient(circle, rgba(251,188,0,0.15) 0%, transparent 70%)`,
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Beaker size={12} className="opacity-40" style={{ color: '#553722' }} />
            <span
              className="text-[9px] font-black uppercase tracking-[0.3em]"
              style={{ color: '#553722', opacity: 0.5 }}
            >
              Pharmaceutical Registry
            </span>
          </div>
          {medicine.isPrescriptionRequired && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{
                background: 'rgba(186,26,26,0.08)',
                color: '#ba1a1a',
                boxShadow: '0 0 12px rgba(186,26,26,0.15)',
              }}
            >
              <ShieldAlert size={10} />
              Rx Required
            </div>
          )}
        </div>

        <h3
          className="text-2xl md:text-3xl font-bold leading-tight mb-1"
          style={{ fontFamily: 'Noto Serif, serif', color: '#1a1c19' }}
        >
          {medicine.name}
        </h3>
        <p className="text-xs font-black uppercase tracking-widest mb-3 opacity-40" style={{ color: '#553722' }}>
          {medicine.genericName}
        </p>

        <p
          className="text-sm leading-relaxed mb-4 max-w-3xl"
          style={{ color: '#50443e', lineHeight: '1.7' }}
        >
          {medicine.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <StatBadge icon={ClipboardList} label="Dosage" value={medicine.dosage} color="#553722" />
          {medicine.sideEffects?.length > 0 && (
            <StatBadge icon={AlertTriangle} label="Side Effects" value={medicine.sideEffects.length} color="#b8620a" />
          )}
          {medicine.diseases?.length > 0 && (
            <StatBadge icon={Stethoscope} label="Related Conditions" value={medicine.diseases.length} color="#4a2060" />
          )}
        </div>

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
            {isExpanded ? 'Collapse Data' : 'View Full Details'}
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
          <div className="mt-5 mb-6 h-1.5 rounded-full overflow-hidden" style={{ background: '#e8e8e4' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, #725a39 0%, #fbbc00 100%)',
                boxShadow: '0 0 10px rgba(251,188,0,0.2)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Storage Info */}
            <div>
              <SectionHeader icon={Thermometer} title="Storage Protocol" color="#553722" />
              <div
                className="p-4 rounded-2xl text-sm font-medium"
                style={{ background: '#f4f4ef', color: '#1a1c19', borderLeft: '3px solid #553722' }}
              >
                {medicine.storage || 'No specific storage instructions provided.'}
              </div>
            </div>

            {/* Side Effects */}
            {medicine.sideEffects?.length > 0 && (
              <div>
                <SectionHeader icon={AlertTriangle} title="Potential Side Effects" color="#b8620a" />
                <div className="flex flex-wrap gap-2">
                  {medicine.sideEffects.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(184,98,10,0.08)', color: '#b8620a' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Diseases */}
            {medicine.diseases?.length > 0 && (
              <div className="md:col-span-2">
                <SectionHeader icon={Stethoscope} title="Related Therapeutic Conditions" color="#4a2060" />
                <div className="grid grid-cols-1 gap-4">
                  {medicine.diseases.map((d, i) => (
                    <div
                      key={d._id || i}
                      className="p-5 rounded-2xl transition-all hover:scale-[1.01]"
                      style={{
                        background: 'linear-gradient(135deg, #3c220e 0%, #553722 100%)',
                        boxShadow: '0 8px 24px rgba(85,55,34,0.15)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} style={{ color: '#fbbc00' }} />
                        <h5 className="font-bold text-lg" style={{ fontFamily: 'Noto Serif, serif', color: '#ffffff' }}>
                          {d.name}
                        </h5>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,220,198,0.85)' }}>
                        {d.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medicine Images */}
            {medicine.images?.length > 0 && (
              <div className="md:col-span-2">
                <SectionHeader icon={Info} title="Pharmaceutical Visuals" color="#553722" />
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {medicine.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`${medicine.name} visual ${i + 1}`}
                      className="w-44 h-28 object-cover rounded-2xl shrink-0 shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center gap-2 opacity-30">
            <Sparkles size={10} style={{ color: '#553722' }} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: '#553722' }}>
              Healthaxis Intelligence • Pharmacopoeia v1.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineUserCard;
