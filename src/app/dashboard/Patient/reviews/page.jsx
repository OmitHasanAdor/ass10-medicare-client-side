import { getUserSession } from "@/lib/core/session";
import PatientReviewsClient from "./PatientReviewsClient";

export const metadata = {
    title: "Feedback & Reviews | MediCare Connect",
    description: "Share your healthcare experience by rating doctors and providing valuable feedback after consultations.",
    keywords: ["Doctor Reviews", "Patient Feedback", "Ratings", "Healthcare Reviews"],
};

const PatientReviewsPage = async () => {
  const user = await getUserSession();
  const patientId = user?._id || user?.id;

  let reviews = [];
  let doctorsList = [];

  if (patientId) {
    try {
      // 1. Fetch previous reviews submitted by the patient
      const resReviews = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews/patient/${patientId}`, { cache: "no-store" });
      if (resReviews.ok) reviews = await resReviews.json();

      // 2. Fetch the doctors list for the dropdown select component (to support Add Review)
      const resDoctors = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors`, { cache: "no-store" });
      if (resDoctors.ok) {
        const responseData = await resDoctors.json();
        // Fallback checks if the response is a clean array or if it holds nested .data / .doctors structures
        doctorsList = Array.isArray(responseData) 
          ? responseData 
          : (responseData.data || responseData.doctors || []);
      }
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

      {/* Client interaction component wrapper */}
      <PatientReviewsClient initialReviews={reviews} doctors={doctorsList} patientId={patientId} />
    </div>
  );
};

export default PatientReviewsPage;