// src/app/dashboard/doctor/consultations/page.jsx
import React from 'react';
import ConsultationsClient from './ConsultationsClient';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';


export const dynamic = "force-dynamic";
export const metadata = {
    title: "Consultation Appointments | MediCare Connect",
    description: "View and manage patient consultation appointments, visit history, and treatment sessions efficiently.",
    keywords: ["Consultation", "Patient Appointments", "Doctor Visits", "Medical Consultation"],
};

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

// 2. This is the main page component which is exported as default according to Next.js rules
export default async function DoctorConsultationsPage() {
   
        const session = await auth.api.getSession({
            headers: await headers() // some endpoints might require headers
        })
    const DOCTOR_EMAIL = session?.user?.email || "doctor@doctor.com"; 
    // Fetching data by calling the data fetching function
    const appointments = await getDoctorAppointments(DOCTOR_EMAIL);

    return (
        <div>
            {/* Passing data as props to the client component */}
            <ConsultationsClient initialAppointments={appointments} doctorEmail={DOCTOR_EMAIL} />
        </div>
    );
}