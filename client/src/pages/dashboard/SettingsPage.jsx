import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  Palette, 
  Bell, 
  Shield, 
  Settings as SettingsIcon, 
  Check, 
  RotateCcw, 
  Save,
  Moon,
  Sun,
  Globe,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

const SETTINGS_CATEGORIES = [
  { id: "appearance", title: "Appearance", icon: <Palette className="w-5 h-5" />, desc: "Customize theme and visual aesthetics" },
  { id: "notifications", title: "Notifications", icon: <Bell className="w-5 h-5" />, desc: "Configure email, SMS and alerts" },
  { id: "privacy", title: "Privacy", icon: <Shield className="w-5 h-5" />, desc: "Manage sharing and data permissions" },
  { id: "preferences", title: "Preferences", icon: <SettingsIcon className="w-5 h-5" />, desc: "Control general app configuration" },
];

const SettingsPage = memo(() => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("healthaxis_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log(e)
      }
    }
    return {
      theme: "light",
      accentColor: "emerald",
      density: "comfortable",
      emailNotifications: true,
      smsAlerts: false,
      weeklyReport: true,
      language: "en",
      logoutTimer: "30m",
      profileVisibility: "public",
      shareData: false,
    };
  });

  const [initialSettings, setInitialSettings] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);

  // Sync theme and accent color with document element
  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.theme]);

  useEffect(() => {
    if (settings.accentColor) {
      document.documentElement.setAttribute("data-accent-color", settings.accentColor);
    }
  }, [settings.accentColor]);

  // Restore saved settings on page unmount if unsaved changes were previewed
  useEffect(() => {
    return () => {
      const saved = localStorage.getItem("healthaxis_settings");
      if (saved) {
        try {
          const original = JSON.parse(saved);
          if (original.theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          if (original.accentColor) {
            document.documentElement.setAttribute("data-accent-color", original.accentColor);
          } else {
            document.documentElement.removeAttribute("data-accent-color");
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.removeAttribute("data-accent-color");
      }
    };
  }, []);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("healthaxis_settings", JSON.stringify(settings));
      setInitialSettings({ ...settings });
      setIsSaving(false);
      toast.success("Preferences saved successfully!");
    }, 800);
  };

  const handleReset = () => {
    const defaults = {
      theme: "light",
      accentColor: "emerald",
      density: "comfortable",
      emailNotifications: true,
      smsAlerts: false,
      weeklyReport: true,
      language: "en",
      logoutTimer: "30m",
      profileVisibility: "public",
      shareData: false,
    };
    setSettings(defaults);
    toast.info("Settings reverted to defaults.");
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      className="w-full min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-neutral-950 dark:to-neutral-900 p-6 md:p-10 font-sans transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mb-2 block">
              Control Panel
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              Console <span className="text-emerald-600 dark:text-emerald-400">Settings.</span>
            </h1>
            <p className="text-slate-500 dark:text-neutral-400 text-sm mt-2 font-medium">
              Configure parameters, customize notifications, and set interface preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <motion.button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-all font-bold text-xs uppercase tracking-widest rounded-2xl border border-slate-200 dark:border-neutral-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset Defaults
              </motion.button>
            )}
            <motion.button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all ${
                isDirty 
                  ? "bg-[#171c1f] dark:bg-white text-white dark:text-neutral-900 hover:scale-[1.03]" 
                  : "bg-slate-200 dark:bg-neutral-800 text-slate-400 dark:text-neutral-600 cursor-not-allowed shadow-none"
              }`}
              whileHover={isDirty ? { scale: 1.03 } : {}}
              whileTap={isDirty ? { scale: 0.97 } : {}}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Preferences"}
            </motion.button>
          </div>
        </header>

        {/* Bento Grid Settings Interface */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <nav className="md:col-span-4 space-y-3">
            {SETTINGS_CATEGORIES.map(cat => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full text-left p-5 rounded-[24px] border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group ${
                    isActive
                      ? "bg-white dark:bg-neutral-800 border-slate-200 dark:border-neutral-700 shadow-lg"
                      : "bg-white/40 dark:bg-neutral-900/40 border-transparent hover:bg-white/60 dark:hover:bg-neutral-800/60"
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-emerald-600 text-white" 
                      : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 group-hover:bg-slate-200 dark:group-hover:bg-neutral-700"
                  }`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className={`font-black text-sm uppercase tracking-wider ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-neutral-400"}`}>
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-medium mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                  {isActive && (
                    <motion.div 
                      className="absolute right-4 w-1.5 h-6 rounded-full bg-emerald-600" 
                      layoutId="active-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Config Details Panel */}
          <main className="md:col-span-8 bg-white dark:bg-neutral-800 rounded-[36px] border border-slate-200/60 dark:border-neutral-800 p-8 shadow-xl shadow-slate-100/50 dark:shadow-none min-h-[450px] relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                {/* 🎨 APPEARANCE */}
                {activeTab === "appearance" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Interface Theme</h2>
                      <p className="text-xs text-slate-400 dark:text-neutral-400">Choose how HealthAxis AI appears on your screen</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Light Theme Option */}
                      <button
                        onClick={() => updateSetting("theme", "light")}
                        className={`p-6 rounded-[24px] border-2 text-left flex flex-col justify-between h-40 transition-all ${
                          settings.theme === "light"
                            ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50/20 dark:bg-neutral-800"
                            : "border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700 bg-slate-50/30 dark:bg-neutral-900/30"
                        }`}
                      >
                        <Sun className={`w-8 h-8 ${settings.theme === "light" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Light Mode</h4>
                          <p className="text-[11px] text-slate-400 mt-1">Clean and sharp clinical workspace</p>
                        </div>
                      </button>

                      {/* Dark Theme Option */}
                      <button
                        onClick={() => updateSetting("theme", "dark")}
                        className={`p-6 rounded-[24px] border-2 text-left flex flex-col justify-between h-40 transition-all ${
                          settings.theme === "dark"
                            ? "border-emerald-600 dark:border-emerald-400 bg-emerald-50/20 dark:bg-neutral-800"
                            : "border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700 bg-slate-50/30 dark:bg-neutral-900/30"
                        }`}
                      >
                        <Moon className={`w-8 h-8 ${settings.theme === "dark" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Dark Mode</h4>
                          <p className="text-[11px] text-slate-400 mt-1">Reduced eye strain for night shifts</p>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-neutral-800 pt-6">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">Aesthetic Colors</h3>
                      <div className="flex gap-4">
                        {[
                          { id: "emerald", class: "bg-emerald-500" },
                          { id: "indigo", class: "bg-indigo-500" },
                          { id: "violet", class: "bg-violet-500" },
                          { id: "rose", class: "bg-rose-500" },
                        ].map(color => (
                          <button
                            key={color.id}
                            onClick={() => updateSetting("accentColor", color.id)}
                            className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-all ${
                              settings.accentColor === color.id ? "ring-4 ring-offset-2 ring-slate-400 dark:ring-offset-neutral-900" : "scale-90 opacity-70 hover:opacity-100"
                            }`}
                          >
                            {settings.accentColor === color.id && <Check className="w-4 h-4 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 🔔 NOTIFICATIONS */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Alert Protocols</h2>
                      <p className="text-xs text-slate-400 dark:text-neutral-400">Configure when and how you receive alerts</p>
                    </div>

                    <div className="space-y-4">
                      {/* Email Notifications */}
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Email Dispatches</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Receive schedules, updates, and approval reports via email.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.emailNotifications} 
                            onChange={e => updateSetting("emailNotifications", e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* SMS Alerts */}
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Emergency SMS Routing</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Alert mobile phone instantly for high priority appointment changes.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.smsAlerts} 
                            onChange={e => updateSetting("smsAlerts", e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Weekly Newsletter */}
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Clinical Analytics Summary</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Receive weekly summaries of hospital operations and performance indicators.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.weeklyReport} 
                            onChange={e => updateSetting("weeklyReport", e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🔒 PRIVACY */}
                {activeTab === "privacy" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Security & Privacy</h2>
                      <p className="text-xs text-slate-400 dark:text-neutral-400">Control data permissions and profile accessibility</p>
                    </div>

                    <div className="space-y-4">
                      {/* Profile Visibility */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Profile Visibility</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Choose who can view hospital and staff listings publicly.</p>
                          </div>
                          <div className="flex bg-white dark:bg-neutral-800 p-1 rounded-xl border border-slate-200 dark:border-neutral-700">
                            <button
                              onClick={() => updateSetting("profileVisibility", "public")}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                settings.profileVisibility === "public"
                                  ? "bg-slate-900 text-white dark:bg-white dark:text-neutral-900"
                                  : "text-slate-500 hover:text-slate-800 dark:hover:text-neutral-200"
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Public
                            </button>
                            <button
                              onClick={() => updateSetting("profileVisibility", "private")}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                settings.profileVisibility === "private"
                                  ? "bg-slate-900 text-white dark:bg-white dark:text-neutral-900"
                                  : "text-slate-500 hover:text-slate-800 dark:hover:text-neutral-200"
                              }`}
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              Private
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Share Diagnostic Data */}
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">Diagnostic Research Data</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">Share anonymized analytics diagnostics reports with research groups.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={settings.shareData} 
                            onChange={e => updateSetting("shareData", e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* ⚙️ PREFERENCES */}
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-wider">System Preferences</h2>
                      <p className="text-xs text-slate-400 dark:text-neutral-400">Configure language and general operational parameters</p>
                    </div>

                    <div className="space-y-4">
                      {/* Language Selection */}
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-slate-500" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Language Selection</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Preferred locale for portal messages and document generation.</p>
                          </div>
                        </div>
                        <select
                          value={settings.language}
                          onChange={e => updateSetting("language", e.target.value)}
                          className="px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-white text-xs font-bold cursor-pointer focus:border-emerald-500 outline-none"
                        >
                          <option value="en">English (US)</option>
                          <option value="hi">Hindi (IN)</option>
                          <option value="es">Spanish (ES)</option>
                        </select>
                      </div>

                      {/* Session Timeout */}
                      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-slate-500" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Logout Inactivity Session</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Automatically end session and logout after inactivity duration.</p>
                          </div>
                        </div>
                        <select
                          value={settings.logoutTimer}
                          onChange={e => updateSetting("logoutTimer", e.target.value)}
                          className="px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-white text-xs font-bold cursor-pointer focus:border-emerald-500 outline-none"
                        >
                          <option value="15m">15 Minutes</option>
                          <option value="30m">30 Minutes</option>
                          <option value="1h">1 Hour</option>
                          <option value="never">Never Log Out</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </motion.div>
  );
});

SettingsPage.displayName = "SettingsPage";

SettingsPage.propTypes = {
  children: PropTypes.node,
};

SettingsPage.defaultProps = {
  children: null,
};

export default SettingsPage;
