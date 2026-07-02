//  src/app/dashboard/doctor/prescription/page.jsx
import React from 'react';
import PrescriptionsClient from './PrescriptionsClient';

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Prescription Management | MediCare Connect",
    description: "Create, manage, and maintain digital prescriptions for patients during medical consultations.",
    keywords: ["Prescription", "Digital Prescription", "Medical Records", "Patient Treatment"],
};

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
    // Integrate your session logic here to make the email dynamic if required
    const DOCTOR_EMAIL = "doctor@doctor.com"; 

    // 1. Fetch only 'confirmed' appointments for the consultation queue
    const acceptedAppointments = await fetchFromBackend(`/api/doctor/appointments?email=${DOCTOR_EMAIL}&status=confirmed`);

    let initialPrescriptions = [];
    let currentDoctorId = null;

    // 2. Detect the actual doctor ObjectId from the collection data mapping
    if (acceptedAppointments.length > 0) {
        currentDoctorId = acceptedAppointments[0].doctorId;
    } else {
        const allApps = await fetchFromBackend(`/api/doctor/appointments?email=${DOCTOR_EMAIL}`);
        if (allApps.length > 0) {
            currentDoctorId = allApps[0].doctorId;
        }
    }

    // 3. Fetch historical prescription logs once the doctorId is verified
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