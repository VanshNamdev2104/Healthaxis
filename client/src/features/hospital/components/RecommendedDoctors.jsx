import React, { useState, useEffect } from "react";
import { Stethoscope, Star, Sparkles, MapPin, DollarSign, Brain, Search, Loader2 } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";
import EmergencyAlert from "./EmergencyAlert.jsx";

export default function RecommendedDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Search constraints
    const [symptoms, setSymptoms] = useState("");
    const [budget, setBudget] = useState("");
    const [location, setLocation] = useState("");

    // Emergency overlay states
    const [emergencyOpen, setEmergencyOpen] = useState(false);
    const [emergencyTrigger, setEmergencyTrigger] = useState("");

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (symptoms) queryParams.append("symptoms", symptoms);
            if (budget) queryParams.append("budget", budget);
            if (location) queryParams.append("location", location);

            const response = await axiosInstance.get(`/api/doctors/recommendations/list?${queryParams.toString()}`);
            if (response.data?.success) {
                setDoctors(response.data.data.slice(0, 3)); // show top 3 recommendations
            }
        } catch (err) {
            console.error("Doctor recommendations fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Scan symptoms for critical cardiovascular/neurologic emergency keywords
        const emergencyKeywords = ["chest pain", "breathing issue", "difficulty breathing", "stroke", "heart attack", "unconscious", "chest discomfort"];
        const matched = emergencyKeywords.find(kw => symptoms.toLowerCase().includes(kw));
        
        if (matched) {
            setEmergencyTrigger(matched);
            setEmergencyOpen(true);
        }

        fetchRecommendations();
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[32px] p-6 shadow-sm">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500 shrink-0" />
                    AI Practitioner Recommendation Engine
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mt-0.5">
                    Describe your symptoms and find the most highly compatible healthcare professionals in our network.
                </p>
            </div>

            {/* Filter Inputs Form */}
            <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div className="sm:col-span-2 flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 pl-0.5">
                        Describe Symptoms
                    </label>
                    <input
                        type="text"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="e.g. chest discomfort, headache, rash"
                        className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all font-semibold"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 pl-0.5">
                        Preferred City
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all font-semibold"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 pl-0.5">
                        Max Consultation Fee
                    </label>
                    <div className="relative flex items-center">
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all font-semibold"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Search className="h-3 w-3" />
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Recommendations List Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl text-xs text-slate-400 font-medium">
                    No matching clinical practitioners found in our active system directory.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {doctors.map((item, index) => {
                        const doc = item.doctor;
                        return (
                            <div 
                                key={doc._id || index}
                                className="relative bg-slate-50/40 dark:bg-slate-950/15 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all"
                            >
                                {/* Match Percentage Tag */}
                                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/35">
                                    <Brain className="h-3.5 w-3.5" />
                                    {item.score}% Match
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-base">
                                            {doc.name?.charAt(0) || "D"}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-tight">
                                                Dr. {doc.name}
                                            </h4>
                                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide block mt-0.5">
                                                {doc.specialization}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick details */}
                                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                            {doc.hospital?.name || "Clinic"} • {doc.hospital?.city}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                                            Consultation fee: <strong className="text-slate-700 dark:text-slate-300">₹{doc.fee}</strong>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                            Experience: {doc.experience}
                                        </div>
                                    </div>

                                    {/* Reasoning details */}
                                    <div className="bg-white/50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-100/50 dark:border-slate-800/60 mt-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                            Match Rationale
                                        </span>
                                        <ul className="space-y-1">
                                            {item.reasons?.slice(0, 2).map((r, idx) => (
                                                <li key={idx} className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                                                    <span className="h-1 w-1 bg-emerald-500 rounded-full shrink-0"></span>
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            <EmergencyAlert 
                isOpen={emergencyOpen} 
                onClose={() => setEmergencyOpen(false)} 
                symptomsTriggered={emergencyTrigger} 
            />
        </div>
    );
}
