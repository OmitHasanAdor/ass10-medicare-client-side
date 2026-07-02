import React from "react";
import { Heart, Brain, Clock, Users, ShieldCheck } from "lucide-react";

// Specialization data array (Mapped precisely from the layout design)
const specializations = [
    {
        id: 1,
        title: "Cardiology",
        hospital: "BOSTON GENERAL",
        icon: Heart,
    },
    {
        id: 2,
        title: "Neurology",
        hospital: "JOHNS HOPKINS",
        icon: Brain,
    },
    {
        id: 3,
        title: "Orthopedics",
        hospital: "MAYO CLINIC",
        icon: Clock, // Clock icon assigned per screenshot reference constraints
    },
    {
        id: 4,
        title: "Pediatrics",
        hospital: "STANFORD KID CARE",
        icon: Users,
    },
    {
        id: 5,
        title: "Dermatology",
        hospital: "YALE SCHOOL",
        icon: ShieldCheck,
    },
];

export default function MedicalSpecializations() {
    return (
        <section className="py-12 px-6 max-w-7xl mx-auto space-y-10 bg-zinc-50/30 dark:bg-zinc-950/10 rounded-3xl">
            
            {/* 1. Header Section (Title & Subtitle) */}
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Our Medical Specializations
                </h2>
                <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
                    Access primary, pediatric, neural, and dermatological healthcare resources with validated physician consultants.
                </p>
            </div>

            {/* 2. Specialization Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5">
                {specializations.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div
                            key={item.id}
                            className="flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300 cursor-pointer group"
                        >
                            {/* Light colored icon wrapper badge */}
                            <div className="p-3 bg-blue-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                                <IconComponent size={22} strokeWidth={2.2} />
                            </div>

                            {/* Specialization Title */}
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                {item.title}
                            </h3>

                            {/* Hospital Subtitle */}
                            <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">
                                {item.hospital}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}