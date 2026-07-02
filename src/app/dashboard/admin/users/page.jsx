import ManageUsersClient from "./ManageUsersClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Manage Users | MediCare Connect",
    description: "View, manage, and oversee patient, doctor, and administrator accounts across the healthcare platform.",
    keywords: ["Manage Users", "Patient Management", "Doctor Management", "Admin Panel"],
};

// 1. Server-side data fetching function
async function getUsers() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
            cache: "no-store", // Caching is disabled for live data
        });
        
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Error fetching users on server:", error);
        return [];
    }
}

export default async function ManageUsersPage() {
    const initialUsers = await getUsers();

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header section (Server Rendered) */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Registered System Accounts
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Hospital Ecosystem Controls & Account Moderation (Server Driven)
                </p>
            </div>

            {/* Passing the interactive part to the client container */}
            <ManageUsersClient initialUsers={initialUsers} />
        </div>
    );
}