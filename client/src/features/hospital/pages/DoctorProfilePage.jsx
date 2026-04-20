import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getDoctor } from '../services/doctor.api';
import { gsap } from 'gsap';
import Loading from '../components/Loading';

const DoctorProfilePage = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                const response = await getDoctor({ doctorId });
                setDoctor(response.data?.data); 
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [doctorId]);

    useEffect(() => {
        if (!loading && doctor) {
            window.scrollTo(0, 0);
            gsap.fromTo(containerRef.current, 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }
            );
        }
    }, [loading, doctor]);

    if (loading) return <Loading />;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6fafe]">
            <div className="text-center">
                <h2 className="text-3xl font-black text-red-500 mb-4">Profile Unavailable</h2>
                <button onClick={() => navigate('/hospital/doctors')} className="px-6 py-3 bg-[#171c1f] text-white rounded-full uppercase tracking-widest text-[10px] font-black">Return to Directory</button>
            </div>
        </div>
    );
    if (!doctor) return null;

    const initials = doctor?.name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase()?.slice(0, 2) || 'DR';

    return (
        <div className="min-h-screen bg-[#e4f0fc] font-sans pb-20 pt-10 px-4 md:px-12">
            <div className="max-w-6xl mx-auto">
                
                {/* Back Navigation */}
                <button 
                    onClick={() => navigate('/hospital/doctors')}
                    className="mb-8 flex items-center gap-3 text-[#6c7a71] hover:text-[#006c49] font-bold uppercase tracking-widest text-[10px] transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </div>
                    Back to Staff Directory
                </button>

                <div ref={containerRef} className="opacity-0">
                    {/* Header Banner */}
                    <div className="relative rounded-[40px] overflow-hidden bg-[url(https://i.pinimg.com/736x/e1/22/85/e12285c0f015bb13c5742bcd813c2b6b.jpg)] backdrop-blur-sm p-10 md:p-16 mb-8 shadow-xl shadow-green-100">
                        {/* Pattern Overlay */}
                        <div className='absolute inset-0 backdrop-blur-2xl'></div>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px', }}></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                            <div className="relative">
                                <div className="w-40 h-40 rounded-[32px] bg-white p-[5px] shadow-2xl rotate-3">
                                    <div className="w-full h-full rounded-[28px] bg-[#f6fafe] flex items-center justify-center text-[#006c49] text-6xl font-black -rotate-3 transition-transform hover:rotate-0 duration-500">
                                        {initials}
                                    </div>
                                </div>
                                {doctor?.availability !== false && (
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#10b981] border-4 border-white rounded-full shadow-lg"></div>
                                )}
                            </div>
                            
                            <div className="flex-1 pb-2">
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">Dr. {doctor.name}</h1>
                                <p className="text-green-100 font-bold tracking-widest uppercase text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-white"></span>
                                    {doctor.specialization} Focus
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bento Grid Content */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Left Column - Contact & Status */}
                        <div className="md:col-span-5 flex flex-col gap-8">
                            
                            {/* Availability Status */}
                            <div className={`p-8 rounded-[32px] border ${doctor?.availability !== false ? 'bg-white border-green-100 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Duty Status
                                </h4>
                                <div className="flex items-center gap-5">
                                    <span className="relative flex h-5 w-5">
                                        {doctor?.availability !== false && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-5 w-5 border-[3px] border-white shadow-md ${doctor?.availability !== false ? 'bg-[#10b981]' : 'bg-gray-400'}`}></span>
                                    </span>
                                    <div>
                                        <p className="font-black text-2xl text-[#171c1f] leading-none mb-1">
                                            {doctor?.availability !== false ? 'Active & Available' : 'Inactive Module'}
                                        </p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                                            {doctor?.availability !== false ? 'Accepting Appointments' : 'Not Participating'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Interface */}
                            <div className="p-8 bg-white rounded-[32px] border border-gray-50 shadow-sm">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Contact Interface
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-5  rounded-3xl p-2 hover:bg-[#f0f4f8] transition-colors border border-transparent hover:border-blue-50">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Email Connectivity</p>
                                            <p className="text-[#171c1f] font-black text-base">{doctor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 p-2 rounded-3xl hover:bg-[#f0fdf4] transition-colors border border-transparent hover:border-green-50">
                                        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Direct Line</p>
                                            <p className="text-[#171c1f] font-black text-base">{doctor.contact || 'Not Configured'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Grid */}
                        <div className="md:col-span-7 flex flex-col gap-8">
                            <div className="grid grid-cols-2 gap-8 h-full min-h-[300px]">
                                {/* Experience */}
                                <div className="bg-[#f0fdf4] p-8 md:p-10 rounded-[32px] border border-green-50 flex flex-col justify-end shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <svg className="w-24 h-24 text-[#006c49]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5l-10-5v1.5l10 5 10-5V4.5l-10 5zM2 13v1.5l10 5 10-5V13l-10 5-10-5zm0 4.5v1.5l10 5 10-5V17.5l-10 5-10-5z"/></svg>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[#006c49] font-black text-6xl md:text-8xl tracking-tighter leading-none mb-2">{doctor.experience}+</div>
                                        <p className="text-sm text-green-700 font-bold uppercase tracking-widest">Years Practice</p>
                                        <p className="mt-4 text-[#3c4a42] font-medium leading-relaxed max-w-[250px]">
                                            Dedicated to mastering clinical outcomes and providing top-tier patient care.
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Consultation Fee */}
                                <div className="bg-[#f0f4ff] p-8 md:p-10 rounded-[32px] border border-blue-50 flex flex-col justify-end shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <svg className="w-24 h-24 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-blue-700 font-black text-6xl md:text-7xl tracking-tighter leading-none mb-2 flex items-baseline"><span className="text-4xl">₹</span>{doctor.fee}</div>
                                        <p className="text-sm text-blue-600 font-bold uppercase tracking-widest">Visit Tariff</p>
                                        <p className="mt-4 text-[#3c4a42] font-medium leading-relaxed max-w-[250px]">
                                            Standard consultation fee per session, inclusive of priority healthcare review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
