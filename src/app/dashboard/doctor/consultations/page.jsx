// 📂 src/app/dashboard/doctor/consultations/page.jsx
import React from 'react';
import ConsultationsClient from './ConsultationsClient';

const DOCTOR_EMAIL = "doctor@doctor.com"; 

// ১. এটি একটি সাধারণ হেল্পার ফাংশন যা ডেটা ফেচ করে আনবে
async function getDoctorAppointments(email) {
    let appointments = []; 

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor/appointments?email=${email}`, {
            cache: 'no-store'
        });
        
        if (res.ok) {
            const result = await res.json();
            
            if (result.success && Array.isArray(result.data)) {
                appointments = result.data;
            } else if (Array.isArray(result)) { 
                appointments = result;
            }
        }
    } catch (error) {
        console.error("Failed to fetch appointments:", error);
    }

    return appointments;
}

// 🎯 ২. এটি মূল পেজ কম্পোনেন্ট যা Next.js-এর নিয়ম অনুযায়ী default export করা হয়েছে
export default async function DoctorConsultationsPage() {
    // ডেটা ফেচিং ফাংশন কল করে ডাটা আনা হলো
    const appointments = await getDoctorAppointments(DOCTOR_EMAIL);

    return (
        <div>
            {/* ক্লায়েন্ট কম্পোনেন্টে প্রপস হিসেবে ডাটা পাঠানো হলো */}
            <ConsultationsClient initialAppointments={appointments} doctorEmail={DOCTOR_EMAIL} />
        </div>
    );
}