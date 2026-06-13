import React, { useState } from "react";
import PropTypes from "prop-types";
import { Pill, Calendar, ExternalLink, FileText, ChevronDown, ChevronUp, Link2 } from "lucide-react";

export default function PrescriptionResults({ prescriptions }) {
    const [openOCR, setOpenOCR] = useState({});

    const toggleOCR = (id) => {
        setOpenOCR(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (prescriptions.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-8 text-center shadow-sm">
                <Pill className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">No Prescriptions Uploaded</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-center">
                    Digitize your doctor's prescriptions to keep a clear drug schedule and auto-verify safety warnings.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {prescriptions.map((rx) => {
                const formattedDate = new Date(rx.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

                return (
                    <div 
                        key={rx._id} 
                        className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm transition-all duration-350 hover:shadow-md"
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4 mb-4">
                            <div className="flex items-start gap-3.5">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                    <Pill className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                                        Prescription Record
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs mt-0.5 font-medium">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formattedDate}
                                    </div>
                                </div>
                            </div>

                            {rx.fileUrl && (
                                <a
                                    href={rx.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 self-start sm:self-center transition-colors"
                                >
                                    View Original script
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}
                        </div>

                        {/* Medicines List */}
                        <div className="mb-4">
                            <h5 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                Parsed Medications ({rx.medicines?.length || 0})
                            </h5>
                            <div className="flex flex-col gap-3">
                                {rx.medicines?.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="p-4 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50/20 dark:bg-slate-950/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-0.5">
                                                <Pill className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                                                    {item.name}
                                                    {item.medicine && (
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/25 px-1.5 py-0.5 rounded-full border border-emerald-100/50 dark:border-emerald-900/35">
                                                            <Link2 className="h-2.5 w-2.5" />
                                                            Database Linked
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex flex-wrap items-center gap-x-2.5 gap-y-1">
                                                    {item.dosage && <span>Dosage: <strong className="text-slate-700 dark:text-slate-350">{item.dosage}</strong></span>}
                                                    {item.frequency && <span>Frequency: <strong className="text-slate-700 dark:text-slate-350">{item.frequency}</strong></span>}
                                                    {item.duration && <span>Duration: <strong className="text-slate-700 dark:text-slate-350">{item.duration}</strong></span>}
                                                </div>
                                            </div>
                                        </div>

                                        {item.medicine && (
                                            <div className="text-right self-end sm:self-center">
                                                {/* Optionally link to user medicine info card */}
                                                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block">
                                                    Generic verification passed
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Raw Script Text */}
                        {rx.rawText && (
                            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                <button
                                    onClick={() => toggleOCR(rx._id)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                                >
                                    {openOCR[rx._id] ? (
                                        <>
                                            Hide Raw Transcript <ChevronUp className="h-4 w-4" />
                                        </>
                                    ) : (
                                        <>
                                            View Raw Transcript <ChevronDown className="h-4 w-4" />
                                        </>
                                    )}
                                </button>

                                {openOCR[rx._id] && (
                                    <pre className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 border border-slate-100 dark:border-slate-800">
                                        {rx.rawText}
                                    </pre>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

PrescriptionResults.propTypes = {
    prescriptions: PropTypes.array.isRequired
};
