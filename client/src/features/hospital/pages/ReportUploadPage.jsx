import React, { useState, useEffect } from "react";
import { FileText, Pill, Upload, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";
import BiomarkerCharts from "../components/BiomarkerCharts.jsx";
import ReportSummaryCard from "../components/ReportSummaryCard.jsx";
import PrescriptionUploader from "../components/PrescriptionUploader.jsx";
import PrescriptionResults from "../components/PrescriptionResults.jsx";

export default function ReportUploadPage() {
    const [activeSubTab, setActiveSubTab] = useState("reports");
    const [reports, setReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Report upload specific state
    const [uploadingReport, setUploadingReport] = useState(false);
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        setError("");
        try {
            const [reportsRes, prescriptionsRes] = await Promise.all([
                axiosInstance.get("/api/reports"),
                axiosInstance.get("/api/reports/prescription")
            ]);
            
            if (reportsRes.data?.success) {
                setReports(reportsRes.data.data);
            }
            if (prescriptionsRes.data?.success) {
                setPrescriptions(prescriptionsRes.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch medical documents");
        } finally {
            setLoading(false);
        }
    };

    const handleReportUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingReport(true);
        setUploadError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post("/api/reports/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data?.success) {
                setReports(prev => [response.data.data, ...prev]);
            } else {
                setUploadError(response.data?.message || "Analysis failed.");
            }
        } catch (err) {
            setUploadError(err.response?.data?.message || err.message || "Upload and analysis failed.");
        } finally {
            setUploadingReport(false);
        }
    };

    const handlePrescriptionSuccess = (newPrescription) => {
        setPrescriptions(prev => [newPrescription, ...prev]);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-12">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading your medical files...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30 dark:bg-slate-950/10">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        AI Document Analyzer
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Digitize medical records, extract biomarker metrics, and verify drug details.
                    </p>
                </div>

                {/* Sub Tab Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl self-start md:self-center border border-slate-200/40 dark:border-slate-800/40">
                    <button
                        onClick={() => setActiveSubTab("reports")}
                        className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeSubTab === "reports"
                                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                    >
                        <FileText className="h-4 w-4" />
                        Medical Reports
                    </button>
                    <button
                        onClick={() => setActiveSubTab("prescriptions")}
                        className={`flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeSubTab === "prescriptions"
                                ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                    >
                        <Pill className="h-4 w-4" />
                        Prescriptions
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 border border-rose-100 dark:border-rose-950/35 bg-rose-50/30 dark:bg-rose-950/10 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">{error}</p>
                </div>
            )}

            {/* TAB CONTENT: Reports */}
            {activeSubTab === "reports" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left & Mid: Upload & Trends */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Custom Report Drag/Click Upload Box */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-slate-800 dark:text-slate-100 font-bold mb-1 text-base">
                                Upload Lab Report
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                                Select CBC, Lipid, Thyroid, Blood Sugar, or Vitamin reports to parse structured biomarker values.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <label className="flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-850 hover:border-indigo-500/50 rounded-xl p-5 cursor-pointer hover:bg-slate-50/20 dark:hover:bg-slate-950/5 transition-all">
                                    <input
                                        type="file"
                                        onChange={handleReportUpload}
                                        disabled={uploadingReport}
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                                    />
                                    {uploadingReport ? (
                                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                    ) : (
                                        <Upload className="h-8 w-8 text-slate-400" />
                                    )}
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-350 mt-2">
                                        {uploadingReport ? "AI Extracting Biomarkers..." : "Choose Report (PDF, Image)"}
                                    </span>
                                </label>
                            </div>

                            {uploadError && (
                                <div className="mt-4 p-3.5 border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 rounded-xl flex items-start gap-2.5">
                                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-rose-600 dark:text-rose-450 font-medium leading-normal">{uploadError}</p>
                                </div>
                            )}
                        </div>

                        {/* Biomarker charts trend */}
                        <BiomarkerCharts reports={reports} />
                    </div>

                    {/* Right Panel: Analyzed Reports list */}
                    <div className="flex flex-col gap-5">
                        <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-sm uppercase tracking-wider pl-1">
                            Uploaded Documents
                        </h3>
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-1">
                            {reports.length === 0 ? (
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 text-center text-xs text-slate-400">
                                    No reports parsed yet.
                                </div>
                            ) : (
                                reports.map(r => (
                                    <ReportSummaryCard key={r._id} report={r} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: Prescriptions */}
            {activeSubTab === "prescriptions" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Upload Panel */}
                    <div className="lg:col-span-1">
                        <PrescriptionUploader onUploadSuccess={handlePrescriptionSuccess} />
                    </div>

                    {/* Right Results list */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        <h3 className="text-slate-800 dark:text-slate-100 font-extrabold text-sm uppercase tracking-wider pl-1">
                            Digitized Scripts History
                        </h3>
                        <PrescriptionResults prescriptions={prescriptions} />
                    </div>
                </div>
            )}
        </div>
    );
}
