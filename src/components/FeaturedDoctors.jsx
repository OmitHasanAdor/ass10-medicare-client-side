import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Stethoscope, Award, DollarSign, ArrowRight } from "lucide-react";

// সার্ভার সাইড ডাটা ফেচিং (শুধুমাত্র Verified ডাক্তারদের ফিল্টার করার জন্য)
async function getFeaturedDoctors() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors?status=verified`, {
            next: { revalidate: 3600 } // ISR ক্যাশিং (১ ঘণ্টা পর পর নতুন ডাটা চেক করবে)
        });

        if (!res.ok) throw new Error("Failed to fetch featured doctors");
        const data = await res.json();
        
        // হোমপেজের গ্রিড সুন্দর রাখার জন্য প্রথম ৪ জন ভেরিফাইড ডক্টর রিটার্ন করবে
        return data.slice(0, 4);
    } catch (error) {
        console.error("Error loading featured doctors:", error);
        return [];
    }
}

export default async function FeaturedDoctors() {
    const doctors = await getFeaturedDoctors();

    if (doctors.length === 0) return null;

    return (
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-10">
            
            {/* হেডার সেকশন */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Meet Our Featured Doctors
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
                        Empathetic bedside manners paired with outstanding academic qualifications and verified expertise.
                    </p>
                </div>
                
                <Link 
                    href="/find-doctors" 
                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity border-b-2 border-zinc-900 dark:border-zinc-100 pb-0.5 w-fit"
                >
                    View All Doctors <ArrowRight size={16} />
                </Link>
            </div>

            {/* ডক্টর কার্ড গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {doctors.map((doctor) => (
                    <div 
                        key={doctor._id}
                        className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        {/* ১. ডক্টর ইমেজ এবং স্পেশালাইজেশন ব্যাজ */}
                        <div className="relative h-64 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <Image
                                src={doctor.profileImage || "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp"}
                                alt={doctor.doctorName}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 bg-zinc-900/90 dark:bg-zinc-50/90 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 text-white dark:text-zinc-900 rounded-lg backdrop-blur-sm">
                                <Stethoscope size={10} /> {doctor.specialization}
                            </span>
                        </div>

                        {/* ২. ডক্টর ইনফরমেশন */}
                        <div className="p-5 flex flex-col grow justify-between space-y-4">
                            <div className="space-y-1.5">
                                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {doctor.doctorName}
                                </h3>
                                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium line-clamp-1">
                                    {doctor.qualifications} — {doctor.hospitalName}
                                </p>
                            </div>

                            {/* ৩. এক্সপেরিয়েন্স, ফি এবং প্রোফাইল লিংক */}
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                    <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 font-medium">
                                        <Award size={14} className="text-zinc-400" /> {doctor.experience} Years Exp
                                    </span>
                                    <span className="flex items-center text-zinc-900 dark:text-zinc-50 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-xl border border-zinc-200/40 dark:border-zinc-700/30">
                                        <DollarSign size={13} className="text-blue-600 dark:text-blue-400 -mr-0.5" />
                                        {doctor.consultationFee} Co-Pay
                                    </span>
                                </div>

                                {/* ডাইনামিক রাউটিং বাটন */}
                                <Link 
                                    href={`/find-doctors/${doctor._id}`}
                                    className="w-full text-center bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity mt-1 block"
                                >
                                    Book Appointment
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}