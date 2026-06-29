// src/app/dashboard/patient/page.jsx
import { auth } from "@/lib/auth"; 
import PatientOverviewClient from "./PatientOverviewClient";
import { headers } from "next/headers";

export default async function PatientDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return <div className="flex h-[60vh] items-center justify-center text-gray-500 font-medium">Please sign in.</div>;
    }

    let appointments = [];
    let patientName = session.user.name || "Patient";

    try {
        // নতুন তৈরি করা এক্সপ্রেস এপিআই-তে সিঙ্গেল হিট করা
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/patient-dashboard-data?email=${session.user.email}`, {
            cache: "no-store"
        });

        if (response.ok) {
            appointments = await response.json();
            console.log("appointments",appointments)
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }

    return <PatientOverviewClient appointments={appointments} patientName={patientName} />;
}