import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { TrendingUp, AlertCircle, CheckCircle, Activity } from "lucide-react";

export default function BiomarkerCharts({ reports }) {
    const [selectedBiomarker, setSelectedBiomarker] = useState("");

    // Group and sort biomarker measurements by name
    const biomarkerTrends = useMemo(() => {
        const trends = {};
        
        // Sort reports chronologically (oldest to newest for graphing)
        const sortedReports = [...reports].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        sortedReports.forEach(report => {
            if (report.biomarkers && Array.isArray(report.biomarkers)) {
                report.biomarkers.forEach(marker => {
                    const name = marker.name.trim();
                    // Try to parse numerical values
                    const numVal = parseFloat(marker.value.replace(/[^0-9.]/g, ""));
                    
                    if (!isNaN(numVal)) {
                        if (!trends[name]) {
                            trends[name] = [];
                        }
                        trends[name].push({
                            value: numVal,
                            raw: marker.value,
                            unit: marker.unit || "",
                            flag: marker.flag || "NORMAL",
                            date: new Date(report.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric"
                            }),
                            reportType: report.reportType
                        });
                    }
                });
            }
        });
        return trends;
    }, [reports]);

    const biomarkerNames = useMemo(() => Object.keys(biomarkerTrends), [biomarkerTrends]);

    // Auto-select first biomarker name if none selected
    React.useEffect(() => {
        if (biomarkerNames.length > 0 && !selectedBiomarker) {
            setSelectedBiomarker(biomarkerNames[0]);
        }
    }, [biomarkerNames, selectedBiomarker]);

    const currentTrend = useMemo(() => {
        return selectedBiomarker ? biomarkerTrends[selectedBiomarker] : [];
    }, [selectedBiomarker, biomarkerTrends]);

    // SVG Line Chart calculations
    const chartData = useMemo(() => {
        if (!currentTrend || currentTrend.length === 0) return null;

        const values = currentTrend.map(d => d.value);
        const minVal = Math.min(...values) * 0.9;
        const maxVal = Math.max(...values) * 1.1;
        const valRange = maxVal - minVal || 10;

        const width = 600;
        const height = 250;
        const paddingLeft = 50;
        const paddingRight = 20;
        const paddingTop = 30;
        const paddingBottom = 40;

        const chartWidth = width - paddingLeft - paddingRight;
        const chartHeight = height - paddingTop - paddingBottom;

        const points = currentTrend.map((data, idx) => {
            const x = paddingLeft + (idx / (currentTrend.length - 1 || 1)) * chartWidth;
            const y = paddingTop + chartHeight - ((data.value - minVal) / valRange) * chartHeight;
            return { x, y, ...data };
        });

        const linePath = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
        
        // Fill area path for beautiful gradient
        const areaPath = points.length > 0 
            ? `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z` 
            : "";

        return { points, linePath, areaPath, width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, chartWidth, chartHeight, minVal, maxVal };
    }, [currentTrend]);

    if (reports.length === 0 || biomarkerNames.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-8 text-center shadow-sm">
                <Activity className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">No Biomarker Trends</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Once you upload medical reports containing biomarker parameters, your chronological health trend charts will be generated here automatically.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-slate-800 dark:text-slate-100 font-bold flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-500" />
                        Biomarker Trend Analysis
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Select a biomarker to visualize chronological progress
                    </p>
                </div>

                <select
                    value={selectedBiomarker}
                    onChange={(e) => setSelectedBiomarker(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium min-w-[180px]"
                >
                    {biomarkerNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            {chartData && (
                <div className="flex-1 flex flex-col md:flex-row gap-6">
                    {/* Graph Visual */}
                    <div className="flex-1 relative border border-slate-100 dark:border-slate-800/50 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/20 overflow-x-auto">
                        <svg 
                            viewBox={`0 0 ${chartData.width} ${chartData.height}`} 
                            className="w-full min-w-[500px] h-[250px]"
                        >
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Grid Lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                                const y = chartData.paddingTop + ratio * chartData.chartHeight;
                                const val = chartData.maxVal - ratio * (chartData.maxVal - chartData.minVal);
                                return (
                                    <g key={idx}>
                                        <line 
                                            x1={chartData.paddingLeft} 
                                            y1={y} 
                                            x2={chartData.width - chartData.paddingRight} 
                                            y2={y} 
                                            stroke="#e2e8f0" 
                                            strokeDasharray="4 4" 
                                            className="dark:stroke-slate-800"
                                        />
                                        <text 
                                            x={chartData.paddingLeft - 10} 
                                            y={y + 4} 
                                            textAnchor="end" 
                                            className="fill-slate-400 dark:fill-slate-500 text-[10px] font-medium"
                                        >
                                            {val.toFixed(1)}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* X-Axis dates */}
                            {chartData.points.map((p, idx) => (
                                <text
                                    key={idx}
                                    x={p.x}
                                    y={chartData.height - 15}
                                    textAnchor="middle"
                                    className="fill-slate-400 dark:fill-slate-500 text-[10px] font-semibold"
                                >
                                    {p.date}
                                </text>
                            ))}

                            {/* Filled Area */}
                            {chartData.areaPath && (
                                <path d={chartData.areaPath} fill="url(#chartGradient)" />
                            )}

                            {/* Line path */}
                            {chartData.linePath && (
                                <path 
                                    d={chartData.linePath} 
                                    fill="none" 
                                    stroke="#6366f1" 
                                    strokeWidth="3" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />
                            )}

                            {/* Point circles */}
                            {chartData.points.map((p, idx) => {
                                const isAlert = p.flag !== "NORMAL";
                                return (
                                    <g key={idx} className="group cursor-pointer">
                                        <circle 
                                            cx={p.x} 
                                            cy={p.y} 
                                            r="5" 
                                            fill={isAlert ? "#ef4444" : "#10b981"} 
                                            stroke="#fff" 
                                            strokeWidth="2" 
                                            className="transition-all duration-200 hover:r-7"
                                        />
                                        {/* Simple Tooltip on hover */}
                                        <title>{`${p.value} ${p.unit} (${p.flag}) - ${p.date}`}</title>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Side Info Cards */}
                    <div className="w-full md:w-64 flex flex-col gap-4">
                        <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-indigo-50/20 dark:bg-indigo-950/10">
                            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Current Level</h4>
                            {currentTrend.length > 0 && (
                                <div>
                                    <span className="text-3xl font-black text-slate-800 dark:text-slate-100">
                                        {currentTrend[currentTrend.length - 1].value}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-500 ml-1">
                                        {currentTrend[currentTrend.length - 1].unit}
                                    </span>
                                    
                                    <div className="mt-3 flex items-center gap-1.5">
                                        {currentTrend[currentTrend.length - 1].flag === "NORMAL" ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/25 px-2 py-0.5 rounded-full">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Normal
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/25 px-2 py-0.5 rounded-full">
                                                <AlertCircle className="h-3.5 w-3.5" />
                                                {currentTrend[currentTrend.length - 1].flag}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Roster list */}
                        <div className="flex-1 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
                            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                History
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[120px] divide-y divide-slate-50 dark:divide-slate-800">
                                {currentTrend.map((record, index) => (
                                    <div key={index} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <div>
                                            <div className="font-semibold text-slate-700 dark:text-slate-300">{record.value} {record.unit}</div>
                                            <div className="text-[10px] text-slate-400">{record.date}</div>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase ${record.flag === "NORMAL" ? "text-emerald-500" : "text-rose-500"}`}>
                                            {record.flag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

BiomarkerCharts.propTypes = {
    reports: PropTypes.array.isRequired
};
