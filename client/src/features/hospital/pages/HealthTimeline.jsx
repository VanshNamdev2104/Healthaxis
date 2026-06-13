import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, Calendar, ArrowRight, HeartPulse, Sparkles, CheckCircle2 } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";
import TimelineFilters from "../components/TimelineFilters.jsx";
import TimelineCard from "../components/TimelineCard.jsx";

export default function HealthTimeline() {
    const [timelineItems, setTimelineItems] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Survey form states keyed by follow-up ID
    const [surveyResponses, setSurveyResponses] = useState({});
    const [submittingSurvey, setSubmittingSurvey] = useState({});

    useEffect(() => {
        fetchTimelineData();
    }, []);

    const fetchTimelineData = async () => {
        setLoading(true);
        setError("");
        try {
            const [timelineRes, followupsRes] = await Promise.all([
                axiosInstance.get("/api/reports/timeline"),
                axiosInstance.get("/api/followups")
            ]);

            if (timelineRes.data?.success) {
                setTimelineItems(timelineRes.data.data);
            }
            if (followupsRes.data?.success) {
                // Keep only surveys that are sent (pending patient response)
                const activeSurveys = followupsRes.data.data.filter(f => f.status === "sent");
                setFollowUps(activeSurveys);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load timeline records");
        } finally {
            setLoading(false);
        }
    };

    const handleSurveyResponseChange = (fuId, field, value) => {
        setSurveyResponses(prev => ({
            ...prev,
            [fuId]: {
                ...prev[fuId],
                [field]: value
            }
        }));
    };

    const handleSurveySubmit = async (fuId) => {
        const response = surveyResponses[fuId];
        if (!response?.symptomStatus) {
            alert("Please select your symptom status");
            return;
        }

        setSubmittingSurvey(prev => ({ ...prev, [fuId]: true }));

        try {
            const res = await axiosInstance.post(`/api/followups/${fuId}/submit`, {
                symptomStatus: response.symptomStatus,
                sideEffects: response.sideEffects || "",
                additionalFeedback: response.additionalFeedback || ""
            });

            if (res.data?.success) {
                // Remove the completed survey from state
                setFollowUps(prev => prev.filter(f => f._id !== fuId));
                // Refresh timeline since a new completed follow-up event might be added
                await fetchTimelineData();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit survey feedback");
        } finally {
            setSubmittingSurvey(prev => ({ ...prev, [fuId]: false }));
        }
    };

    // Filtered timeline view items
    const filteredItems = timelineItems.filter(item => {
        if (filter === "all") return true;
        return item.type === filter;
    });

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading health timeline...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-slate-950/10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Personal Health Timeline
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    A unified, chronological feed of your clinical visits, prescriptions, follow-ups, and lab results.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">{error}</p>
                </div>
            )}

            {/* Active Check-in Surveys Panel */}
            {followUps.length > 0 && (
                <div className="mb-8 flex flex-col gap-5">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-500 flex items-center gap-1.5 pl-1">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        Action Required: Patient Follow-ups
                    </h3>
                    
                    {followUps.map((fu) => {
                        const symptomVal = surveyResponses[fu._id]?.symptomStatus || "";
                        
                        return (
                            <div 
                                key={fu._id} 
                                className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-2xl p-5 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                                        <HeartPulse className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                                            Day {fu.dayIndex} Visit Follow-up
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                                            Check-in for your consultation with Dr. {fu.doctor?.name || "Doctor"}
                                        </p>

                                        {/* Survey questionnaire */}
                                        <div className="mt-4 flex flex-col gap-4 max-w-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4.5 rounded-xl">
                                            <div>
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                                                    How are your symptoms now compared to the visit?
                                                </label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {["improving", "unchanged", "worsening"].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => handleSurveyResponseChange(fu._id, "symptomStatus", status)}
                                                            className={`px-3 py-2 text-xs font-bold rounded-lg border capitalize cursor-pointer transition-all ${
                                                                symptomVal === status
                                                                    ? "bg-amber-500 border-amber-600 text-white shadow-sm"
                                                                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100/50"
                                                            }`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                                                    Are you experiencing any side effects? (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={surveyResponses[fu._id]?.sideEffects || ""}
                                                    onChange={(e) => handleSurveyResponseChange(fu._id, "sideEffects", e.target.value)}
                                                    placeholder="Describe any side effects or write None"
                                                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all font-medium"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                                                    Any additional feedback or updates? (Optional)
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    value={surveyResponses[fu._id]?.additionalFeedback || ""}
                                                    onChange={(e) => handleSurveyResponseChange(fu._id, "additionalFeedback", e.target.value)}
                                                    placeholder="Share details on how you are recovering"
                                                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-500/30 outline-none transition-all font-medium resize-none"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleSurveySubmit(fu._id)}
                                                disabled={submittingSurvey[fu._id] || !symptomVal}
                                                className="mt-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-amber-500/10 flex items-center justify-center gap-1.5 self-end transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                {submittingSurvey[fu._id] ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                )}
                                                Submit Feedback
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Timeline Filter controls */}
            <TimelineFilters activeFilter={filter} onChange={setFilter} />

            {/* Scrollable Timeline feed */}
            <div className="relative pl-1">
                {filteredItems.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-8 text-center text-xs text-slate-400">
                        No history records match this selection.
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredItems.map((item) => (
                            <TimelineCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
