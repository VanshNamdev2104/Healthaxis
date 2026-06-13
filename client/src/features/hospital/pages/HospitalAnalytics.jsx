import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, Calendar, Users, TrendingUp, Award, ArrowUpRight, BarChart2, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";

export default function HospitalAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axiosInstance.get("/api/hospital/analytics");
            if (response.data?.success) {
                setAnalytics(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load analytics dashboard");
        } finally {
            setLoading(false);
        }
    };

    // Calculate maximum values for SVG trends scaling
    const scaleConfig = useMemo(() => {
        if (!analytics?.monthlyTrend || analytics.monthlyTrend.length === 0) return null;

        const bookings = analytics.monthlyTrend.map(t => t.bookings);
        const maxBookings = Math.max(...bookings) || 10;

        const width = 500;
        const height = 180;
        const paddingLeft = 40;
        const paddingRight = 10;
        const paddingTop = 20;
        const paddingBottom = 30;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        return { maxBookings, width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, chartWidth, chartHeight };
    }, [analytics]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading clinic analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-6 md:p-8">
                <div className="p-4 border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-600 dark:text-rose-450 font-semibold leading-relaxed">{error}</p>
                </div>
            </div>
        );
    }

    const summary = analytics?.summary || {};
    const doctors = analytics?.doctorPerformance || [];
    const monthlyTrend = analytics?.monthlyTrend || [];

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-slate-950/10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Hospital Analytics
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Monitor revenues, slot utilization, repeat patient parameters, and clinician performance metrics.
                </p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Total Revenue
                        </span>
                        <h4 className="text-2xl font-black text-slate-850 dark:text-slate-100 mt-1">
                            ₹{summary.totalRevenue || 0}
                        </h4>
                    </div>
                    <div className="h-10 w-10 bg-indigo-500/10 text-indigo-550 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Roster Utilization
                        </span>
                        <h4 className="text-2xl font-black text-slate-850 dark:text-slate-100 mt-1">
                            {summary.utilizationRate || 0}%
                        </h4>
                    </div>
                    <div className="h-10 w-10 bg-emerald-500/10 text-emerald-550 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Total Bookings
                        </span>
                        <h4 className="text-2xl font-black text-slate-850 dark:text-slate-100 mt-1">
                            {summary.totalAppointments || 0}
                        </h4>
                    </div>
                    <div className="h-10 w-10 bg-blue-500/10 text-blue-550 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Repeat Patient Ratio
                        </span>
                        <h4 className="text-2xl font-black text-slate-850 dark:text-slate-100 mt-1">
                            {summary.totalAppointments > 0 
                                ? Math.round((summary.repeatPatients / summary.uniquePatients) * 100) || 0 
                                : 0}%
                        </h4>
                    </div>
                    <div className="h-10 w-10 bg-teal-500/10 text-teal-550 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Split Grid: SVG Monthly trend and Patient mix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* SVG trend chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between min-h-[280px]">
                    <div>
                        <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 mb-4">
                            <BarChart2 className="h-5 w-5 text-indigo-500" />
                            Bookings Trend (Last 6 Months)
                        </h3>
                    </div>

                    {scaleConfig && monthlyTrend.length > 0 ? (
                        <div className="relative overflow-x-auto">
                            <svg viewBox={`0 0 ${scaleConfig.width} ${scaleConfig.height}`} className="w-full min-w-[400px] h-[180px]">
                                {/* Grid Lines */}
                                {[0, 0.5, 1].map((ratio, idx) => {
                                    const y = scaleConfig.paddingTop + ratio * scaleConfig.chartHeight;
                                    const val = scaleConfig.maxBookings - ratio * scaleConfig.maxBookings;
                                    return (
                                        <g key={idx}>
                                            <line 
                                                x1={scaleConfig.paddingLeft} 
                                                y1={y} 
                                                x2={scaleConfig.width - scaleConfig.paddingRight} 
                                                y2={y} 
                                                stroke="#f1f5f9" 
                                                className="dark:stroke-slate-850"
                                            />
                                            <text 
                                                x={scaleConfig.paddingLeft - 10} 
                                                y={y + 4} 
                                                textAnchor="end" 
                                                className="fill-slate-400 dark:fill-slate-500 text-[9px] font-bold"
                                            >
                                                {Math.round(val)}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Monthly Bars */}
                                {monthlyTrend.map((t, idx) => {
                                    const colWidth = 25;
                                    const x = scaleConfig.paddingLeft + (idx / (monthlyTrend.length - 1 || 1)) * (scaleConfig.chartWidth - colWidth);
                                    const barHeight = (t.bookings / scaleConfig.maxBookings) * scaleConfig.chartHeight;
                                    const y = scaleConfig.paddingTop + scaleConfig.chartHeight - barHeight;

                                    return (
                                        <g key={idx}>
                                            {/* Bar */}
                                            <rect
                                                x={x}
                                                y={y}
                                                width={colWidth}
                                                height={barHeight}
                                                fill="#6366f1"
                                                rx="4"
                                                className="opacity-85 hover:opacity-100 transition-opacity"
                                            />
                                            {/* X label */}
                                            <text
                                                x={x + colWidth / 2}
                                                y={scaleConfig.height - 10}
                                                textAnchor="middle"
                                                className="fill-slate-400 dark:fill-slate-500 text-[10px] font-bold"
                                            >
                                                {t.month}
                                            </text>
                                            {/* Bar value label */}
                                            {t.bookings > 0 && (
                                                <text
                                                    x={x + colWidth / 2}
                                                    y={y - 5}
                                                    textAnchor="middle"
                                                    className="fill-slate-700 dark:fill-slate-350 text-[9px] font-black"
                                                >
                                                    {t.bookings}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    ) : (
                        <div className="text-center p-8 text-xs text-slate-400">No trend data logged.</div>
                    )}
                </div>

                {/* Patient booking breakdown status mix */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-sm uppercase tracking-wider mb-4">
                            Patient Database Mix
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-650 dark:text-slate-350">
                                <span>Repeat Patient Returns</span>
                                <span>{summary.repeatPatients || 0}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${summary.uniquePatients > 0 ? (summary.repeatPatients / summary.uniquePatients) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-650 dark:text-slate-350">
                                <span>Unique Patients Directory</span>
                                <span>{summary.uniquePatients || 0}</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-teal-500 h-full rounded-full" style={{ width: "100%" }}></div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400 font-medium">
                            <span>Total Bookings Registered:</span>
                            <span className="font-extrabold text-slate-700 dark:text-slate-200">{summary.totalAppointments}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Practitioner Performance Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/20 dark:bg-slate-900/10">
                    <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                        <Award className="h-5 w-5 text-indigo-500" />
                        Clinician Performance Metrics
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="px-6 py-3">Doctor Name</th>
                                <th className="px-6 py-3">Specialty</th>
                                <th className="px-6 py-3 text-center">Bookings</th>
                                <th className="px-6 py-3 text-center">Approved</th>
                                <th className="px-6 py-3 text-right">Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-350">
                            {doctors.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-6 text-center text-slate-400">
                                        No active clinician roster logs.
                                    </td>
                                </tr>
                            ) : (
                                doctors.map((doc, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-150">Dr. {doc.name}</td>
                                        <td className="px-6 py-3.5 font-semibold text-indigo-500">{doc.specialization}</td>
                                        <td className="px-6 py-3.5 text-center font-bold">{doc.totalBookings}</td>
                                        <td className="px-6 py-3.5 text-center font-bold text-emerald-500">{doc.approvedBookings}</td>
                                        <td className="px-6 py-3.5 text-right font-black text-slate-900 dark:text-slate-100">₹{doc.revenue}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
