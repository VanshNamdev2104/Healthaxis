import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, MapPin, Phone, Mail, ArrowLeft, Stethoscope, Clock, Star, IndianRupee, Calendar } from 'lucide-react';

const HospitalDetails = ({ hospital, onBack }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null); // For booking modal

    useEffect(() => {
        axios.get(`/api/doctors/hospital/${hospital._id}`, { withCredentials: true })
            .then(res => { setDoctors(res.data.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [hospital._id]);

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors">
                <ArrowLeft size={20} /> Back to Directory
            </button>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
                <div className="w-full md:w-1/3 aspect-video bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center border border-indigo-100/50 shadow-inner z-10">
                    <Building2 size={80} className="text-indigo-300" />
                </div>
                <div className="flex-1 z-10">
                    <h1 className="text-4xl font-black text-slate-800 mb-4">{hospital.name}</h1>
                    <div className="space-y-3 text-slate-500 font-medium text-lg">
                        <p className="flex items-center gap-3"><MapPin size={20} className="text-indigo-400"/> {hospital.address}, {hospital.city}, {hospital.state} - {hospital.zipCode}</p>
                        <p className="flex items-center gap-3"><Phone size={20} className="text-indigo-400"/> {hospital.hospitalNumber}</p>
                        <p className="flex items-center gap-3"><Mail size={20} className="text-indigo-400"/> {hospital.hospitalEmail}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Stethoscope className="text-indigo-600" size={32} /> Available Doctors
            </h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {doctors.map((doc, idx) => (
                        <div key={doc._id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black text-2xl shrink-0">
                                    {doc.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                                    <p className="text-indigo-600 font-bold">{doc.specialization}</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-slate-500 mb-8 flex-1 font-medium">
                                <p className="flex items-center gap-3"><Star size={18} className="text-amber-400"/> {doc.experience} Years Experience</p>
                                <p className="flex items-center gap-3"><IndianRupee size={18} className="text-emerald-500"/> ₹{doc.fee} Consultation Fee</p>
                            </div>
                            <button 
                                onClick={() => setSelectedDoctor(doc)}
                                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-600/20"
                            >
                                <Calendar size={20} /> Book Appointment
                            </button>
                        </div>
                    ))}
                    {doctors.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-400 font-medium text-lg bg-white rounded-3xl border border-slate-100">
                            No doctors available at this hospital yet.
                        </div>
                    )}
                </div>
            )}

            {selectedDoctor && (
                <BookingModal doctor={selectedDoctor} hospital={hospital} onClose={() => setSelectedDoctor(null)} />
            )}
        </div>
    );
};

const BookingModal = ({ doctor, hospital, onClose }) => {
    const [formData, setFormData] = useState({
        name: '', reason: '', date: '', time: '', age: '', gender: '', phoneNo: '', alternateNo: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post(`/api/appointments/${doctor._id}`, formData, { withCredentials: true });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to book appointment");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-2xl animate-in zoom-in-95">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-3">Booking Requested!</h3>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">Your appointment with <strong className="text-slate-700">{doctor.name}</strong> at <strong className="text-slate-700">{hospital.name}</strong> has been submitted. You will receive an email confirmation once it is approved by the hospital.</p>
                    <button onClick={onClose} className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 font-bold py-4 rounded-2xl transition-colors">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
                <div className="bg-slate-50 p-6 rounded-t-3xl border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">Book Appointment</h3>
                        <p className="text-indigo-600 font-bold mt-1">With {doctor.name} - ₹{doctor.fee}</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 font-black text-xl transition-colors">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    {error && <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold animate-in slide-in-from-top-2">{error}</div>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 text-sm">Patient Name</label>
                            <input required type="text" className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 text-sm">Age</label>
                            <input required type="number" className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="Age in years" />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 text-sm">Gender</label>
                            <select required className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 text-sm">Phone Number</label>
                            <input required type="tel" className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium" value={formData.phoneNo} onChange={e => setFormData({...formData, phoneNo: e.target.value})} placeholder="Mobile number" />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 text-sm">Preferred Date</label>
                            <input required type="date" className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div className="space-y-2">
                            <label className="font-bold text-slate-700 text-sm">Preferred Time</label>
                            <input required type="time" className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="font-bold text-slate-700 text-sm">Reason for Visit</label>
                            <textarea required className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none h-32 font-medium" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Briefly describe your symptoms or reason for appointment..."></textarea>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-4 rounded-2xl transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:scale-100 active:scale-95">
                            {loading ? 'Submitting...' : 'Confirm Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HospitalDetails;
