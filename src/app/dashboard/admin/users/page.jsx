import ManageUsersClient from "./ManageUsersClient";

// ১. সার্ভার সাইড ডাটা ফেচিং ফাংশন
async function getUsers() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
            cache: "no-store", // লাইভ ডাটার জন্য ক্যাশিং বন্ধ রাখা হলো
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
            {/* হেডার সেকশন (সার্ভার রেন্ডারড) */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Registered System Accounts
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Hospital Ecosystem Controls & Account Moderation (Server Driven)
                </p>
            </div>

            {/* ইন্টারেক্টিভ পার্ট পাস করা হচ্ছে ক্লায়েন্ট কন্টেইনারে */}
            <ManageUsersClient initialUsers={initialUsers} />
        </div>
    );
}