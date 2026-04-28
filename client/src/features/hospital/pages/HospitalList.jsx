import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, MapPin, Phone, Mail, ArrowRight, UserPlus, HeartPulse } from 'lucide-react';
import { DASHBOARD_TABS } from '../../../pages/dashboard.constants';
import HospitalDetails from './HospitalDetails';

const HospitalList = ({ setActiveTab }) => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHospital, setSelectedHospital] = useState(null);

    useEffect(() => {
        axios.get('/api/hospital', { withCredentials: true })
            .then(res => { setHospitals(res.data.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    if (selectedHospital) {
        return <HospitalDetails hospital={selectedHospital} onBack={() => setSelectedHospital(null)} />;
    }

    if (loading) return <div className="p-8 text-slate-500 font-bold animate-pulse">Loading directory...</div>;

    return (
        <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 flex items-center gap-3">
                        <Building2 className="text-indigo-600" size={36}/> Hospital Directory
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 text-lg">Browse approved hospitals and book your appointments.</p>
                </div>
                <button 
                    onClick={() => setActiveTab(DASHBOARD_TABS.MY_HOSPITAL)}
                    className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 flex items-center gap-3 transition-all hover:scale-105 shrink-0"
                >
                    <UserPlus size={22} /> Partner With Us
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hospitals.map(h => (
                    <div key={h._id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col group cursor-pointer">
                        <div className="h-48 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl mb-6 flex items-center justify-center border border-indigo-100/50 group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                            <HeartPulse size={64} className="text-indigo-200 absolute opacity-50 -right-4 -bottom-4 scale-150" />
                            <Building2 size={64} className="text-indigo-400 z-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{h.name}</h2>
                        <div className="space-y-3 text-slate-500 mb-6 flex-1 font-medium">
                            <p className="flex items-center gap-3"><MapPin size={18} className="text-indigo-400"/> {h.address}, {h.city}</p>
                            <p className="flex items-center gap-3"><Phone size={18} className="text-indigo-400"/> {h.hospitalNumber}</p>
                            <p className="flex items-center gap-3"><Mail size={18} className="text-indigo-400"/> {h.hospitalEmail}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedHospital(h)}
                            className="w-full bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
                            View Doctors <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
                {hospitals.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 font-medium text-lg bg-white rounded-3xl border border-slate-100">
                        No approved hospitals found. Check back later!
                    </div>
                )}
            </div>
        </div>
    );
}

export default HospitalList;
