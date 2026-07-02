// src/app/dashboard/admin/page.jsx

import DashboardCharts from "./DashboardCharts";
import DashboardStats from "./DashboardStats";



export const dynamic = "force-dynamic";

export const metadata = {
    title: "Ecosystem Analytics | MediCare Connect",
    description: "Monitor platform performance, healthcare activities, user growth, and operational insights from the admin dashboard.",
    keywords: ["Admin Dashboard", "Healthcare Analytics", "Platform Statistics", "MediCare Connect"],
};

// Server-side data fetching function
async function getAnalyticsData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/analytics`, {
            cache: "no-store", // Caching is disabled for real-time data
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
            {/* 1. Stats Cards (Can be rendered directly on the server side) */}
            <DashboardStats stats={data.stats} />

            {/* 2. Charts Component (Passed as a client component since Recharts is a client-side library) */}
            <DashboardCharts 
                barChartData={data.barChartData} 
                lineChartData={data.lineChartData} 
                pieChartData={data.pieChartData} 
            />
        </div>
    );
}