"use client";

import { CinematicFooter } from '../components/MotionFooter';
import { Link, useParams } from 'react-router';
import { useHospital } from '../hooks/useHospital.js';
import { useSelector } from 'react-redux';
import { CircleUser } from "lucide-react"


function Demo({ hospital, admin, loading, error }) {
  
  return (
    <div className="relative w-full bg-[#f8fafc] min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(52,211,153,0.05)_0%,transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <main className="relative z-10 w-full min-h-[140vh] flex flex-col items-center">

        {/* ── Hero Section ── */}
        <section className="h-screen flex flex-col items-center justify-center p-6 text-center border-b border-emerald-50 w-full mb-32">

          <div className="mb-8 group absolute right-5 top-5 group">
            <span className="px-6 py-2 rounded-full bg-white border border-emerald-100 text-blue-600 cursor-pointer active:scale-95 text-[10px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-2 shadow-sm group-hover:shadow-md transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <CircleUser />
              {admin?.name || "Hospital Admin"}
            </span>
          </div>

          <h1 className="relative text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-12">
            <span className="block italic footer-text-glow">HEALTH</span>
            <span className="block text-emerald-600 italic">AXIS AI</span>
            <div className="absolute -top-6 -right-12 text-[10px] font-black text-white bg-emerald-600 px-4 py-2 rounded-2xl shadow-xl shadow-emerald-200 uppercase tracking-widest rotate-12">
              Next-Gen
            </div>
          </h1>

          <p className="max-w-2xl text-slate-500 text-xl md:text-2xl font-medium leading-relaxed mb-16">
            The convergence of <span className="text-slate-900 font-bold border-b-2 border-emerald-500/20">Human Insight</span> and <span className="text-emerald-600 font-bold">Intelligent Precision</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-12 py-5 bg-emerald-600 rounded-full text-white font-black uppercase tracking-widest text-[11px] shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all active:scale-95 group flex items-center gap-2">
              Initiate Diagnostic
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button className="px-12 py-5 bg-white border border-emerald-100 rounded-full text-slate-900 font-black uppercase tracking-widest text-[11px] shadow-sm hover:bg-emerald-50 transition-all active:scale-95">
              Secure Cloud
            </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Discover More</span>
            <div className="w-px h-16 bg-linear-to-b from-emerald-500 to-transparent animate-bounce" />
          </div>
        </section>

        {/* ── Bento Content ── */}
        <section className="relative w-full max-w-6xl px-6 pb-40">
          <div className="mb-24 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 itali footer-text-glow">{hospital?.data?.name}</h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Global Healthcare Transformation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Card 1: Precision */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[40px] border border-emerald-50 bg-white p-10 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 blur-2xl rounded-full" />
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.244l-.28.19a2 2 0 00-.597 2.383l1.5 3A2 2 0 007.28 22h9.44a2 2 0 001.79-1.112l1.5-3a2 2 0 00-.597-2.383l-.28-.19z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Precision AI Lab</h3>
              <p className="text-slate-500 text-base leading-relaxed">Leveraging the world's most advanced diagnostic models to ensure 99.9% accuracy in early clinical assessments.</p>
              <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                Network Status: Optimal <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Card 2: Emergency */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[40px] border border-rose-50 bg-white p-10 shadow-sm hover:shadow-2xl hover:shadow-rose-100/30 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-8 shadow-inner group-hover:bg-rose-500 group-hover:text-white transition-all">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Rapid Pulse 24/7</h3>
              <p className="text-slate-500 text-base leading-relaxed">Integrated real-time response management ensuring zero-latency transitions from alert to clinical intervention.</p>
              <div className="mt-8">
                <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-rose-500 group-hover:w-full transition-all duration-1000" />
                </div>
              </div>
            </div>

            {/* Card 3: Global Reach */}
            <div className="md:col-span-1 group relative overflow-hidden rounded-[40px] border border-emerald-50 bg-white p-8 shadow-sm hover:shadow-xl transition-all">
              <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg></div>
              <h4 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 italic">12</h4>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Global Units Active</p>
            </div>

            {/* Card 4: Patient Trust & Join Network*/}
            <div className="md:col-span-3 group relative overflow-hidden rounded-[40px] bg-linear-to-br from-emerald-600 to-emerald-800 p-10 shadow-xl shadow-emerald-100/50 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
              <div className="relative z-10">
                <h3 className="text-4xl font-black text-white tracking-tight mb-4 leading-none">Your health is our primary protocol.</h3>
                <p className="text-emerald-50/70 text-lg max-w-md">Joining the network of 1.2M+ patients who trust Health Axis for their daily clinical needs.</p>
              </div>
              <Link to='https://chat.whatsapp.com/L7OXSObUNZABMDiXjmzNym?mode=gi_t' className="relative z-10 px-10 py-5 bg-white text-emerald-700 font-black uppercase tracking-widest text-[11px] rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
                Join WhatsApp
              </Link>
            </div>

          </div>
        </section>

      </main>

      {/* The Cinematic Footer is injected here */}
      <CinematicFooter 
        hospital = {hospital}
        admin = {admin}
      />

    </div>
  );
}

import React, { useEffect } from 'react'
import CreateHospital from '../components/CreateHospital.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import Loading from '../components/Loading.jsx';

const Hospital = () => {

  const { handleGetHospital, handleGetHospitalAdmin } = useHospital();

  const { hospital, hospitalAdmin, loading, error } = useSelector((state) => state.hospital);

  useEffect(() => {
    handleGetHospital();
    handleGetHospitalAdmin();
  }, [])

  if(loading){
    return <Loading/>
  }
  return (
    <div>
      {
        (!hospital || !hospitalAdmin) ?
          <CreateHospital />
          :
          <Demo
            hospital={hospital}
            admin={hospitalAdmin}
            loading={loading}
            error={error}
          />
      }

    </div>
  )
}

export default Hospital
