import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Check, X, Ban, Building2, User } from 'lucide-react';

const VerificationQueue = () => {
    const [hospitals, setHospitals] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchPending = async () => {
        try {
            const res = await axios.get('/api/admin/providers/pending', { withCredentials: true });
            setHospitals(res.data.data.hospitals);
            setDoctors(res.data.data.doctors);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id, status, reason = '') => {
        try {
            await axios.put(`/api/admin/providers/${id}/status`, { status, reason }, { withCredentials: true });
            setHospitals(hospitals.filter(h => h._id !== id));
            setDoctors(doctors.filter(d => d._id !== id));
            if (status === 'REJECTED') {
                setRejectModalOpen(false);
                setRejectReason('');
            }
        } catch (e) {
            console.error(e);
            alert("Failed to update status. Check console.");
        }
    };

    const openRejectModal = (provider) => {
        setSelectedProvider(provider);
        setRejectModalOpen(true);
    };

    if (loading) return <div className="p-8 text-slate-500">Loading queue...</div>;

    const totalPending = hospitals.length + doctors.length;

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <h1 className="text-4xl font-black text-slate-800 mb-8 flex items-center gap-4">
                Verification Queue
                {totalPending > 0 && (
                    <span className="bg-rose-500 text-white text-lg px-4 py-1 rounded-full shadow-lg">{totalPending} Pending</span>
                )}
            </h1>

            <div className="space-y-12">
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-3">
                        <Building2 className="text-indigo-500" /> Pending Hospitals
                    </h2>
                    {hospitals.length === 0 ? <p className="text-slate-500 bg-slate-50 p-6 rounded-2xl border border-slate-100">No pending hospitals.</p> : (
                        <div className="grid gap-4">
                            {hospitals.map(h => (
                                <div key={h._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900">{h.name}</h3>
                                        <p className="text-slate-500">{h.address}, {h.city}, {h.country}</p>
                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-2 bg-indigo-50 inline-block px-3 py-1 rounded-full">{h.type} • {h.speciality}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleAction(h._id, 'APPROVED')} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"><Check size={18}/> Approve</button>
                                        <button onClick={() => openRejectModal(h)} className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"><X size={18}/> Reject</button>
                                        <button onClick={() => handleAction(h._id, 'SUSPENDED')} className="bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"><Ban size={18}/> Suspend</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-3">
                        <User className="text-indigo-500" /> Pending Doctors
                    </h2>
                    {doctors.length === 0 ? <p className="text-slate-500 bg-slate-50 p-6 rounded-2xl border border-slate-100">No pending doctors.</p> : (
                        <div className="grid gap-4">
                            {doctors.map(d => (
                                <div key={d._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900">{d.name}</h3>
                                        <p className="text-slate-500">{d.email} • {d.contact}</p>
                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-2 bg-indigo-50 inline-block px-3 py-1 rounded-full">{d.specialization} • Hospital: {d.hospital?.name}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => handleAction(d._id, 'APPROVED')} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"><Check size={18}/> Approve</button>
                                        <button onClick={() => openRejectModal(d)} className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"><X size={18}/> Reject</button>
                                        <button onClick={() => handleAction(d._id, 'SUSPENDED')} className="bg-slate-100 text-slate-600 hover:bg-slate-600 hover:text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors"><Ban size={18}/> Suspend</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white p-8 rounded-3xl max-w-lg w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                <X size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Reject Provider</h2>
                        </div>
                        <p className="text-slate-600 mb-6 font-medium">Please provide a reason for rejecting <strong className="text-slate-900">{selectedProvider?.name}</strong>. This will be shown to them.</p>
                        <textarea 
                            className="w-full border border-slate-200 rounded-2xl p-4 mb-6 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-700" 
                            placeholder="Enter rejection reason here..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setRejectModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                            <button 
                                onClick={() => handleAction(selectedProvider._id, 'REJECTED', rejectReason)} 
                                disabled={!rejectReason.trim()}
                                className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-600/30"
                            >Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationQueue;
