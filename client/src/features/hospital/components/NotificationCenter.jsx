import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckSquare, Trash2, Calendar, FileText, HeartPulse, ShieldAlert, Sparkles } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
        
        // Poll for notifications every 30 seconds for dynamic updates
        const interval = setInterval(fetchNotifications, 30000);

        // Click outside listener
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            clearInterval(interval);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axiosInstance.get("/api/notifications");
            if (response.data?.success) {
                setNotifications(response.data.data);
            }
        } catch (err) {
            console.error("Failed to load notifications", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const response = await axiosInstance.put("/api/notifications/read-all");
            if (response.data?.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
        } catch (err) {
            console.error("Failed to mark all read", err);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            const response = await axiosInstance.put(`/api/notifications/${id}/read`);
            if (response.data?.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            }
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            const response = await axiosInstance.delete(`/api/notifications/${id}`);
            if (response.data?.success) {
                setNotifications(prev => prev.filter(n => n._id !== id));
            }
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "appointment":
                return <Calendar className="h-4 w-4 text-blue-500" />;
            case "report":
                return <FileText className="h-4 w-4 text-indigo-500" />;
            case "followup":
                return <HeartPulse className="h-4 w-4 text-emerald-500" />;
            case "system":
                return <ShieldAlert className="h-4 w-4 text-rose-500" />;
            default:
                return <Sparkles className="h-4 w-4 text-indigo-500" />;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-300 border border-slate-200/40 dark:border-slate-850 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Notifications"
            >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-white dark:border-slate-900 animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Container */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-xl z-50 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/20 dark:bg-slate-900/10">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                            Notifications
                        </span>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
                            >
                                <CheckSquare className="h-3.5 w-3.5" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List Content */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40">
                        {notifications.length === 0 ? (
                            <div className="px-6 py-10 text-center text-xs text-slate-400 font-medium">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    onClick={() => !notif.read && handleMarkRead(notif._id)}
                                    className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                                        notif.read 
                                            ? "hover:bg-slate-50/50 dark:hover:bg-slate-950/5" 
                                            : "bg-indigo-500/5 hover:bg-indigo-500/8 dark:bg-indigo-500/2"
                                    }`}
                                >
                                    {/* Category Icon */}
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100/50 dark:border-slate-850">
                                        {getIcon(notif.type)}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1.5">
                                            <h5 className={`text-xs font-bold text-slate-800 dark:text-slate-150 truncate ${!notif.read && "text-indigo-600 dark:text-indigo-400"}`}>
                                                {notif.title}
                                            </h5>
                                            
                                            {/* Unread blue dot */}
                                            {!notif.read && (
                                                <span className="h-2 w-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1 leading-normal font-semibold">
                                            {notif.message}
                                        </p>
                                        <span className="text-[9px] text-slate-400 font-bold block mt-1.5">
                                            {new Date(notif.createdAt).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>

                                    {/* Action buttons */}
                                    <button
                                        onClick={(e) => handleDelete(e, notif._id)}
                                        className="text-slate-350 hover:text-rose-500 dark:hover:text-rose-400 p-1 rounded transition-colors cursor-pointer self-center"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
