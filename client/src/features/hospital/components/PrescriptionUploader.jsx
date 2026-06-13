import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { UploadCloud, File, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import axiosInstance from "../../../lib/api/axiosConfig.js";

export default function PrescriptionUploader({ onUploadSuccess }) {
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        setError("");
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        setError("");
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            setError("Only images (JPEG, PNG, WebP) and PDF files are allowed.");
            setFile(null);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("File size exceeds 10MB limit.");
            setFile(null);
            return;
        }
        setFile(file);
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post("/api/reports/prescription", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            
            if (response.data && response.data.success) {
                setSuccess(true);
                setFile(null);
                if (onUploadSuccess) {
                    onUploadSuccess(response.data.data);
                }
            } else {
                setError(response.data?.message || "Prescription processing failed.");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Upload and OCR processing failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-slate-800 dark:text-slate-100 font-bold mb-1 text-base">
                AI Prescription Digitizer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                Upload images or PDF scripts. Our clinical OCR parses medicine items and schedules instantly.
            </p>

            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive 
                        ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10" 
                        : "border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-50/30 dark:hover:bg-slate-950/5"
                }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                />

                <UploadCloud className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-xs text-slate-600 dark:text-slate-350 font-medium">
                    Drag and drop your script file here, or <span className="text-indigo-500 font-semibold">Browse</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                    Supports PDF, JPG, PNG, WEBP up to 10MB
                </p>
            </div>

            {/* File Selected Status */}
            {file && (
                <div className="mt-4 p-3 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/25">
                    <div className="flex items-center gap-2.5 truncate">
                        <File className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                        <div className="truncate">
                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-350 truncate">{file.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow-indigo-500/10 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Start OCR"
                        )}
                    </button>
                </div>
            )}

            {/* Messages */}
            {error && (
                <div className="mt-4 p-3.5 border border-rose-100 dark:border-rose-950/35 bg-rose-50/30 dark:bg-rose-950/10 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-600 dark:text-rose-400 font-medium leading-normal">{error}</p>
                </div>
            )}

            {success && (
                <div className="mt-4 p-3.5 border border-emerald-100 dark:border-emerald-950/35 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl flex items-start gap-2.5">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium leading-normal">
                        Prescription processed and medicines linked successfully!
                    </p>
                </div>
            )}
        </div>
    );
}

PrescriptionUploader.propTypes = {
    onUploadSuccess: PropTypes.func
};
