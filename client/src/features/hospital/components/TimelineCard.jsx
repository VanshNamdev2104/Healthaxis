import React, { useState } from "react";
import PropTypes from "prop-types";
import { Calendar, FileText, Pill, ChevronDown, ChevronUp, User, MapPin } from "lucide-react";

export default function TimelineCard({ item }) {
    const [expanded, setExpanded] = useState(false);

    const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    const getColors = () => {
        switch (item.type) {
            case "appointment":
                return {
                    bg: "bg-blue-500/10",
                    text: "text-blue-600 dark:text-blue-400",
                    border: "border-blue-500/20",
                    icon: Calendar
                };
            case "report":
                return {
                    bg: "bg-indigo-500/10",
                    text: "text-indigo-600 dark:text-indigo-400",
                    border: "border-indigo-500/20",
                    icon: FileText
                };
            case "prescription":
                return {
                    bg: "bg-teal-500/10",
                    text: "text-teal-600 dark:text-teal-400",
                    border: "border-teal-500/20",
                    icon: Pill
                };
            default:
                return {
                    bg: "bg-slate-500/10",
                    text: "text-slate-600 dark:text-slate-400",
                    border: "border-slate-500/20",
                    icon: FileText
                };
        }
    };

    const config = getColors();
    const Icon = config.icon;

    return (
        <div className="flex gap-4 relative group">
            {/* Timeline track left marker */}
            <div className="flex flex-col items-center shrink-0">
                <div className={`h-8 w-8 rounded-full ${config.bg} ${config.text} border ${config.border} flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110 shadow-sm`}>
                    <Icon className="h-4 w-4" />
                </div>
                {/* Vertical Connector Line */}
                <div className="w-[2px] flex-1 bg-slate-200 dark:bg-slate-800/80 my-1 group-last:hidden"></div>
            </div>

            {/* Main Card */}
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-4.5 shadow-sm mb-6 transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                            {item.type}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                            {item.title}
                        </h4>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                        {formattedDate}
                    </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                    {item.description}
                </p>

                {/* Sub-panels details according to type */}
                {item.type === "appointment" && item.details && (
                    <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-50 dark:border-slate-800/40 pt-3">
                        <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            Dr. {item.details.doctor?.name || "Doctor"}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {item.details.hospital?.name || "Clinic"}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            item.details.status === "approved"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/25 dark:text-emerald-400"
                                : item.details.status === "pending"
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/25 dark:text-amber-400"
                                : "bg-rose-50 text-rose-600 dark:bg-rose-950/25 dark:text-rose-400"
                        }`}>
                            {item.details.status}
                        </span>
                    </div>
                )}

                {item.type === "report" && item.details?.biomarkers && item.details.biomarkers.length > 0 && (
                    <div className="mt-3 border-t border-slate-50 dark:border-slate-800/40 pt-3">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            {expanded ? (
                                <>
                                    Hide Biomarkers <ChevronUp className="h-3.5 w-3.5" />
                                </>
                            ) : (
                                <>
                                    View Biomarkers ({item.details.biomarkers.length}) <ChevronDown className="h-3.5 w-3.5" />
                                </>
                            )}
                        </button>

                        {expanded && (
                            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.details.biomarkers.map((b, idx) => (
                                    <div key={idx} className="p-2 border border-slate-100/60 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs font-semibold">
                                        <span className="text-slate-500 dark:text-slate-400">{b.name}</span>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                                            b.flag === "NORMAL" 
                                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/15 dark:text-emerald-400" 
                                                : "bg-red-50 text-red-600 dark:bg-red-950/15 dark:text-red-400"
                                        }`}>
                                            {b.value} {b.unit} ({b.flag})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {item.type === "prescription" && item.details?.medicines && item.details.medicines.length > 0 && (
                    <div className="mt-3 border-t border-slate-50 dark:border-slate-800/40 pt-3">
                        <div className="flex flex-col gap-2">
                            {item.details.medicines.map((m, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs font-semibold p-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl">
                                    <span className="text-slate-700 dark:text-slate-350">{m.name}</span>
                                    <span className="text-slate-400 font-medium">
                                        {m.dosage} - {m.frequency}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

TimelineCard.propTypes = {
    item: PropTypes.object.isRequired
};
