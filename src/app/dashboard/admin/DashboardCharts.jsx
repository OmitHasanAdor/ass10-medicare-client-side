// src/app/dashboard/admin/DashboardCharts.jsx
"use client";

import { Card } from "@heroui/react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend 
} from "recharts";

const COLORS = ["#10B981", "#8B5CF6", "#3B82F6", "#EF4444", "#F59E0B", "#EC4899"];

export default function DashboardCharts({ barChartData, lineChartData, pieChartData }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* ১. ডক্টর রেটিং বার চার্ট */}
                <Card className="p-5 border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Clinician Performance Index (Ratings)</h4>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                                <Tooltip />
                                <Bar dataKey="rating" fill="#10B981" radius={[4, 4, 0, 0]} barSize={35} name="Score Rating" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* ২. এ্যাপয়েন্টমেন্ট টাইমলাইন লাইন চার্ট */}
                <Card className="p-5 border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                    <div className="mb-4">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Appointment Timeline (Last 7 Days)</h4>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                                <YAxis tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                                <Tooltip />
                                <Line type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} name="Bookings" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* ৩. স্পেশালাইজেশন ডোনাট পাই চার্ট */}
            <Card className="p-6 border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                <div className="mb-2">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Ecosystem Specialty Breakdown</h4>
                </div>
                <div className="h-72 w-full flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                            >
                                {pieChartData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} Doctors`, 'Count']} />
                            <Legend verticalAlign="bottom" height={36} iconType="rect" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}