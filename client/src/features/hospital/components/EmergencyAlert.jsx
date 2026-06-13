import React from "react";
import PropTypes from "prop-types";
import { AlertOctagon, Phone, MapPin, X, HeartPulse, Activity, ShieldAlert } from "lucide-react";

export default function EmergencyAlert({ isOpen, onClose, symptomsTriggered }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" role="dialog" aria-modal="true">
            {/* Modal Body */}
            <div className="bg-slate-900 border-2 border-red-500 rounded-[32px] max-w-lg w-full p-6 shadow-2xl relative text-white overflow-hidden">
                {/* Decorative emergency pulse backdrops */}
                <div className="absolute -top-12 -left-12 w-36 h-36 bg-red-500/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-red-500/10 rounded-full blur-2xl animate-pulse pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Dismiss Alert"
                >
                    <X className="h-4.5 w-4.5" />
                </button>

                {/* Warning Header */}
                <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4 mb-4">
                    <div className="h-11 w-11 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center animate-bounce shrink-0">
                        <AlertOctagon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-red-500 uppercase tracking-wide">
                            Emergency Warning Detected
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Triggered by: "{symptomsTriggered}"
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Clinical Alert Note */}
                    <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-200 leading-relaxed font-medium">
                        Your symptom description suggests a high-priority acute indicator. Do not wait for an online consult. Take immediate action.
                    </div>

                    {/* Quick Call Actions */}
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Immediate Contacts
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="tel:102"
                                className="flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
                            >
                                <Phone className="h-4.5 w-4.5" />
                                Call Ambulance (102)
                            </a>
                            <a
                                href="tel:112"
                                className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                <Phone className="h-4.5 w-4.5" />
                                National Helpline (112)
                            </a>
                        </div>
                    </div>

                    {/* Hospital directions link */}
                    <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <MapPin className="h-5 w-5 text-indigo-400 shrink-0" />
                            <div>
                                <h5 className="text-xs font-extrabold text-slate-200">Nearest Trauma Clinic</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Find emergency room directions nearby</p>
                            </div>
                        </div>
                        <a
                            href="https://www.google.com/maps/search/hospital+near+me"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                            Open Maps
                        </a>
                    </div>

                    {/* First-Aid Protocols Accordion/Bullets */}
                    <div className="border-t border-slate-850 pt-4.5">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <ShieldAlert className="h-4 w-4 text-indigo-400" />
                            First-Aid Protocols Checklist
                        </h4>
                        
                        <div className="space-y-3.5">
                            {/* Cardiac checklist */}
                            <div className="flex gap-2.5 text-xs text-slate-350 leading-relaxed font-semibold">
                                <HeartPulse className="h-4 w-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                                <div>
                                    <span className="text-slate-100 font-extrabold block">Chest Pain / Suspected Cardiac:</span>
                                    Rest sitting upright. Avoid exertion. Chew a standard aspirin if prescribed/directed. Prepare for immediate transfer.
                                </div>
                            </div>
                            
                            {/* Stroke FAST check */}
                            <div className="flex gap-2.5 text-xs text-slate-350 leading-relaxed font-semibold">
                                <Activity className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-slate-100 font-extrabold block">Stroke symptoms (F.A.S.T.):</span>
                                    <strong>Face:</strong> ask to smile. <strong>Arms:</strong> ask to raise arms. <strong>Speech:</strong> test simple sentence repeating. <strong>Time:</strong> any fail means call ambulance.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dismiss Button */}
                <div className="mt-6 border-t border-slate-850 pt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-xs font-bold rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        Dismiss Alert (I am safe)
                    </button>
                </div>
            </div>
        </div>
    );
}

EmergencyAlert.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    symptomsTriggered: PropTypes.string.isRequired
};
