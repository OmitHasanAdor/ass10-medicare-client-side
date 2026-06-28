import React from 'react';
import { ShieldCheck, Users, Clock, Award, HeartHandshake, CheckCircle } from 'lucide-react';

// 💡 Next.js SEO Metadata (Server-side)
export const metadata = {
    title: 'About Us | MediCare Connect',
    description: 'Learn more about MediCare Connect, a modern healthcare ecosystem simplifying doctor scheduling, verified credential setups, and dynamic clinical consultations.',
    keywords: ['Healthcare', 'Doctor Appointment', 'MediCare Connect', 'Medical Scheduling', 'Doctor Portal'],
};

export default function AboutUsPage() {
    return (
        <div className="bg-slate-50 min-h-screen text-slate-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-linear-to-r from-blue-700 to-blue-900 py-20 px-6 text-center text-white shadow-md">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <span className="bg-blue-600/30 text-blue-200 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border border-blue-500/20">
                        About MediCare Connect
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black mt-4 tracking-tight">
                        Bridging the Gap Between <span className="text-blue-300">Doctors</span> & Patients
                    </h1>
                    <p className="mt-6 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
                        MediCare Connect is a modern healthcare management ecosystem crafted to simplify doctor scheduling, digital prescriptions, and clinical consultations.
                    </p>
                </div>
            </div>

            {/* Core Statistics / Value Props */}
            <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">10,000+</h4>
                            <p className="text-xs text-slate-500 font-medium">Happy Patients Served</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">500+</h4>
                            <p className="text-xs text-slate-500 font-medium">Verified Specialist Doctors</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900">24/7</h4>
                            <p className="text-xs text-slate-500 font-medium">Seamless Appointment Setup</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Our Core Vision</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Revolutionizing Healthcare Logistics</h2>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                        We believe that getting medical consultation shouldn&apos;t be trapped behind endless phone call loops and complex clinic waiting lines. MediCare Connect gives doctors automated management dynamic controls while offering patients a fluid experience.
                    </p>
                    <ul className="mt-6 space-y-3">
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <span>Transparent doctor credentials and verified ratings setup.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <span>Flexible hourly schedule slot distribution engine.</span>
                        </li>
                    </ul>
                </div>
                <div className="bg-linear-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-inner">
                    <Award className="absolute -right-6 -bottom-6 h-40 w-40 text-white/5 pointer-events-none" />
                    <HeartHandshake className="h-10 w-10 text-blue-200 mb-4" />
                    <h3 className="text-xl font-bold">Why Doctors & Clinics Trust Us</h3>
                    <p className="mt-3 text-sm text-blue-100 leading-relaxed">
                        From managing credentials to setting up weekly clinical workflows, our smart multi-role portal handles the heavy lifting, letting healthcare providers focus strictly on saving lives.
                    </p>
                </div>
            </div>
        </div>
    );
}