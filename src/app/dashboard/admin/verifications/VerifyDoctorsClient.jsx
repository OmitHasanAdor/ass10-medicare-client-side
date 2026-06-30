"use client";

import { useState } from "react";
import { Card } from "@heroui/react";
import { CheckCircle2, XCircle, GraduationCap, Building2, Milestone, Stethoscope } from "lucide-react";
import Image from "next/image";

export default function VerifyDoctorsClient({ initialDoctors }) {
    const [doctors, setDoctors] = useState(initialDoctors);

    // স্ট্যাটাস আপডেট করার হ্যান্ডলার (Verify, Cancel, Reject)
    const handleUpdateStatus = async (doctorId, newStatus) => {
        const confirmMsg = `Are you sure you want to change status to ${newStatus}?`;
        if (!confirm(confirmMsg)) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctors/${doctorId}/verify`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verificationStatus: newStatus })
            });

            if (response.ok) {
                setDoctors((prev) =>
                    prev.map((doc) =>
                        (doc._id?.$oid || doc._id) === doctorId
                            ? { ...doc, verificationStatus: newStatus }
                            : doc
                    )
                );
            }
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    if (doctors.length === 0) {
        return (
            <div className="text-center col-span-full py-16 bg-white border border-dashed rounded-2xl p-8 text-gray-400">
                <Stethoscope className="size-12 mx-auto mb-3 opacity-30 text-blue-600" />
                <p className="text-sm font-medium">No practitioner accounts found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor) => {
                const id = doctor._id?.$oid || doctor._id;
                const status = doctor.verificationStatus || "Pending";

                return (
                    <Card
                        key={id}
                        className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl hover:border-blue-500/30 transition-all duration-300"
                    >
                        {/* 🏷️ কার্ড হেডার: প্রোফাইল ইমেজ, নাম ও ডেজিগনেশন */}
                        <Card.Header className="p-5 pb-3 flex flex-row items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={doctor.profileImage || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"}
                                    alt={doctor.doctorName}
                                    className="size-14 rounded-xl object-cover border-2 border-blue-600/10 shrink-0"
                                    width={100}
                                    height={100}
                                />
                                <div>
                                    <Card.Title className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                                        {doctor.doctorName}
                                    </Card.Title>
                                    <Card.Description className="text-xs text-zinc-400 mt-0.5">
                                        {doctor.email}
                                    </Card.Description>
                                </div>
                            </div>

                            <div className="text-right shrink-0">
                                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                                    {doctor.specialization}
                                </span>
                                <p className="text-[11px] text-zinc-400 mt-1 flex items-center justify-end gap-1">
                                    <Building2 className="size-3 text-zinc-400" /> {doctor.hospitalName}
                                </p>
                            </div>
                        </Card.Header>

                        {/* 📊 কার্ড কন্টেন্ট: ক্রেডেনশিয়াল ও ডিটেইলস গ্রিড */}
                        <Card.Content className="px-5 py-0">
                            <div className="grid grid-cols-3 gap-2 bg-zinc-50/70 dark:bg-zinc-950 p-3 rounded-xl border text-xs">
                                <div className="space-y-0.5">
                                    <span className="text-zinc-400 text-[10px] uppercase font-bold flex items-center gap-1">
                                        <GraduationCap className="size-3.5 text-blue-600" /> Degree
                                    </span>
                                    <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{doctor.qualifications}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-zinc-400 text-[10px] uppercase font-bold flex items-center gap-1">
                                        <Milestone className="size-3.5 text-blue-600" /> Experience
                                    </span>
                                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{doctor.experience} Yrs</p>
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-zinc-400 text-[10px] uppercase font-bold flex items-center gap-1">
                                        <span className="font-extrabold text-blue-600">$</span> Charge
                                    </span>
                                    <p className="font-extrabold text-blue-600">${doctor.consultationFee}</p>
                                </div>
                            </div>
                        </Card.Content>

                        {/* ⚙️ কার্ড ফুটার: স্ট্যাটাস এবং অ্যাকশন বাটনসমূহ */}
                        <Card.Footer className="p-5 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[9px] uppercase font-black text-zinc-400 tracking-wider">Verification Status</span>
                                <span className={`w-max px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${status === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                            "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}>
                                    {status}
                                </span>
                            </div>

                            {/* অ্যাকশন বাটন গ্রুপ */}
                            <div className="flex gap-2">
                                {status !== "Verified" ? (
                                    <button
                                        onClick={() => handleUpdateStatus(id, "Verified")}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shadow-sm"
                                    >
                                        <CheckCircle2 className="size-3.5" /> Approve
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUpdateStatus(id, "Pending")}
                                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl text-xs font-semibold transition"
                                    >
                                        Cancel Verify
                                    </button>
                                )}

                                {status !== "Rejected" && (
                                    <button
                                        onClick={() => handleUpdateStatus(id, "Rejected")}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold transition"
                                    >
                                        <XCircle className="size-3.5" /> Reject
                                    </button>
                                )}
                            </div>
                        </Card.Footer>
                    </Card>
                );
            })}
        </div>
    );
}