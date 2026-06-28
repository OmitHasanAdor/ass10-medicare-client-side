// 📂 src/app/dashboard/doctor/consultations/ConsultationsClient.jsx
"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, CheckCircle2, XCircle, FileText, RefreshCw, AlertCircle } from 'lucide-react';

export default function ConsultationsClient({ initialAppointments, doctorEmail }) {
    const [appointments, setAppointments] = useState(initialAppointments || []);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const router = useRouter();

    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        setActionLoadingId(appointmentId);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/appointments/${appointmentId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                // ১. লোকাল স্টেট সাথে সাথে আপডেট করছি
                setAppointments(prev => 
                    prev.map(app => app._id === appointmentId ? { ...app, appointmentStatus: newStatus } : app)
                );

                if (newStatus === 'completed') {
                    toast.success("Marked as completed! Opening prescription desk...");
                    
                    // ২. ডক্টরকে সরাসরি প্রেসক্রিপশন পেজে রিডাইরেক্ট করা হচ্ছে আইডি সহ
                    setTimeout(() => {
                        router.push(`/dashboard/doctor/prescription?appointmentId=${appointmentId}`);
                    }, 800);
                } else {
                    toast.success(`Appointment successfully ${newStatus}!`);
                    router.refresh(); 
                }
            } else {
                toast.error(data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network connection failure with server.");
        } finally {
            setActionLoadingId(null);
        }
    };

    if (appointments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                <AlertCircle className="h-10 w-10 text-slate-400 mb-3" />
                <h3 className="text-sm font-semibold text-slate-700">No appointments found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">You currently don&apos;t have any clinical bookings listed in your inbox.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-5xl">
            {appointments.map((appointment) => {
                const isPending = appointment.appointmentStatus === 'pending';
                const isConfirmed = appointment.appointmentStatus === 'confirmed';
                const isCompleted = appointment.appointmentStatus === 'completed';
                const isCancelled = appointment.appointmentStatus === 'cancelled';
                const isLoading = actionLoadingId === appointment._id;

                const patientName = appointment.patientInfo?.name || "Anonymous Patient";

                return (
                    <div 
                        key={appointment._id}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md/50 transition-all duration-200"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            
                            {/* 👤 PATIENT & INFO SECTION */}
                            <div className="space-y-2.5 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-slate-800 text-base">{patientName}</h3>
                                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider border border-slate-200">
                                        {appointment.paymentStatus || "PAID"}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                        <span>{appointment.appointmentDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-emerald-500" />
                                        <span>{appointment.appointmentTime}</span>
                                    </div>
                                </div>

                                {/* 🩺 SYMPTOMS BOX */}
                                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 max-w-3xl">
                                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Symptom Presentation:</p>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        {appointment.symptoms || "No clinical notes specified by the patient."}
                                    </p>
                                </div>
                            </div>

                            {/* ⚙️ ACTION CONTROL & STATUS BADGE */}
                            <div className="flex flex-row md:flex-col items-center justify-end gap-3 min-w-40">
                                
                                {isLoading ? (
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" /> Processing...
                                    </div>
                                ) : (
                                    <>
                                        {/* PENDING: ACCEPT / REJECT BUTTONS */}
                                        {isPending && (
                                            <div className="flex items-center gap-2 w-full md:justify-end">
                                                <button
                                                    onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                                                >
                                                    Accept Link
                                                </button>
                                                <button
                                                    onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                                                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:border-red-100 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {/* CONFIRMED: COMPLETE & PRESCRIBE BUTTON */}
                                        {isConfirmed && (
                                            <button
                                                onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition w-full md:w-auto"
                                            >
                                                <FileText className="h-3.5 w-3.5" /> Mark Completed
                                            </button>
                                        )}

                                        {/* 💡 FINAL STATUS BADGES (ইনস্পায়ার্ড ডিজাইন আপডেট) */}
                                        {isCompleted && (
                                            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                <CheckCircle2 className="h-3.5 w-3.5" /> COMPLETED & PRESCRIBED
                                            </div>
                                        )}

                                        {isCancelled && (
                                            <div className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 border border-red-200">
                                                <XCircle className="h-3.5 w-3.5" /> CANCELLED
                                            </div>
                                        )}

                                        {/* MINI STATE TRACKER FOR LOGS */}
                                        {isPending && (
                                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5 tracking-wider uppercase">
                                                Pending Request
                                            </span>
                                        )}
                                        {isConfirmed && (
                                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-0.5 tracking-wider uppercase">
                                                Confirmed Session
                                            </span>
                                        )}
                                    </>
                                )}

                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}