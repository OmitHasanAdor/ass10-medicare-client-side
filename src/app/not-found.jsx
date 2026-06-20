import Link from "next/link";
import { Home, Search, HeartPulse } from "lucide-react";

const NotFound = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-white px-5">
      <div className="max-w-3xl mx-auto text-center">
        {/* Medical Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-6 rounded-3xl shadow-xl">
            <HeartPulse className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-blue-600">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-6 text-3xl md:text-5xl font-bold text-slate-900">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-5 text-slate-600 text-base md:text-lg max-w-xl mx-auto">
          The page you are looking for may have been removed, renamed,
          or is temporarily unavailable.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            <Home size={20} />
            Back To Home
          </Link>

          <Link
            href="/doctors"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
          >
            <Search size={20} />
            Find Doctors
          </Link>
        </div>

        {/* Extra Card */}
        <div className="mt-14 bg-white border border-slate-200 rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900">
            Need Medical Assistance?
          </h3>

          <p className="text-slate-600 mt-2">
            Our healthcare network is available to help you find doctors,
            hospitals, and appointments quickly.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 bg-red-100 text-red-600 px-5 py-3 rounded-xl font-semibold">
            Emergency Hotline: 999
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;