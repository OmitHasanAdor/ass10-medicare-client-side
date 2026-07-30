import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../auth";

export const getUserSession = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user || null;
};

export async function requireRole(requiredRole) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // No session → go to signin
    if (!session?.user?.email) {
        redirect("/auth/signin");   // ← এটা ঠিক করো
    }

    let userData = null;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/user-role?email=${session.user.email}`,
            { cache: "no-store", next: { revalidate: 0 } }
        );

        if (!response.ok) {
            console.error("Role fetch failed:", response.status);
            redirect("/unauthorized");
        }

        userData = await response.json();

    } catch (error) {
        console.error("Role Verification Error:", error);
        redirect("/unauthorized");
    }

    // Role validation (case insensitive করা ভালো)
    const userRole = (userData.role || "").toLowerCase();
    const required = requiredRole.toLowerCase();

    if (userRole !== required) {
        console.warn(`Access Denied. Required: ${required}, Found: ${userRole}`);
        redirect("/unauthorized");
    }

    return userData;
}