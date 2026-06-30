// src/app/dashboard/admin/page.jsx

import DashboardStats from "./DashboardStats";
import DashboardCharts from "./DashboardCharts";

// সার্ভার সাইড ডেটা ফেচিং ফাংশন
async function getAnalyticsData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/analytics`, {
            cache: "no-store", // রিয়েল-টাইম ডেটার জন্য ক্যাশিং অফ রাখা হলো
        });
        
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
    } catch (error) {
        console.error("Error loading admin dashboard data:", error);
        return null;
    }
}

export default async function AdminDashboardPage() {
    const data = await getAnalyticsData();

    if (!data) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center text-red-500 font-medium">
                Failed to load ecosystem metrics. Please try again later.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 bg-zinc-50/50 dark:bg-zinc-950 min-h-screen">
            {/* ১. স্ট্যাটস কার্ডস (সার্ভার সাইডেই রেন্ডার হতে পারবে) */}
            <DashboardStats stats={data.stats} />

            {/* ২. চার্টস কম্পোনেন্ট (Recharts ক্লায়েন্ট সাইড লাইব্রেরি হওয়ায় এটি ক্লায়েন্ট কম্পোনেন্ট হিসেবে যাবে) */}
            <DashboardCharts 
                barChartData={data.barChartData} 
                lineChartData={data.lineChartData} 
                pieChartData={data.pieChartData} 
            />
        </div>
    );
}