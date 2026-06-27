import { getUserSession } from "@/lib/core/session";
import PatientReviewsClient from "./PatientReviewsClient";

export const metadata = {
  title: "My Feedback & Reviews - MediCare Connect",
};

const PatientReviewsPage = async () => {
  const user = await getUserSession();
  const patientId = user?._id || user?.id;

  let reviews = [];
  let doctorsList = [];

  if (patientId) {
    try {
      // ১. পেশেন্টের দেওয়া আগের রিভিউগুলো আনা
      const resReviews = await fetch(`http://localhost:5000/api/reviews/patient/${patientId}`, { cache: "no-store" });
      if (resReviews.ok) reviews = await resReviews.json();

      // ২. ড্রপডাউনে দেখানোর জন্য ডক্টরদের লিস্ট আনা (Add Review করার জন্য)
      // আপনার ডক্টর লিস্ট নিয়ে আসার এপিআই ইউআরএলটি এখানে বসাবেন
      const resDoctors = await fetch(`http://localhost:5000/api/doctors`, { cache: "no-store" });
      if (resDoctors.ok) doctorsList = await resDoctors.json();
    } catch (error) {
      console.error("Error loading review page data:", error);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">My Feedback & Reviews</h1>
          <p className="text-xs text-gray-500 mt-0.5">Share your medical experience and manage your shared opinions.</p>
        </div>
      </div>

      {/* ক্লায়েন্ট ইন্টারঅ্যাকশন কম্পোনেন্ট */}
      <PatientReviewsClient initialReviews={reviews} doctors={doctorsList} patientId={patientId} />
    </div>
  );
};

export default PatientReviewsPage;