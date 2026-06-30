import React from 'react';
import { FaUsers, FaClock, FaStar, FaNotesMedical, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { headers } from "next/headers";
import { auth } from '@/lib/auth';

export const metadata = {
    title: "Doctor Dashboard | MediCare Connect",
    description: "Manage your medical practice, appointments, schedules, and patient consultations from your professional dashboard.",
    keywords: ["Doctor Dashboard", "Medical Practice", "Healthcare Portal", "Doctor Panel"],
};

export default async function DoctorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const doctorId = session?.user?.id || session?.user?._id;
  const doctorEmail = session?.user?.email;

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

  // ইনিশিয়াল স্টেট
  let stats = { distinctPatients: 0, pendingRequests: 0, clinicianScore: "0.0 / 5.0", totalPrescriptions: 0 };
  let reviews = []; // 👈 রিভিউ ধরে রাখার এরে

  const targetIdentifier = doctorEmail || doctorId;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor-stats/${targetIdentifier}`, {
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        stats = data.stats;
        reviews = data.reviews || []; // 👈 ডাইনামিক রিভিউ ডাটা অ্যাসাইন
      }
    }
  } catch (error) {
    console.error("Error fetching doctor stats on Frontend:", error);
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-slate-50">
      
      {/* 👑 হেডার সেকশন */}
      <div className="mb-8 bg-linear-to-r from-blue-700 to-blue-950 p-6 sm:p-8 rounded-2xl shadow-lg text-white">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Clinical Overview</h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-2 max-w-xl opacity-90">
          Welcome back, <span className="font-bold text-white underline">{session?.user?.name || 'Doctor'}</span>!
        </p>
      </div>

      {/* 📊 ৪টি স্ট্যাটস কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Distinct Patients</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{stats.distinctPatients}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl"><FaUsers className="text-xl sm:text-2xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Requests</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{stats.pendingRequests}</h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><FaClock className="text-xl sm:text-2xl" /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Clinician Score</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">{stats.clinicianScore}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FaStar className="text-xl sm:text-2xl" /></div>
        </div>

        <div className="bg-linear-to-br from-blue-700 to-indigo-800 p-5 rounded-xl shadow-md text-white flex items-center justify-between transform hover:scale-[1.02] transition">
          <div>
            <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">Total Rx Issued</p>
            <h3 className="text-2xl sm:text-3xl font-black mt-2">{stats.totalPrescriptions}</h3>
          </div>
          <div className="p-3 bg-white/10 text-white rounded-xl"><FaNotesMedical className="text-xl sm:text-2xl" /></div>
        </div>
      </div>

      {/* 💬 ⭐ Recent Patient Testimonials সেকশন (image_a1567e.png ম্যাচিং ডিজাইন) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Recent Patient Testimonials</h2>
        
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No reviews received yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-5 bg-slate-50/60 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-700">{rev.patientName}</h4>
                    <div className="flex gap-0.5 text-amber-400 text-xs">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    &quot;{rev.reviewText}&quot;
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 block mt-4 text-right">
                  {new Date(rev.reviewDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚀 কুইক নেভিগেশন প্যানেল */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-lg font-bold text-slate-800">Quick Clinical Actions</h2>
          <p className="text-xs text-slate-400 mt-0.5">Speed up your workflow by accessing features directly</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/doctor/consultations" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-600 transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">🤝</div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Manage Consultations</h4>
                <p className="text-[11px] text-slate-400">View and accept appointments</p>
              </div>
            </div>
            <FaChevronRight className="text-xs text-slate-300 group-hover:text-blue-700 transition" />
          </Link>

          <Link href="/dashboard/doctor/prescription" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-600 transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">📝</div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">Prescriptions Cabin</h4>
                <p className="text-[11px] text-slate-400">Write or modify prescriptions</p>
              </div>
            </div>
            <FaChevronRight className="text-xs text-slate-300 group-hover:text-indigo-700 transition" />
          </Link>

          <Link href="/dashboard/doctor/credentials" className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-600 transition group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">🔑</div>
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