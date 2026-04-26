import React, { useState } from 'react';
import { useHospital } from '../hooks/useHospital';
import { Activity, ShieldPlus, HeartPulse, ShieldCheck, Mail, Phone, User, Lock, Building2, MapPin, Clock, Tag, Globe, Map } from 'lucide-react';
import { useSelector } from 'react-redux';

const CreateHospital = () => {
  const { handleCreateHospital } = useHospital();
  const {hospitalAdmin} = useSelector((state) => state.hospital)
  
  
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    openingTime: '',
    closingTime: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    contactNumber: '',
    email: '',
    type: '',
    speciality: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Usually submit the combined data, but admin data can just be picked up by backend directly.
    handleCreateHospital(formData);
  };

  return (
    <div className="min-h-screen bg-[#f6fafe] flex selection:bg-[#00846e] selection:text-white font-['Inter']">
      
      {/* Left Pane - 3D/Visual Section */}
      <div className="hidden lg:flex w-[35%] xl:w-[40%] bg-[#006857] flex-col justify-between p-12 relative overflow-hidden top-0 h-screen">
        {/* Decorative Gradients & Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00846e] rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8cf6da] rounded-full mix-blend-overlay filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/3"></div>
        
        <div className="relative z-10 flex items-center space-x-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
             <HeartPulse size={24} className="text-[#8cf6da]" />
          </div>
          <span className="text-2xl font-['Manrope'] font-bold tracking-tight">HealthAxis</span>
        </div>

        <div className="relative z-10 flex-col">
          <div className="relative w-full aspect-square max-w-[350px] mx-auto mb-8 flex items-center justify-center">
            {/* Abstract 3D Medical Scene Placeholder */}
            <div className="absolute w-[280px] h-[280px] bg-linear-to-tr from-[#6fd9be] to-[#f4fffa] rounded-[3rem] rotate-12 shadow-2xl shadow-[#002019]/40 opacity-90 backdrop-blur-xl border border-white/20"></div>
            <div className="absolute w-[240px] h-[240px] bg-linear-to-br from-[#00846e] to-[#005142] rounded-full -rotate-6 shadow-xl shadow-[#002019]/50 flex items-center justify-center border border-white/10">
              <ShieldPlus size={100} className="text-[#8cf6da] drop-shadow-lg" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-[5%] right-[5%] w-14 h-14 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 flex items-center justify-center animate-[bounce_4s_infinite]">
               <Activity size={28} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-['Manrope'] font-extrabold text-white leading-tight mb-4 tracking-tight">
            Empower Your <br/> Healthcare.
          </h1>
          <p className="text-[#cbe9db] text-lg font-medium max-w-sm">
            Configure your facility details on the Restorative Ledger and step into a new era of management.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center space-x-2 text-[#b0cdc0] text-sm font-medium">
          <ShieldCheck size={18} />
          <span>HIPAA Compliant & Secure</span>
        </div>
      </div>

      {/* Right Pane - Form Section */}
      <div className="flex-1 flex flex-col px-6 lg:px-20 py-12 relative overflow-y-auto h-screen custom-scrollbar">
        <div className="w-full max-w-3xl mx-auto pb-12">
          
          <div className="mb-10 lg:hidden flex items-center space-x-3 text-[#006857]">
            <HeartPulse size={32} />
            <span className="text-2xl font-['Manrope'] font-bold tracking-tight">HealthAxis</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-['Manrope'] font-bold text-[#171c1f] mb-2 tracking-tight">Create Hospital Account</h2>
            <p className="text-[#4f6a5f] text-base">Register your medical facility into the HealthAxis network down below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* --- ADMIN DETAILS (Read Only) --- */}
            <div className="bg-white p-6 rounded-4xl border border-[#eaeef2] shadow-sm shadow-[#eaeef2]">
              <div className="mb-6 flex items-center space-x-2">
                 <ShieldPlus className="text-[#00846e]" size={24} />
                 <h3 className="text-xl font-['Manrope'] font-bold text-[#171c1f]">Administrator Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Admin Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a0aab2]">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={hospitalAdmin?.name || ''}
                      className="w-full pl-10 pr-4 py-3 bg-[#f0f4f8] border border-transparent rounded-2xl text-[#6d7a75] font-medium cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a0aab2]">
                      <Lock size={20} />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={hospitalAdmin?.role || 'Hospital Admin'}
                      className="w-full pl-10 pr-4 py-3 bg-[#f0f4f8] border border-transparent rounded-2xl text-[#6d7a75] font-medium cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact No */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Admin Contact No</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a0aab2]">
                      <Phone size={20} />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={hospitalAdmin?.number || ''}
                      className="w-full pl-10 pr-4 py-3 bg-[#f0f4f8] border border-transparent rounded-2xl text-[#6d7a75] font-medium cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Admin Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Admin Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a0aab2]">
                      <Mail size={20} />
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={hospitalAdmin?.email || ''}
                      className="w-full pl-10 pr-4 py-3 bg-[#f0f4f8] border border-transparent rounded-2xl text-[#6d7a75] font-medium cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --- HOSPITAL DETAILS --- */}
            <div className="bg-white p-6 rounded-4xl border border-[#eaeef2] shadow-sm shadow-[#eaeef2]">
              <div className="mb-6 flex items-center space-x-2">
                 <Building2 className="text-[#00846e]" size={24} />
                 <h3 className="text-xl font-['Manrope'] font-bold text-[#171c1f]">Hospital Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Hospital Name */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Hospital Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Building2 size={20} />
                    </div>
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      placeholder="e.g. City General Hospital"
                      required
                    />
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Hospital Type *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Tag size={20} />
                    </div>
                    <input
                      type="text"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      placeholder="e.g. Private, Public, Trust"
                      required
                    />
                  </div>
                </div>

                {/* Speciality */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Speciality *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Activity size={20} />
                    </div>
                    <input
                      type="text"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      placeholder="e.g. Multi-Speciality, Cardiology"
                      required
                    />
                  </div>
                </div>

                {/* Hospital Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Hospital Email *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      placeholder="contact@hospital.com"
                      required
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Hospital Phone *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Phone size={20} />
                    </div>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                {/* Opening Time */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Opening Time *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Clock size={20} />
                    </div>
                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Closing Time */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Closing Time *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Clock size={20} />
                    </div>
                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      required
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* --- LOCATION DETAILS --- */}
            <div className="bg-white p-6 rounded-4xl border border-[#eaeef2] shadow-sm shadow-[#eaeef2]">
              <div className="mb-6 flex items-center space-x-2">
                 <MapPin className="text-[#00846e]" size={24} />
                 <h3 className="text-xl font-['Manrope'] font-bold text-[#171c1f]">Location Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Address */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-semibold text-[#3d4945] block">Full Address *</label>
                  <div className="relative">
                    <div className="absolute top-4 left-3 flex items-start pointer-events-none text-[#6d7a75]">
                      <Map size={20} />
                    </div>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all min-h-[80px] resize-y"
                      placeholder="123 Wellness Ave, Suite 400"
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                    placeholder="New York"
                    required
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                    placeholder="NY"
                    required
                  />
                </div>

                {/* Pincode */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#3d4945] block">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                    placeholder="10001"
                    required
                  />
                </div>

                {/* Country */}
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-semibold text-[#3d4945] block">Country *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d7a75]">
                      <Globe size={20} />
                    </div>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#bcc9c4]/60 rounded-2xl text-[#171c1f] focus:outline-none focus:border-[#006857] focus:ring-4 focus:ring-[#006857]/10 transition-all"
                      placeholder="United States"
                      required
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-8 w-full py-4 px-6 bg-linear-to-r from-[#006857] to-[#00846e] text-white font-bold tracking-wide text-lg rounded-4xl hover:shadow-lg hover:shadow-[#00846e]/30 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#8cf6da]/50 border border-[#8cf6da]/20 sticky bottom-6 z-20"
            >
              Create Hospital Account
            </button>
            
          </form>
          
        </div>
      </div>
      
      {/* Scrollbar styling for the right pane */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f6fafe;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d6dade;
          border-radius: 20px;
        }
      `}} />

    </div>
  );
};

export default CreateHospital;