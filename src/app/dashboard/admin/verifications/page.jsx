import VerifyDoctorsClient from "./VerifyDoctorsClient";

// সার্ভার সাইড ডাটা ফেচিং
async function getDoctors() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors`, {
            cache: "no-store",
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching doctors on server:", error);
        return [];
    }
}

export default async function VerifyDoctorsPage() {
    const initialDoctors = await getDoctors();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* হেডার সেকশন */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Verify Practitioner Licenses
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Review medical credentials, certifications, and account authentication.
                </p>
            </div>

            {/* ইন্টারেক্টিভ ক্লায়েন্ট কম্পোনেন্ট */}
            <VerifyDoctorsClient initialDoctors={initialDoctors} />
        </div>
    );
}