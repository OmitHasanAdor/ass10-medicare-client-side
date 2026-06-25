import { jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    // baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL?.trim() || "http://localhost:3000",
    // plugins: [
    //     jwtClient()
    // ]
})
// console.log("Auth client initialized with base URL:", authClient.baseURL);
// console.log("Auth client initialized with base URL:", process.env.NEXT_PUBLIC_BETTER_AUTH_URL);

export const { signIn, signUp, signOut, useSession } = createAuthClient()