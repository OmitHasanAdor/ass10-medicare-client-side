import React from "react";
import { Star } from "lucide-react";

// ডাটা ফেচিং ফাংশন
async function getHomeData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/public/home-analytics`, {
            next: { revalidate: 60 } // প্রতি ১ মিনিটে ডাটা ব্যাকগ্রাউন্ডে রিফ্রেশ হবে
        });
        if (!res.ok) throw new Error("Failed to fetch home analytics");
        return await res.json();
    } catch (error) {
        console.error("Error loading home analytics:", error);
        return {
            stats: { totalDoctors: 0, totalPatients: 0, totalAppointments: 0, totalReviews: 0 },
            successStories: []
        };
    }
}

export default async function PlatformAnalytics() {
    const { stats, successStories } = await getHomeData();

    // স্ট্যাটস কার্ডের লেআউট অ্যারে
    const statCards = [
        { label: "Total Doctors", value: `${stats.totalDoctors}+`, bg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100" },
        { label: "Patient Trust", value: `${stats.totalPatients}+`, bg: "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 border border-zinc-200/60 dark:border-zinc-800" },
        { label: "Appointments Joined", value: `${stats.totalAppointments}+`, bg: "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 border border-zinc-200/60 dark:border-zinc-800" },
        { label: "Expert Reviews", value: `${stats.totalReviews}+`, bg: "bg-emerald-600 text-white" }
    ];

    return (
        <section className="py-16 px-6 max-w-7xl mx-auto space-y-16">
            
            {/* ১. Platform Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((card, idx) => (
                    <div 
                        key={idx} 
                        className={`flex flex-col items-center justify-center p-6 rounded-3xl text-center shadow-[0_2px_10px_rgba(0,0,0,0.01)] ${card.bg}`}
                    >
                        <p className="text-xs font-semibold opacity-70 tracking-wide mb-1">
                            {card.label}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                            {card.value}
                        </h3>
                    </div>
                ))}
            </div>

            {/* ২. Patient Success Stories Section */}
            <div className="space-y-10">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Real Patient Success Stories
                    </h2>
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xl mx-auto font-medium">
                        Read notes and testimonials regarding bedside care and diagnostics accuracy from our patient reviews database.
                    </p>
                </div>

                {/* রিভিউ কার্ড গ্রিড */}
                {successStories.length === 0 ? (
                    <p className="text-center text-zinc-400 text-sm">No reviews found yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {successStories.map((story) => (
                            <div 
                                key={story._id}
                                className="flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                {/* রিভিউ টেক্সট */}
                                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed italic">
                                    &quot;{story.reviewText}&quot;
                                </p>

                                {/* ফুটার (নাম ও রেটিং স্টার্স) */}
                                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                                            {story.patientName}
                                        </h4>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                            Consulted Patient
                                        </p>
                                    </div>
                                    
                                    {/* ৫ স্টার রেটিং জেনারেটর */}
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, index) => (
                                            <Star 
                                                key={index} 
                                                size={13} 
                                                className={index < story.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-700"} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </section>
    );
}