// 📂 src/app/dashboard/doctor/prescription/page.jsx
import React from 'react';
import PrescriptionsClient from './PrescriptionsClient';

async function fetchFromBackend(endpoint) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            const result = await res.json();
            return result.success ? result.data : [];
        }
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
    }
    return [];
}

export default async function DoctorPrescriptionPage() {
    // 💡 আপনার সেশন লজিক থাকলে এখানে বসিয়ে ইমেইলটি ডাইনামিক করতে পারেন
    const DOCTOR_EMAIL = "doctor@doctor.com"; 

    // ১. কিউ-এর জন্য শুধুমাত্র 'confirmed' অ্যাপয়েন্টমেন্ট নিয়ে আসা
    const acceptedAppointments = await fetchFromBackend(`/api/doctor/appointments?email=${DOCTOR_EMAIL}&status=confirmed`);

    let initialPrescriptions = [];
    let currentDoctorId = null;

    // ২. ডক্টরের আসল ObjectId কালেকশন থেকে ডিটেক্ট করা
    if (acceptedAppointments.length > 0) {
        currentDoctorId = acceptedAppointments[0].doctorId;
    } else {
        const allApps = await fetchFromBackend(`/api/doctor/appointments?email=${DOCTOR_EMAIL}`);
        if (allApps.length > 0) {
            currentDoctorId = allApps[0].doctorId;
        }
    }

    // ৩. ডক্টর আইডি পাওয়া গেলে ওনার আগের সব প্রেসক্রিপশন হিস্ট্রি লগের ডাটা আনা
    if (currentDoctorId) {
        initialPrescriptions = await fetchFromBackend(`/api/prescriptions?doctorId=${currentDoctorId}`);
    }

    return (
        <PrescriptionsClient 
            acceptedAppointments={acceptedAppointments} 
            initialPrescriptions={initialPrescriptions}
            currentDoctorId={currentDoctorId}
            doctorEmail={DOCTOR_EMAIL}
        />
    );
}