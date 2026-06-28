import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() // some endpoints might require headers
    })

    return session?.user || null;
}

export const getUserToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return session?.session?.token || null;
}
//  @param {string} requiredRole
export async function requireRole(requiredRole) {
    // ১. Better Auth থেকে কারেন্ট সেশনটি নেওয়া
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // সেশন না থাকলে সরাসরি লগইন পেজে রিডাইরেক্ট করবে
    if (!session?.user?.email) {
        redirect("/signin"); // আপনার লগইন পেজের রুট দিন
    }

    try {
        // ২. এক্সপ্রেস ব্যাকএন্ড থেকে এই ইউজারের রোল কুয়েরি করা 
        // (অথবা সরাসরি মঙ্গোডিবি ড্রাইভারে usersCollection থেকেও চেক করতে পারেন)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user-role?email=${session.user.email}`, {
            cache: "no-store"
        });

        if (!response.ok) {
            redirect("/unauthorized");
        }

        const userData = await response.json();

        // ৩. রোল কন্ডিশন চেক করা
        if (userData?.role !== requiredRole) {
            // যদি রোল ম্যাচ না করে (যেমন পেশেন্ট যদি ডক্টর ড্যাশবোর্ডে ঢোকার চেষ্টা করে)
            redirect("/unauthorized"); // একটি কাস্টম নট-অ্যালউড পেজে রিডাইরেক্ট
        }

        // রোল মিলে গেলে অবজেক্টটি রিটার্ন করবে (ভবিষ্যতে আইডি বা ডাটা লাগলে লেআউটে পাবেন)
        return userData;

    } catch (error) {
        console.error("Role Verification Error:", error);
        redirect("/unauthorized");
    }
}