import React from "react";
import PropTypes from "prop-types";
import { Filter, Calendar, FileText, Pill } from "lucide-react";

export default function TimelineFilters({ activeFilter, onChange }) {
    const filters = [
        { id: "all", label: "All Events", icon: Filter },
        { id: "appointment", label: "Visits", icon: Calendar },
        { id: "report", label: "Reports", icon: FileText },
        { id: "prescription", label: "Prescriptions", icon: Pill }
    ];

    return (
        <div className="flex flex-wrap gap-2.5 mb-6">
            {filters.map((f) => {
                const Icon = f.icon;
                const active = activeFilter === f.id;
                return (
                    <button
                        key={f.id}
                        onClick={() => onChange(f.id)}
                        className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            active
                                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/10"
                                : "bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 border border-slate-200/40 dark:border-slate-800/40"
                        }`}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
}

TimelineFilters.propTypes = {
    activeFilter: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
