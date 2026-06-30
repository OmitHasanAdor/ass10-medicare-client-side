import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Building2,
  Users,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-white">
      {/* Background Blur */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-blue-300/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
                MediCare
              </h2>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900">
              Smart
              <br />
              <span className="text-blue-600">Healthcare</span>
              <br />
              Starts Here
            </h1>

            {/* Description */}
            <p className="mt-6 text-base md:text-lg text-slate-600 max-w-xl">
              Find doctors, schedule appointments, and manage healthcare
              services from one platform.
            </p>

            {/* CTA */}
            <div className="mt-8">
             <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
                <Search size={20} /> Find Doctors
            </Link>
            </div>

            {/* Trust Text */}
            <div className="mt-6 flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Trusted Healthcare Platform</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative flex justify-center">
            {/* Doctor Image */}
            <Image
              src="/banner.png"
              alt="Doctor"
              width={700}
              height={700}
              priority
              className="relative z-10 w-[80%] sm:w-[70%] lg:w-full max-w-162.5 object-contain"
            />

            {/* Floating Cards - Desktop Only */}

            <div className="hidden lg:flex absolute top-10 left-0 bg-white shadow-xl rounded-2xl p-4 items-center gap-3 z-20">
              <Building2 className="text-blue-600" />
              <div>
                <h4 className="font-bold">50+</h4>
                <p className="text-sm text-gray-500">Hospitals</p>
              </div>
            </div>

            <div className="hidden lg:flex absolute top-24 right-0 bg-white shadow-xl rounded-2xl p-4 items-center gap-3 z-20">
              <Users className="text-blue-600" />
              <div>
                <h4 className="font-bold">500+</h4>
                <p className="text-sm text-gray-500">Doctors</p>
              </div>
            </div>

            <div className="hidden lg:flex absolute bottom-12 right-12 bg-white shadow-xl rounded-2xl p-4 items-center gap-3 z-20">
              <ShieldCheck className="text-blue-600" />
              <div>
                <h4 className="font-bold">10K+</h4>
                <p className="text-sm text-gray-500">Appointments</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS SECTION */}
        {/* <div className="mt-16 bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <div className="text-center p-8 border-b sm:border-b-0 sm:border-r">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">
                500+
              </div>
              <p className="mt-2 text-slate-600">Expert Doctors</p>
            </div>

            <div className="text-center p-8 border-b sm:border-b-0 sm:border-r">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">
                50+
              </div>
              <p className="mt-2 text-slate-600">Partner Hospitals</p>
            </div>

            <div className="text-center p-8">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">
                10K+
              </div>
              <p className="mt-2 text-slate-600">Appointments</p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Banner;