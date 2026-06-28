"use client"
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Briefcase, GraduationCap, DollarSign, Clock, Save, RefreshCw, User, Shield, Building, Calendar, Check } from 'lucide-react';

const DAYS_OPTIONS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SLOTS_OPTIONS = [
    "09:00 AM - 12:00 PM",
    "11:00 AM - 03:00 PM",
    "03:00 PM - 06:00 PM",
    "04:00 PM - 07:00 PM",
    "06:00 PM - 09:00 PM",
    "07:00 PM - 10:00 PM"
];

export default function DoctorCredentialsForm({ userBasicInfo, initialFormData }) {
    const [loading, setLoading] = useState(false);
    
    // কোনো useEffect লাগবে না, সরাসরি স্টেট ইনিশিয়ালাইজেশন
    const [formData, setFormData] = useState({
        doctorName: initialFormData?.doctorName || '',
        specialization: initialFormData?.specialization || '',
        qualifications: initialFormData?.qualifications || '',
        experience: initialFormData?.experience ?? '',
        consultationFee: initialFormData?.consultationFee ?? '',
        hospitalName: initialFormData?.hospitalName || '',
        availableDays: Array.isArray(initialFormData?.availableDays)
            ? initialFormData.availableDays
            : (initialFormData?.availableDays ? initialFormData.availableDays.split(',').map(d => d.trim()) : []),
        availableSlots: Array.isArray(initialFormData?.availableSlots)
            ? initialFormData.availableSlots
            : (initialFormData?.availableSlots ? initialFormData.availableSlots.split(',').map(s => s.trim()) : [])
    });

    const handleDayToggle = (day) => {
        const currentDays = [...formData.availableDays];
        if (currentDays.includes(day)) {
            setFormData({ ...formData, availableDays: currentDays.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, availableDays: [...currentDays, day] });
        }
    };

    const handleSlotToggle = (slot) => {
        const currentSlots = [...formData.availableSlots];
        if (currentSlots.includes(slot)) {
            setFormData({ ...formData, availableSlots: currentSlots.filter(s => s !== slot) });
        } else {
            setFormData({ ...formData, availableSlots: [...currentSlots, slot] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.availableDays.length === 0) {
            return toast.error("Please select at least one available day");
        }
        if (formData.availableSlots.length === 0) {
            return toast.error("Please select at least one time slot");
        }

        setLoading(true);

        const payload = {
            email: userBasicInfo?.email || "doctor@doctor.com",
            doctorName: formData.doctorName,
            specialization: formData.specialization,
            qualifications: formData.qualifications,
            experience: parseInt(formData.experience) || 0,
            consultationFee: parseFloat(formData.consultationFee) || 0,
            hospitalName: formData.hospitalName,
            availableDays: formData.availableDays,
            availableSlots: formData.availableSlots,
            profileImage: userBasicInfo?.photo || "",
            verificationStatus: "Verified",
            rating: 4.8
        };

        try {
            const response = await fetch('http://localhost:5000/api/doctor/save-credentials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    // 💡 ডাটা যখনই আসবে, ফর্ম যেন রিলোভড হয় তার জন্য একটি ইউনিক কী (Key) তৈরি করছি
    const formKey = initialFormData?._id || userBasicInfo?.email || "empty-form";

    return (
        <div key={formKey}> {/* 👈 এখানে key যুক্ত করায় ডাটা আসবামাত্র ফর্ম ভ্যালু আপডেট হবে এবং কোনো ESLint এরর আসবে না */}
            {/* Top Minimal Banner */}
            <div className="mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-blue-700 to-blue-900 p-6 text-white shadow-md flex items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={userBasicInfo?.photo} 
                    alt="Doctor"
                    className="h-16 w-16 rounded-xl object-cover border-2 border-white/20 bg-white/10"
                    onError={(e) => { e.target.src = 'https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp'; }}
                />
                <div>
                    <h2 className="text-lg font-bold">Welcome, Doctor!</h2>
                    <p className="text-blue-200 text-xs">Fill up the complete professional form below.</p>
                </div>
            </div>

            {/* Main Full Form Card */}
            <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                        
                        {/* 1. Doctor Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Doctor Full Name</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text" required
                                    value={formData.doctorName}
                                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                                    className="block w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>

                        {/* 2. Specialization */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Specialization</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Shield className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text" required placeholder="e.g., Neurology, Cardiology"
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                    className="block w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>

                        {/* 3. Qualifications */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Qualifications Statement</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <GraduationCap className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text" required placeholder="e.g., MBBS, MD, FRCP"
                                    value={formData.qualifications}
                                    onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                                    className="block w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>

                        {/* 4. Experience */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Experience (Years)</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Briefcase className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="number" required min="0" placeholder="e.g., 22"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                    className="block w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>

                        {/* 5. Consultation Fee */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Consultation Fee ($)</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <DollarSign className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="number" required min="0" placeholder="e.g., 195"
                                    value={formData.consultationFee}
                                    onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                                    className="block w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>

                        {/* 6. Hospital Name */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Hospital Name & Center</label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Building className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text" required placeholder="e.g., Neuro Care & Research Center"
                                    value={formData.hospitalName}
                                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                                    className="block w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                                />
                            </div>
                        </div>

                        {/* 7. Available Days */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2 items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-slate-400" /> Available Days
                            </label>
                            <div className="flex flex-wrap gap-2.5 mt-2">
                                {DAYS_OPTIONS.map((day) => {
                                    const isSelected = formData.availableDays.includes(day);
                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDayToggle(day)}
                                            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                                isSelected 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            {isSelected && <Check className="h-3.5 w-3.5" />}
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 8. Available Slots */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2 items-center gap-1.5">
                                <Clock className="h-4 w-4 text-slate-400" /> Available Time Slots
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {SLOTS_OPTIONS.map((slot) => {
                                    const isSelected = formData.availableSlots.includes(slot);
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => handleSlotToggle(slot)}
                                            className={`flex items-center justify-between p-3.5 rounded-xl text-sm border text-left transition-all ${
                                                isSelected 
                                                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            <span>{slot}</span>
                                            <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                                                isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                                            }`}>
                                                {isSelected && <Check className="h-3.5 w-3.5" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
                    <button
                        type="submit" disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Setup Profile
                    </button>
                </div>
            </form>
        </div>
    );
}