import React from "react";
import { Card, Link } from "@heroui/react";
import { Star, Award, CircleDollarSign, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function DoctorCard({ doctor }) {
  if (!doctor) return null;

  // ডাটাবেজের অবজেক্ট আইডি বা আইডি হ্যান্ডেল করা
  const doctorId = doctor._id?.$oid || doctor._id;

  return (
    <Card className="p-5 w-full max-w-105 border-none bg-zinc-900 text-zinc-100 rounded-[32px] shadow-2xl flex flex-col justify-between">
      <div>
        {/* ডক্টর ইমেজ ও স্পেশালিটি ব্যাজ */}
        <div className="relative w-full h-50 bg-zinc-800 rounded-[24px] overflow-hidden mb-4">
          <Image
            src={doctor.profileImage || "https://images.unsplash.com/photo-1622253692010-333f2da6031d"}
            alt={doctor.doctorName || "Doctor"}
            className="w-full h-full object-cover"
            width={400}
            height={400} // স্ট্রিং '400' এর বদলে সংখ্যা হিসেবে দেওয়া হয়েছে
            unoptimized // এক্সটার্নাল Unsplash ইমেজ নেক্সট ইমেজে লোড করানোর জন্য এটি নিরাপদ
          />
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-md">
            {doctor.specialization}
          </div>
        </div>

        {/* ডক্টরের নাম এবং রেটিং / ভেরিফিকেশন স্ট্যাটাস */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-2xl font-semibold tracking-tight text-white leading-tight flex items-center gap-1.5">
            {/* 🎯 ডাটাবেজ ফিল্ড: doctorName */}
            {doctor.doctorName}
            {/* 🎯 ডাটাবেজ ফিল্ড: verificationStatus */}
            {doctor.verificationStatus === "Verified" && (
              <ShieldCheck className="text-blue-500 w-5 h-5 shrink-0" />
            )}
          </h3>
          
          {/* যদি ডাটাবেজে rating ফিল্ড থাকে তবে দেখাবে, নয়তো ডিফল্ট ৪.৮ বা হাইড রাখতে পারেন */}
          <div className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-zinc-800/80 px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {doctor.rating || "4.8"} 
          </div>
        </div>

        {/* ডিগ্রি এবং হসপিটাল */}
        <p className="text-sm text-zinc-400 mb-4 font-medium">
          {/* 🎯 ডাটাবেজ ফিল্ড: qualifications এবং hospitalName */}
          {doctor.qualifications || "MBBS, FCPS"} — <span className="text-zinc-300">{doctor.hospitalName || "Medicare Clinic"}</span>
        </p>

        {/* এক্সপেরিয়েন্স এবং ফি সেকশন */}
        <div className="flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4 mb-4">
          <div className="flex items-center gap-2 bg-zinc-800/60 px-4 py-2 rounded-full border border-zinc-800">
            <Award className="text-blue-500 w-4 h-4" />
            {/* 🎯 ডাটাবেজ ফিল্ড: experience */}
            <span className="text-xs font-medium text-zinc-200">{doctor.experience} Yrs Experience</span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-800/60 px-4 py-2 rounded-full border border-zinc-800">
            <div className="flex justify-center items-center bg-blue-500/20 rounded-full w-5 h-5">
              <CircleDollarSign className="text-blue-400 w-3.5 h-3.5" />
            </div>
            {/* 🎯 ডাটাবেজ ফিল্ড: consultationFee */}
            <span className="text-xs font-bold text-zinc-200">${doctor.consultationFee} Consultation Fee</span>
          </div>
        </div>
      </div>

      {/* অ্যাকশন বাটন */}
      <div className="border-t border-zinc-800/60 pt-4 mt-2">
        <Link
          href={`/find-doctors/${doctorId}`}
          className="group w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/10"
        >
          Book Appointment
          <ArrowRight className="group-hover:translate-x-1 text-white w-4 h-4 transition-transform duration-200" />
        </Link>
      </div>
    </Card>
  );
}