import React, { useState, useEffect } from "react";
import { Heart, ShieldCheck, HelpCircle, Loader2, RefreshCw } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";

export default function HealthScoreCard() {
    const [scoreData, setScoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // BMI calculator inputs
    const [showBmiCalculator, setShowBmiCalculator] = useState(false);
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [calculatedBmi, setCalculatedBmi] = useState(null);
    const [recomputing, setRecomputing] = useState(false);

    useEffect(() => {
        fetchHealthScore();
    }, []);

    const fetchHealthScore = async (bmiVal) => {
        setLoading(true);
        try {
            const url = bmiVal ? `/api/reports/health-score?bmi=${bmiVal}` : "/api/reports/health-score";
            const response = await axiosInstance.get(url);
            if (response.data?.success) {
                setScoreData(response.data.data);
            }
        } catch (err) {
            console.error("Failed to load health score", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCalculateBmi = async (e) => {
        e.preventDefault();
        if (!weight || !height) return;

        setRecomputing(true);
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        const bmi = weightInKg / (heightInMeters * heightInMeters);
        const roundedBmi = Math.round(bmi * 10) / 10;
        
        setCalculatedBmi(roundedBmi);
        await fetchHealthScore(roundedBmi);
        setRecomputing(false);
    };

    const resetBmi = async () => {
        setWeight("");
        setHeight("");
        setCalculatedBmi(null);
        await fetchHealthScore();
    };

    const getScoreStyles = (score) => {
        if (score >= 80) return { stroke: "stroke-emerald-500", text: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/25" };
        if (score >= 60) return { stroke: "stroke-amber-500", text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/25" };
        return { stroke: "stroke-rose-500", text: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-950/25" };
    };

    if (loading && !scoreData) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
            </div>
        );
    }

    const score = scoreData?.score ?? 100;
    const styles = getScoreStyles(score);
    const circumference = 2 * Math.PI * 34; // 34 is radius
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[32px] p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
            {/* Visual Gauge on Left */}
            <div className="flex flex-col items-center shrink-0">
                <div className="relative h-28 w-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                        {/* Background Ring */}
                        <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="stroke-slate-100 dark:stroke-slate-800/60 fill-none"
                            strokeWidth="6"
                        />
                        {/* Animated Score Progress Ring */}
                        <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className={`${styles.stroke} fill-none transition-all duration-1000 ease-out`}
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    
                    {/* Score Center Text */}
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                            {score}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                            Index
                        </span>
                    </div>
                </div>

                <div className="mt-3.5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${styles.bg} ${styles.text}`}>
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        {scoreData?.riskLevel || "Low Risk"}
                    </span>
                </div>
            </div>

            {/* Recommendations & Info on Right */}
            <div className="flex-1 w-full space-y-4">
                <div>
                    <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-base flex items-center gap-2">
                        <Heart className="h-5 w-5 text-indigo-500 shrink-0" />
                        AI Health Score Dashboard
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                        Your health index calculates biometric indicators, chronic medication loads, and doctor visits compliance.
                    </p>
                </div>

                {/* Bulleted list of clinical recommendation items */}
                <div className="space-y-2 bg-slate-50/50 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                        Clinical AI Insights
                    </span>
                    <ul className="space-y-1.5">
                        {scoreData?.recommendations?.map((rec, idx) => (
                            <li key={idx} className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold flex items-start gap-1.5">
                                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full shrink-0 mt-1.5"></span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BMI Input Form Toggle */}
                <div className="pt-1">
                    <button
                        onClick={() => setShowBmiCalculator(!showBmiCalculator)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                    >
                        {showBmiCalculator ? "Hide BMI Input" : "Factor BMI parameters into your Health Index"}
                        <HelpCircle className="h-4 w-4 shrink-0" />
                    </button>

                    {showBmiCalculator && (
                        <form onSubmit={handleCalculateBmi} className="mt-3 flex flex-wrap items-center gap-3.5 bg-slate-50/40 dark:bg-slate-950/10 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-bold">Height:</span>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="cm"
                                    required
                                    className="w-16 px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-bold">Weight:</span>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="kg"
                                    required
                                    className="w-16 px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={recomputing}
                                className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                                {recomputing && <Loader2 className="h-3 w-3 animate-spin" />}
                                Calculate
                            </button>

                            {calculatedBmi && (
                                <div className="flex items-center gap-3.5 ml-auto text-xs">
                                    <span className="font-semibold text-slate-600 dark:text-slate-350">
                                        BMI: <strong className="text-slate-800 dark:text-slate-100">{calculatedBmi}</strong>
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={resetBmi}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        title="Reset BMI"
                                    >
                                        <RefreshCw className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
