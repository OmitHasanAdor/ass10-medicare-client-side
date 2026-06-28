// 📂 src/app/dashboard/doctor/consultations/page.jsx
import React from 'react';
import ConsultationsClient from './ConsultationsClient';

// এখানে সাময়িকভাবে আপনার ডক্টরের ইমেল দেওয়া হলো। 
// আপনি Better Auth বা আপনার সেশন সোর্স থেকে ডাইনামিক ইমেলটি এখানে বসাবেন।
const DOCTOR_EMAIL = "doctor@doctor.com"; 

async function getDoctorAppointments(email) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor/appointments?email=${email}`, {
            cache: 'no-store' 
        });
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return await res.json();
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
}

export default async function DoctorConsultationsPage() {
    const appointments = await getDoctorAppointments(DOCTOR_EMAIL);

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Clinical Appointment Inbox</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Manage your upcoming consultations, accept requests, or proceed to fill prescriptions.
                </p>
            </div>

            {/* ক্লায়েন্ট কম্পোনেন্টে প্রপস হিসেবে ডাটা পাঠানো হলো */}
            <ConsultationsClient initialAppointments={appointments} doctorEmail={DOCTOR_EMAIL} />
        </div>
    );
}