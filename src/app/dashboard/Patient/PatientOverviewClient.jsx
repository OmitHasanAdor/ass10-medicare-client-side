// src/app/dashboard/patient/PatientOverviewClient.jsx
"use client";

import React from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Heart, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import Image from "next/image";

export default function PatientOverviewClient({ appointments = [], patientName = "Patient" }) {
  
  // ১. আজকের তারিখ বের করা (টাইমজোন ও হাইড্রেশন সেফ রাখার জন্য লোকাল ফরমেট)
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // ২. ফিল্টারিং লজিক (রিয়েল-টাইম এবং ক্র্যাশ সেফটি চেক সহ)
  const upcomingAppointments = appointments.filter(app => app && app.appointmentDate >= todayStr);
  const appointmentHistory = appointments.filter(app => app && app.appointmentDate < todayStr);

  // ③. টোটাল পেমেন্ট হিসেব করা (যেগুলো 'paid')
  const totalPayments = appointments
    .filter(app => app && app.paymentStatus === "paid")
    .reduce((sum, app) => sum + (Number(app.amountPaid) || 0), 0);

  // ৪. ভিজিটেড ডক্টরস বের করা (Set ব্যবহার করে ডুপ্লিকেট রিমুভ ও ক্র্যাশ প্রোটেকশন)
  const uniqueDoctorIds = new Set();
  const visitedDoctors = appointments
    .filter(app => app && app.doctorDetails) // নিশ্চিত হওয়া doctorDetails অবজেক্ট আছে কিনা
    .map(app => app.doctorDetails)
    .filter(doc => {
      // মঙ্গোডিবির অবজেক্ট আইডি বা সাধারণ স্ট্রিং আইডি সেফলি হ্যান্ডেল করা
      const docId = doc._id?.$oid ? doc._id.$oid : doc._id?.toString();
      if (!docId || uniqueDoctorIds.has(docId)) return false;
      uniqueDoctorIds.add(docId);
      return true;
    })
    .slice(0, 4); // ড্যাশবোর্ডে সর্বোচ্চ ৪ জন দেখাবে

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/10 min-h-screen">
      
      {/* 🌟 হেডার সেকশন */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Welcome back, {patientName}! ✨</h1>
        <p className="text-xs md:text-sm text-gray-500">Monitor your upcoming health checkups and payments.</p>
      </div>

      {/* 📊 স্ট্যাটস গ্রিড (Stats Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* টোটাল পেমেন্ট */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition duration-300">
          <div className="space-y-1">
            <span className="text-xs md:text-sm text-gray-400 font-medium">Total Expenses</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">${totalPayments}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:scale-105 transition duration-300">
            <DollarSign size={22} />
          </div>
        </div>

        {/* আপকামিং ভিジット */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition duration-300">
          <div className="space-y-1">
            <span className="text-xs md:text-sm text-gray-400 font-medium">Upcoming Visits</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">{upcomingAppointments.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition duration-300">
            <Calendar size={22} />
          </div>
        </div>

        {/* টোটাল হিস্ট্রি */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-purple-200 transition duration-300 sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <span className="text-xs md:text-sm text-gray-400 font-medium">Consulted History</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">{appointmentHistory.length}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition duration-300">
            <Clock size={22} />
          </div>
        </div>

      </div>

      {/* 🔄 মেইন ড্যাশবোর্ড গ্রিড লেআউট */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📋 বাম দিকের ২-কলাম সেকশন (Upcoming & History) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="text-blue-500" size={18} /> Upcoming Appointments
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">Active</span>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-400 py-6 text-center">No upcoming schedules found.</p>
            ) : (
              <div className="space-y-4 max-h-95 overflow-y-auto pr-1">
                {upcomingAppointments.map((app) => (
                  <div key={app._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50/60 rounded-xl border border-gray-100 hover:bg-gray-50 transition gap-4">
                    <div className="flex gap-3 items-center">
                      <Image 
                        src={app.doctorDetails?.profileImage || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"} 
                        alt="Doctor" 
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                        width={400}
                        height={400}
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{app.doctorDetails?.doctorName || "Unknown Doctor"}</h4>
                        <p className="text-xs text-blue-600 font-medium">{app.doctorDetails?.specialization || "General"}</p>
                        <p className="text-[11px] text-gray-400 mt-1">Symptoms: <span className="text-gray-600 font-medium">{app.symptoms}</span></p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col justify-between w-full sm:w-auto items-end gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-gray-700 block" suppressHydrationWarning>{app.appointmentDate}</span>
                        <span className="text-[11px] text-gray-400 block">{app.appointmentTime}</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded capitalize">
                        {app.appointmentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointment History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={18} /> Appointment History
              </h2>
            </div>

            {appointmentHistory.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-400 py-6 text-center">No history available yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] text-gray-400 uppercase font-bold tracking-wider">
                      <th className="py-2.5">Doctor</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Amount</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                    {appointmentHistory.slice(0, 5).map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/50 transition">
                        <td className="py-3 font-semibold text-gray-800">{app.doctorDetails?.doctorName || "Doctor"}</td>
                        <td className="py-3 text-gray-500" suppressHydrationWarning>{app.appointmentDate}</td>
                        <td className="py-3 text-gray-900 font-bold">${app.amountPaid || 0}</td>
                        <td className="py-3 text-right">
                          <span className="inline-block text-[11px] px-2 py-0.5 font-medium bg-green-50 text-green-700 rounded">
                            Success
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* 🗂️ ডান দিকের কলাম (Favorite/Visited Doctors) */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                <Heart className="text-rose-500 fill-rose-500" size={18} /> Doctors
              </h2>
            </div>

            {visitedDoctors.length === 0 ? (
              <p className="text-xs md:text-sm text-gray-400 py-6 text-center">No visited doctor profiles.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {visitedDoctors.map((doc, idx) => doc && (
                  <div key={doc._id || idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-100 transition group">
                    <div className="flex gap-3 items-center">
                      <Image 
                        src={doc.profileImage || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"} 
                        alt="Doctor" 
                        className="w-9 h-9 rounded-full object-cover" 
                        width={400}
                        height={400}
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 text-xs md:text-sm">{doc.doctorName}</h4>
                        <p className="text-[11px] text-gray-400 font-medium">{doc.specialization || "General"}</p>
                      </div>
                    </div>
                    <Link 
                      href={`/find-doctors/${doc._id}`} 
                      className="p-1.5 bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-gray-100 transition shadow-sm"
                    >
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}