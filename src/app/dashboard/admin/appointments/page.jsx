import React from "react";
import { Card } from "@heroui/react";
import { Calendar, Clock, Activity } from "lucide-react";
import AppointmentTable from "./AppointmentTable"; 


export const dynamic = "force-dynamic";
async function getAppointments() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/appointments`, {
            cache: "no-store",
        });
        if (!response.ok) throw new Error("Failed to fetch appointments");
        return await response.json();
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
}

export default async function ClinicalAppointmentsPage() {
    const appointments = await getAppointments();

    return (
        <div className="space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
            {/* হেডার সেকশন */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Clinical Appointments</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                    Monitor and view all patient-doctor appointments across the ecosystem.
                </p>
            </div>

            {/* ওভারভিউ কাউন্টার কার্ডস */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card shadow="sm" className="p-4 flex flex-row items-center gap-4 bg-background border border-default-100">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary shrink-0">
                        <Activity className="size-5 md:size-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Bookings</p>
                        <h4 className="text-lg md:text-xl font-bold mt-0.5">{appointments.length}</h4>
                    </div>
                </Card>
                
                <Card shadow="sm" className="p-4 flex flex-row items-center gap-4 bg-background border border-default-100">
                    <div className="rounded-xl bg-warning/10 p-3 text-warning shrink-0">
                        <Clock className="size-5 md:size-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Pending</p>
                        <h4 className="text-lg md:text-xl font-bold mt-0.5">
                            {appointments.filter((a) => a.appointmentStatus === "pending").length}
                        </h4>
                    </div>
                </Card>

                <Card shadow="sm" className="p-4 flex flex-row items-center gap-4 bg-background border border-default-100">
                    <div className="rounded-xl bg-success/10 p-3 text-success shrink-0">
                        <Calendar className="size-5 md:size-6" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Completed</p>
                        <h4 className="text-lg md:text-xl font-bold mt-0.5">
                            {appointments.filter((a) => a.appointmentStatus === "completed").length}
                        </h4>
                    </div>
                </Card>
            </div>

            {/* অ্যাপয়েন্টমেন্ট ডাটা টেবিল (HeroUI v3 Container layout) */}
            <div className="w-full rounded-2xl border border-default-100 bg-background overflow-hidden p-2">
                <AppointmentTable appointments={appointments} />
            </div>
        </div>
    );
}