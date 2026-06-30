"use client";

import { useState } from "react";
import { Search, UserMinus, Trash2, Shield, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function ManageUsersClient({ initialUsers }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchQuery, setSearchQuery] = useState("");

    // ইউজার সাসপেন্ড হ্যান্ডলার
    const handleSuspendUser = async (userId) => {
        if (!confirm("Are you sure you want to suspend this user?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/suspend`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                setUsers((prev) =>
                    prev.map((u) => (u._id?.$oid || u._id) === userId ? { ...u, status: "suspended" } : u)
                );
            }
        } catch (error) {
            console.error("Error suspending user:", error);
        }
    };

    // ইউজার ডিলিট হ্যান্ডলার
    const handleDeleteUser = async (userId) => {
        if (!confirm("Permanently delete this user?")) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setUsers((prev) => prev.filter((u) => (u._id?.$oid || u._id) !== userId));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* 🔍 সার্চ বার ফিল্টার */}
            <div className="flex justify-end">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search accounts name/email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                    />
                </div>
            </div>

            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">

                {/* 🖥️ ডেস্কটপ ও ট্যাবলেট ভিউ (HTML Table Layout) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/70 border-b text-gray-400 font-bold text-[11px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Registered User</th>
                                <th className="px-6 py-4 font-semibold">System Role</th>
                                <th className="px-6 py-4 font-semibold">Account Email</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm text-gray-700">
                            {filteredUsers.map((user) => {
                                const id = user._id?.$oid || user._id;
                                const isSuspended = user.status === "suspended";

                                return (
                                    <tr key={id} className="hover:bg-zinc-50/30 transition-colors">
                                        {/* ইউজার প্রোফাইল */}
                                        <td className="px-6 py-4.5">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={user.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                                    alt={user.name}
                                                    className="size-9 rounded-xl object-cover border"
                                                    width={100}
                                                    height={100}
                                                />
                                                <span className="font-bold text-gray-800">{user.name}</span>
                                            </div>
                                        </td>

                                        {/* রোল ব্যাজ (Royal Blue Tint for Admin) */}
                                        <td className="px-6 py-4.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${user.role === "admin" ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                    user.role === "doctor" ? "bg-purple-50 text-purple-700 border-purple-100" :
                                                        "bg-zinc-100 text-zinc-700 border-zinc-200"
                                                }`}>
                                                <Shield className="size-2.5" /> {user.role}
                                            </span>
                                        </td>

                                        {/* ইমেইল */}
                                        <td className="px-6 py-4.5 text-gray-500 font-medium">
                                            {user.email}
                                        </td>

                                        {/* স্ট্যাটাস ব্যাজ */}
                                        <td className="px-6 py-4.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${isSuspended ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                }`}>
                                                <span className={`size-1.5 rounded-full ${isSuspended ? "bg-rose-600" : "bg-emerald-600"}`} />
                                                {user.status}
                                            </span>
                                        </td>

                                        {/* অ্যাকশন বাটন গ্রুপ */}
                                        <td className="px-6 py-4.5 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    disabled={isSuspended}
                                                    onClick={() => handleSuspendUser(id)}
                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${isSuspended
                                                            ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                                                            : "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                                                        }`}
                                                >
                                                    <UserMinus className="size-3.5" />
                                                    {isSuspended ? "Suspended" : "Suspend"}
                                                </button>

                                                <button
                                                    disabled={isSuspended}
                                                    onClick={() => handleDeleteUser(id)}
                                                    title="Delete User"
                                                    className={`p-1.5 rounded-xl transition ${isSuspended
                                                            ? "text-zinc-300 cursor-not-allowed"
                                                            : "text-gray-400 hover:text-rose-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 📱 মোবাইল ভিউ (কার্ড লিস্ট) */}
                <div className="block md:hidden divide-y">
                    {filteredUsers.map((user) => {
                        const id = user._id?.$oid || user._id;
                        const isSuspended = user.status === "suspended";

                        return (
                            <div key={id} className="p-4 space-y-3 bg-white hover:bg-zinc-50/30 transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={user.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                            alt={user.name}
                                            className="size-10 rounded-xl object-cover border"
                                            width={100}
                                            height={100}
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-base">{user.name}</h4>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${user.role === "admin" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-zinc-100 text-zinc-700 border-zinc-200"
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center bg-zinc-50 p-2.5 rounded-xl border text-xs">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">Account Status</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${isSuspended ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>

                                {/* মোবাইল অ্যাকশন বাটনসমূহ */}
                                <div className="flex gap-2 pt-1">
                                    <button
                                        disabled={isSuspended}
                                        onClick={() => handleSuspendUser(id)}
                                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition ${isSuspended
                                                ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                                                : "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                                            }`}
                                    >
                                        <UserMinus className="size-3.5" /> {isSuspended ? "Suspended" : "Suspend"}
                                    </button>
                                    <button
                                        disabled={isSuspended}
                                        onClick={() => handleDeleteUser(id)}
                                        className={`px-3 py-2 rounded-xl border transition ${isSuspended
                                                ? "bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed"
                                                : "border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                                            }`}
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
            {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">No accounts found matches search criteria.</div>
            )}
        </div>
    );
}