import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // আপনার Better Auth কনফিগ ফাইলের পাথ

export async function generateMetadata({ params }) {
  const { id } = await params;
  const doctor = await getDoctorDetails(id);

  if (!doctor) {
    return {
      title: "Doctor Not Found | MediCare Connect",
      description: "The requested doctor profile could not be found.",
    };
  }

  return {
    title: `${doctor.doctorName} | ${doctor.specialization} | MediCare Connect`,
    description: `Book an appointment with ${doctor.doctorName}, a verified ${doctor.specialization} at ${doctor.hospitalName}. View qualifications, consultation fee, experience, availability, and schedule your appointment through MediCare Connect.`,
  };
}

// 🔍 এক্সপ্রেস ব্যাকএন্ড থেকে নির্দিষ্ট ডক্টরের ডেটা ফেচ করা
async function getDoctorDetails(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors/${id}`, {
      cache: "no-store", // রিয়েল-টাইম ফি বা ডেটা নিশ্চিত করতে
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch doctor details:", error);
    return null;
  }
}

const DoctorDetailsPage = async ({ params }) => {
  const { id } = await params;
  const doctor = await getDoctorDetails(id);

  // যদি ডাটাবেজে এই আইডির কোনো ডক্টর না থাকে
  if (!doctor) {
    notFound();
  }

  // 🔐 Better Auth এর মাধ্যমে কারেন্ট লগড-ইন ইউজারের সেশন বের করা
  const userSession = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUser = userSession?.user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* 🔙 Back to Doctors Button */}
      <Link
        href="/find-doctors"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium text-sm transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to All Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 📑 বাম পাশ: ডক্টরের প্রোফাইল ও ডিটেইলস (২ কলাম জুড়ে থাকবে) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden border p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            
            {/* ডক্টর ইমেজ */}
            <div className="relative h-40 w-40 bg-gray-100 rounded-xl overflow-hidden border-2 border-blue-50 shrink-0">
              {doctor.profileImage ? (
                <Image
                  src={doctor.profileImage}
                  alt={doctor.doctorName}
                  fill
                  className="object-cover"
                  sizes="160px"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
            </div>

            {/* ডক্টর ইনফো */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{doctor.doctorName}</h1>
                {doctor.verificationStatus === "Verified" && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>

              <p className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                {doctor.specialization}
              </p>

              {doctor.rating && (
                <div className="text-sm font-medium text-amber-500">
                  ⭐ {doctor.rating} Rating
                </div>
              )}

              <div className="border-t pt-3 mt-3 text-sm text-gray-600 space-y-1.5">
                <p><span className="font-semibold text-gray-800">Qualifications:</span> {doctor.qualifications}</p>
                <p><span className="font-semibold text-gray-800">Experience:</span> {doctor.experience} Years of Practice</p>
                <p><span className="font-semibold text-gray-800">Hospital:</span> {doctor.hospitalName}</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* চেম্বার ডে এবং স্লটস */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-800 text-sm">📅 Available Days</h3>
              <div className="flex flex-wrap gap-1.5">
                {doctor.availableDays?.map((day, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-gray-800 text-sm">🕒 Available Slots</h3>
              <div className="flex flex-wrap gap-1.5">
                {doctor.availableSlots?.map((slot, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium">
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 💳 ডান পাশ: অ্যাপয়েন্টমেন্ট ফর্ম ও পেমেন্ট গেটওয়ে (১ কলাম জুড়ে থাকবে) */}
        <div className="bg-white rounded-2xl shadow-md p-6 border h-fit sticky top-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Appointment Booking</h3>
            <p className="text-xs text-gray-500">Fill details and pay via Stripe safely</p>
          </div>

          {/* ডাইনামিক ফি ডিসপ্লে */}
          <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border">
            <span className="font-medium text-gray-600 text-sm">Consultation Fee</span>
            <span className="text-2xl font-black text-blue-600">${doctor.consultationFee}</span>
          </div>

          {/* 🚀 Stripe Hosted Checkout Form */}
          <form action={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-checkout-session`} method="POST" className="space-y-4">
            {/* হিডেন ফিল্ডস (পেমেন্ট ও মেটাডাটার জন্য প্রয়োজনীয়) */}
            <input type="hidden" name="doctorId" value={doctor._id} />
            <input type="hidden" name="doctorName" value={doctor.doctorName} />
            <input type="hidden" name="consultationFee" value={doctor.consultationFee} />
            {/* Better Auth থেকে পাওয়া কারেন্ট ইউজারের ইমেইল হিডেন হিসেবে ব্যাকএন্ডে যাচ্ছে */}
            <input type="hidden" name="patientEmail" value={currentUser?.email || ""} />

            {/* ডেট ইনপুট */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Select Date</label>
              <input 
                type="date" 
                name="appointmentDate" 
                required 
                className="w-full border p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition" 
              />
            </div>

            {/* স্লট সিলেকশন */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Select Time Slot</label>
              <select 
                name="appointmentTime" 
                required 
                className="w-full border p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
              >
                {doctor.availableSlots?.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            {/* সিম্পটম ইনপুট */}
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Symptoms (Optional)</label>
              <textarea 
                name="symptoms" 
                rows="3" 
                placeholder="Briefly describe your health issue..." 
                className="w-full border p-2.5 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition resize-none"
              ></textarea>
            </div>

            {/* সাবমিট বাটন */}
            {currentUser ? (
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition duration-200 shadow-sm"
              >
                Confirm & Pay With Stripe
              </button>
            ) : (
              <div className="text-center p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-medium">
                Please <Link href="/auth/signin" className="underline font-bold">Sign In</Link> to book an appointment.
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default DoctorDetailsPage;