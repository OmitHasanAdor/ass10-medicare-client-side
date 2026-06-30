// src/app/dashboard/admin/DashboardStats.jsx

import { Card } from "@heroui/react";
import { Stethoscope, Users, CalendarDays, DollarSign } from "lucide-react";

export default function DashboardStats({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={12} /> Total Patients
                </p>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-1">{stats?.totalPatients || 0}</h3>
            </Card>

            <Card className="p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Stethoscope size={12} /> Verified Clinicians
                </p>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-1">{stats?.verifiedClinicians || 0}</h3>
            </Card>

            <Card className="p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarDays size={12} /> All Bookings
                </p>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 mt-1">{stats?.allBookings || 0}</h3>
            </Card>

            <Card className="p-5 border border-zinc-200/80 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign size={12} /> Gross Co-pays
                </p>
                <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-500 mt-1">${stats?.grossCopays || 0}</h3>
            </Card>
        </div>
    );
}