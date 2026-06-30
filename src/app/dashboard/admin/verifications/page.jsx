// src/app/dashboard/admin/verifications/page.jsx

import VerifyDoctorsClient from "./VerifyDoctorsClient";

async function getDoctorsForVerification() {
  try {
    // আমাদের নতুন এক্সপ্রেস এপিআই এন্ডপয়েন্ট কল করা হলো
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/doctors-verification`, {
      cache: "no-store", // রিয়েল-টাইম ডাটার জন্য ক্যাশ অফ
    });

    if (!res.ok) {
      throw new Error("Failed to fetch doctors list from server");
    }

    return await res.json(); // এটি সরাসরি ডক্টরদের অ্যারে রিটার্ন করবে
  } catch (error) {
    console.error("Fetch Error in Verification Page:", error);
    return []; // এরর হলে সেফটি হিসেবে খালি অ্যারে রিটার্ন করবে
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

      {/* ক্লায়েন্ট কম্পোনেন্টে ডাটা পাস */}
      <VerifyDoctorsClient initialDoctors={doctorsData} />
    </div>
  );
}