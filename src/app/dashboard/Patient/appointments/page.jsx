import Link from "next/link";

const PatientAppointmentsPage = async ({ searchParams }) => {
  const { status } = await searchParams;
  const isSuccess = status === "success";

  return (
    <div className="flex items-center justify-center p-6 min-h-[60vh]">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-5 shadow-sm">
        
        {isSuccess ? (
          <>
            {/* 🎉 গ্রিন সাকসেস ব্যাজ */}
            <div className="mx-auto size-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 text-2xl font-bold animate-pulse">
              ✓
            </div>
            
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold text-gray-900">Appointment Booked!</h1>
              <p className="text-xs text-gray-500 leading-relaxed px-2">
                Your payment was received successfully via Stripe. Your schedule is locked in and pending doctor&apos;s final approval.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <Link 
                href="/dashboard/patient" 
                className="block w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-xs hover:bg-blue-700 transition shadow-sm"
              >
                View Patient Dashboard
              </Link>
              <Link 
                href="/find-doctors" 
                className="block w-full border text-gray-600 py-2.5 rounded-xl font-semibold text-xs hover:bg-gray-50 transition"
              >
                Book Another Doctor
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* 📋 পেশেন্টের সাধারণ অ্যাপয়েন্টমেন্ট লিস্ট */}
            <div className="text-left w-full">
              <h1 className="text-lg font-bold text-gray-900 mb-1">My Appointments</h1>
              <p className="text-xs text-gray-500 mb-4">Track your ongoing and past medical visits.</p>
              
              {/* ডাটাবেজ থেকে ডাটা এনে ম্যাপ করার জন্য ব্ল্যাঙ্ক স্টেট */}
              <div className="p-8 border border-dashed rounded-xl bg-gray-50 text-center text-xs text-gray-400">
                You have no upcoming appointments today.
              </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default PatientAppointmentsPage;