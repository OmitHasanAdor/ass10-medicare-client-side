import React from 'react';
import ManageScheduleForm from './ManageScheduleForm';

export const metadata = {
    title: "Manage Schedules | MediCare Connect",
    description: "Update your consultation availability, clinic schedules, and appointment time slots for patients.",
    keywords: ["Doctor Schedule", "Availability", "Appointment Slots", "Clinic Schedule"],
};

async function getDoctorSchedule(email) {
    if (!email) return null;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor-profile?email=${email}`, { cache: 'no-store' });
        return response.ok ? await response.json() : null;
    } catch (error) {
        console.error("Error fetching doctor profile for schedule:", error);
        return null;
    }
}

export default async function ManageSchedulePage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const email = resolvedSearchParams?.email || "doctor@doctor.com"; // Backup email

    const doctorData = await getDoctorSchedule(email);

    // Fallback empty arrays defined as defaults if no database entries exist
    const initialSchedule = {
        email: email,
        availableDays: doctorData?.availableDays || [],
        availableSlots: doctorData?.availableSlots || []
    };

    return (
        <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Manage Clinical Schedule Slots
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Configure your working weekdays and hourly appointment time slots.
                </p>
            </div>

            {/* Client interface component */}
            <ManageScheduleForm initialSchedule={initialSchedule} />
        </div>
    );
}