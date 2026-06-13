import React, { useState } from "react";
import PropTypes from "prop-types";
import { FileText, Calendar, Check, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Activity } from "lucide-react";

export default function ReportSummaryCard({ report }) {
    const [isOpen, setIsOpen] = useState(false);

    const formattedDate = new Date(report.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const getFlagColor = (flag) => {
        switch (flag?.toUpperCase()) {
            case "HIGH":
                return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/25";
            case "LOW":
                return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/25";
            default:
                return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/25";
        }
    };

    const getFlagIcon = (flag) => {
        switch (flag?.toUpperCase()) {
            case "HIGH":
            case "LOW":
                return <AlertTriangle className="h-3 w-3 shrink-0" />;
            default:
                return <Check className="h-3 w-3 shrink-0" />;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all duration-350 hover:shadow-md">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
                <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                            {report.reportType}
                        </h4>
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mt-0.5 font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            {formattedDate}
                        </div>
                    </div>
                </div>

                {report.fileUrl && (
                    <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 self-start sm:self-center transition-colors"
                    >
                        Original Doc
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                )}
            </div>

            {/* Summary */}
            {report.summary && (
                <div className="mb-5 bg-slate-50 dark:bg-slate-950/35 rounded-xl p-4 border border-slate-100 dark:border-slate-800/40">
                    <h5 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-indigo-500" />
                        AI Lab Findings Summary
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                        {report.summary}
                    </p>
                </div>
            )}

            {/* Biomarkers list */}
            {report.biomarkers && report.biomarkers.length > 0 && (
                <div className="mb-4">
                    <h5 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                        Extracted Biomarker Panels
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {report.biomarkers.map((marker, index) => (
                            <div 
                                key={index} 
                                className="p-3 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between hover:bg-slate-50/30 dark:hover:bg-slate-950/10 transition-colors"
                            >
                                <div>
                                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                                        {marker.name}
                                    </div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                                        {marker.value} <span className="text-[10px] text-slate-400 font-semibold">{marker.unit}</span>
                                    </div>
                                </div>

                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getFlagColor(marker.flag)}`}>
                                    {getFlagIcon(marker.flag)}
                                    {marker.flag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Raw Extracted Text Toggle */}
            {report.extractedText && (
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                        {isOpen ? (
                            <>
                                Hide OCR Text <ChevronUp className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                View OCR Text <ChevronDown className="h-4 w-4" />
                            </>
                        )}
                    </button>

                    {isOpen && (
                        <pre className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 border border-slate-100 dark:border-slate-800">
                            {report.extractedText}
                        </pre>
                    )}
                </div>
            )}
        </div>
    );
}

ReportSummaryCard.propTypes = {
    report: PropTypes.object.isRequired
};
