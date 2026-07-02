// src/app/dashboard/admin/verifications/page.jsx

import VerifyDoctorsClient from "./VerifyDoctorsClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Verify Doctors | MediCare Connect",
    description: "Review doctor credentials, approve verification requests, and maintain trusted healthcare professionals on the platform.",
    keywords: ["Doctor Verification", "Medical Credentials", "Admin Verification", "Verified Doctors"],
};

async function getDoctorsForVerification() {
  try {
    // Calling the new Express API endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/doctors-verification`, {
      cache: "no-store", // Disabling cache for real-time data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch doctors list from server");
    }

    return await res.json(); // Directly returns the array of doctors
  } catch (error) {
    console.error("Fetch Error in Verification Page:", error);
    return []; // Returns an empty array as a fallback in case of an error
  }
}

export default async function VerificationsPage() {
  const doctorsData = await getDoctorsForVerification();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Verify Practitioner Licenses
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Hospital Ecosystem Controls and Credentials Auditing.
        </p>
      </div>

      {/* Passing data to the client component */}
      <VerifyDoctorsClient initialDoctors={doctorsData} />
    </div>
  );
}