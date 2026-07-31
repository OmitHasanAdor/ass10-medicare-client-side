import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "../auth";

/**
 * Retrieves the current authenticated user profile from the session.
 * @returns {Promise<object|null>} The user object or null if unauthenticated.
 */
export const getUserSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers() 
    });

    return session?.user || null;
};

/**
 * Retrieves the current authenticated session token.
 * @returns {Promise<string|null>} The session token or null if unauthenticated.
 */
export const getUserToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return session?.session?.token || null;
};

/**
 * Route Guard helper to enforce specific roles on Server Components/Routes.
 * @param {string} requiredRole - The role expected to access the route (e.g., "patient", "doctor", "admin")
 * @returns {Promise<object>} Returns user data if verification passes, otherwise triggers redirect.
 */
export async function requireRole(requiredRole) {
    // 1. Fetch current session from Better Auth
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // If no session exists, redirect immediately to sign-in page
    if (!session?.user?.email) {
        redirect("/auth/signin"); 
    }

    let userData = null;
    let isFetchError = false;

    try {
        // 2. Query user role from Express backend (or direct DB query)
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user-role?email=${session.user.email}`, {
            cache: "no-store"
        });

        if (!response.ok) {
            isFetchError = true;
        } else {
            userData = await response.json();
        }
    } catch (error) {
        console.error("Role Verification Network Error:", error);
        isFetchError = true;
    }

    // 3. Handle redirects outside the try...catch block to avoid intercepting NEXT_REDIRECT errors
    if (isFetchError || !userData) {
        redirect("/unauthorized");
    }

    // 4. Validate role requirements
    if (userData?.role !== requiredRole) {
        console.warn(`Access Denied. Required: ${requiredRole}, Found: ${userData?.role}`);
        console.log("User Data:", userData , requiredRole);
        redirect("/unauthorized"); 
    }

    // Return user data if verification passes for use in layouts or pages
    return userData;
}