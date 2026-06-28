import React from 'react';
import { FaUsers, FaClock, FaStar, FaNotesMedical, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { headers } from "next/headers";
// আপনার প্রজেক্টের auth অবজেক্টটি যেখান থেকে এক্সপোর্ট করা হয়েছে, সেখান থেকে ইম্পোর্ট করুন
import { auth } from "@/lib/auth"; 

export default async function DoctorDashboardPage() {
  // 🎯 ১. ডাইনামিকালি সার্ভার সাইড সেশন নেওয়া
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ২. সেশন থেকে লগইন করা ডক্টরের আইডি নেওয়া (Better-Auth এ সাধারণত session.user.id বা session.user._id থাকে)
  const doctorId = session?.user?.id || session?.user?._id;

  // যদি কোনো কারণে ডক্টর লগইন করা না থাকে, তাহলে রিডাইরেক্ট বা এরর মেসেজ দেখাবে
  if (!doctorId) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <p className="text-red-500 font-bold text-lg">Unauthorized Access!</p>
          <p className="text-slate-500 text-sm mt-1">Please log in as a doctor to view this dashboard.</p>
        </div>
      </div>
    );
  }

  // ৩. ডাইনামিক ডেটার প্রাথমিক স্টেট
  let stats = {
    distinctPatients: 0,
    pendingRequests: 0,
    clinicianScore: "0.0 / 5.0",
    totalPrescriptions: 0
  };

  // ৪. ডাইনামিক ডক্টর আইডি দিয়ে আপনার ব্যাকএন্ড এপিআই কল করা
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor-stats/${doctorId}`, {
      cache: 'no-store' // রিয়েল-টাইম ডেটা নিশ্চিত করতে
    });
    const data = await res.json();
    if (data.success) {
      stats = data.stats;
    }
  } catch (error) {
    console.error("Error fetching doctor stats:", error);
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-slate-50">
      
      {/* 👑 হেডার সেকশন */}
      <div className="mb-8 bg-gradient-to-r from-blue-700 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Clinical Overview</h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-xl opacity-90">
          Welcome back, <span className="font-bold text-white underline">{session?.user?.name || 'Doctor'}</span>! Monitor your current standing, check on appointments queue, and build digital prescriptions smoothly.
        </p>
      </div>

      {/* 📊 ৪টি লাক্সারি স্ট্যাটস কার্ড গ্রিড (Fully Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        
        {/* কার্ড ১: Distinct Patients */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Distinct Patients</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{stats.distinctPatients}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <FaUsers className="text-xl sm:text-2xl" />
          </div>
        </div>

        {/* কার্ড ২: Pending Requests */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Requests</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{stats.pendingRequests}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
            <FaClock className="text-xl sm:text-2xl" />
          </div>
        </div>

        {/* কার্ড ৩: Clinician Score */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinician Score</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{stats.clinicianScore}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
            <FaStar className="text-xl sm:text-2xl" />
          </div>
        </div>

        {/* কার্ড ৪: Total Prescriptions Issued (রয়্যাল ব্লু থিম হাইলাইটার) */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-5 rounded-xl shadow-md text-white flex items-center justify-between transform hover:scale-[1.02] transition-all duration-300">
          <div>
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Total Rx Issued</p>
            <h3 className="text-2xl sm:text-3xl font-black mt-2">{stats.totalPrescriptions}</h3>
          </div>
          <div className="p-3 bg-white/10 text-white rounded-xl backdrop-blur-md">
            <FaNotesMedical className="text-xl sm:text-2xl" />
          </div>
        </div>

      </div>

      {/* 🚀 কুইক নেভিগেশন প্যানেল */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-lg font-bold text-slate-800">Quick Clinical Actions</h2>
          <p className="text-xs text-slate-400 mt-0.5">Speed up your workflow by accessing features directly</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link href="/dashboard/doctor/consultations" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-600 hover:bg-blue-50/30 transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg group-hover:bg-blue-700 group-hover:text-white transition">🤝</div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Manage Consultations</h4>
                <p className="text-[11px] text-slate-400">View and accept appointments</p>
              </div>
            </div>
            <FaChevronRight className="text-xs text-slate-300 group-hover:text-blue-700 transition" />
          </Link>

          <Link href="/dashboard/doctor/prescription" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-600 hover:bg-blue-50/30 transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-700 group-hover:text-white transition">📝</div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Prescriptions Cabin</h4>
                <p className="text-[11px] text-slate-400">Write or modify prescriptions</p>
              </div>
            </div>
            <FaChevronRight className="text-xs text-slate-300 group-hover:text-indigo-700 transition" />
          </Link>

          <Link href="/dashboard/doctor/credentials" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-600 hover:bg-blue-50/30 transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-700 group-hover:text-white transition">🔑</div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Profile Credentials</h4>
                <p className="text-[11px] text-slate-400">Update security & settings</p>
              </div>
            </div>
            <FaChevronRight className="text-xs text-slate-300 group-hover:text-emerald-700 transition" />
          </Link>

        </div>
      </div>

    </div>
  );
}