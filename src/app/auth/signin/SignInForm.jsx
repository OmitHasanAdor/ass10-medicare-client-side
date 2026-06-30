"use client";

import { signIn, useSession } from "@/lib/auth-client"; // 🎯 useSession ইমপোর্ট করা হলো
import { useState, useEffect } from "react"; // 🎯 useEffect ইমপোর্ট করা হলো
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; 
import {
    Card,
    Button,
    Link,
    TextField,
    Label,
    InputGroup,
    Input,
} from "@heroui/react";
import {
    Eye,
    EyeSlash,
    At,
    ShieldKeyhole,
} from "@gravity-ui/icons";

export default function SignInForm({ redirectTo = "/" }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false); 
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();
    const { data: session } = useSession(); // 🎯 বর্তমান সেশন ডাটা ট্র্যাকিং
    const toggleVisibility = () => setIsVisible((prev) => !prev);

    const demoCredentials = {
        admin: { email: "admin@admin.com", password: "Shams@2.0" },
        doctor: { email: "doctor@doctor.com", password: "Shams@2.0" },
        patient: { email: "patient@patient.com", password: "Shams@2.0" }
    };

    const handleQuickFill = (roleType) => {
        const creds = demoCredentials[roleType];
        if (creds) {
            setEmail(creds.email);
            setPassword(creds.password);
        }
    };

    // 🎯 গুগল লগইন সাকসেস হলে ব্যাকএন্ডের সাথে ডাটা সিঙ্ক করার ইফেক্ট
    useEffect(() => {
        if (session?.user) {
            const syncGoogleUser = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/google-sync`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: session.user.name,
                            email: session.user.email,
                            photo: session.user.image,
                        })
                    });

                    if (response.ok) {
                        toast.success("Welcome! Securely connected with Google Profile 🎉", {
                            duration: 4000,
                        });
                        
                        // গুগল দিয়ে আসলে ডিফল্ট রোল 'patient' থাকে, তাই ড্যাশবোর্ডে রিডাইরেক্ট
                        router.push("/dashboard/patient");
                        router.refresh();
                    } else {
                        setError("Failed to sync profile with database.");
                        toast.error("Profile synchronization failed.");
                    }
                } catch (err) {
                    console.error("Sync error:", err);
                    setError("Database connection failed during sync.");
                } finally {
                    setIsGoogleLoading(false);
                }
            };
            syncGoogleUser();
        }
    }, [session, router]);

    // 🌐 Google Sign-In হ্যান্ডলার
    const handleGoogleSignIn = async () => {
        setError("");
        setIsGoogleLoading(true);
        try {
            await signIn.social({
                provider: "google",
                // 🎯 লগইন সাকসেস হলে এই পেজেই ব্যাক করবে যেন উপরের useEffect-টি রান করে ডাটা সিঙ্ক করতে পারে
                callbackURL: window.location.origin + "/auth/signin", 
                newUserOptions: {
                    data: {
                        role: "patient" 
                    }
                }
            });
            
            toast.success("Connecting with Google Secure Portal...");
        } catch (err) {
            console.error(err);
            setError("Google authentication failed.");
            toast.error("Google login failed.");
            setIsGoogleLoading(false);
        }
    };

    // 📧 Email Sign-In হ্যান্ডলার
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim() || !password) {
            setError("All fields are required.");
            toast.error("Please fill in all fields.");
            return;
        }

        setIsLoading(true);

        try {
            await signIn.email({
                email: email.trim(),
                password: password,
            }, {
                onSuccess: async () => {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user-role?email=${email.trim()}`);

                        if (!response.ok) {
                            setError("Failed to verify user profile setup.");
                            toast.error("Profile verification failed.");
                            setIsLoading(false);
                            return;
                        }

                        const userProfile = await response.json();
                        const realRole = userProfile?.role || "patient";

                        setSuccess(`Authorized successfully as ${realRole}!`);

                        toast.success(`Welcome back! Logged in as ${realRole.toUpperCase()}`, {
                            duration: 4000,
                            icon: "🎉",
                        });

                        const destination = realRole === "admin"
                            ? "/dashboard/admin"
                            : realRole === "doctor"
                                ? "/dashboard/doctor"
                                : "/dashboard/patient";

                        router.push(destination);
                        router.refresh();

                    } catch (fetchErr) {
                        console.error(fetchErr);
                        setError("Failed to fetch role permissions from server.");
                        toast.error("Failed to load user permissions.");
                        setIsLoading(false);
                    }
                },
                onError: (ctx) => {
                    setError(ctx.error.message || "Invalid credentials provided.");
                    toast.error(ctx.error.message || "Invalid email or password.");
                    setIsLoading(false);
                }
            });

        } catch (err) {
            console.error(err);
            setError("An unexpected network fault occurred.");
            toast.error("Network fault occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-10">
            <Card className="w-full max-w-md p-6 shadow-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

                <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                        Access Secure Portal
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Synchronize medical schedules, pay co-pays, and view profiles.
                    </p>
                </div>

                {/* 🌐 Google Sign-In Button Integration */}
                <div className="mb-4">
                    <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        isLoading={isGoogleLoading}
                        isDisabled={isLoading || isGoogleLoading}
                        className="w-full h-11 rounded-xl font-medium text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition flex items-center justify-center gap-2.5 shadow-sm"
                    >
                        {!isGoogleLoading && (
                            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        Continue with Google
                    </Button>
                </div>

                {/* Divider Line */}
                <div className="flex items-center my-4 text-xs text-zinc-400 dark:text-zinc-500">
                    <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
                    <span className="px-3 uppercase tracking-wider text-[10px] font-bold">Or secure credentials</span>
                    <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>

                <form onSubmit={handleSignIn} className="flex flex-col gap-5">

                    {/* Email */}
                    <TextField isRequired name="email" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Email Address
                        </Label>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 focus-within:border-blue-600 transition-colors">
                            <At className="text-zinc-400 pointer-events-none" size={16} />
                            <Input
                                type="email"
                                placeholder="amanda.ross@medicare.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Password */}
                    <TextField isRequired name="password" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Secure Passkey
                        </Label>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 focus-within:border-blue-600 transition-colors">
                            <ShieldKeyhole className="text-zinc-400 pointer-events-none" size={16} />
                            <Input
                                type={isVisible ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                            <button
                                type="button"
                                onClick={toggleVisibility}
                                className="focus:outline-none text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                                aria-label={isVisible ? "Hide password" : "Show password"}
                            >
                                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                            </button>
                        </InputGroup>
                    </TextField>

                    {error && (
                        <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                            <span className="font-semibold">Error:</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3.5 text-xs font-medium rounded-xl bg-blue-100/60 dark:bg-blue-950/50 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                            <span className="font-semibold">Success:</span> {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        isLoading={isLoading}
                        isDisabled={isLoading || isGoogleLoading}
                    >
                        Authorize Sign In
                    </Button>

                    {/* Trial Credentials Box */}
                    <div className="mt-2 p-4 rounded-xl bg-blue-50/40 dark:bg-zinc-950 border border-blue-100 dark:border-zinc-800 text-left">
                        <p className="text-[11px] font-bold text-blue-700 dark:text-blue-500 uppercase tracking-wider mb-2">
                            Ecosystem Trial Credentials:
                        </p>
                        <div className="flex flex-col gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                            <button
                                type="button"
                                onClick={() => handleQuickFill("admin")}
                                className="text-left hover:underline focus:outline-none text-blue-950 dark:text-zinc-300"
                            >
                                <span className="font-semibold">Admin:</span> admin@admin.com <span className="text-zinc-400">(Click to fill)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill("doctor")}
                                className="text-left hover:underline focus:outline-none text-blue-950 dark:text-zinc-300"
                            >
                                <span className="font-semibold">Clinician:</span> doctor@doctor.com <span className="text-zinc-400">(Click to fill)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill("patient")}
                                className="text-left hover:underline focus:outline-none text-blue-950 dark:text-zinc-300"
                            >
                                <span className="font-semibold">Patient:</span> patient@patient.com <span className="text-zinc-400">(Click to fill)</span>
                            </button>
                        </div>
                    </div>

                    <div className="text-center pt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        Don&apos;t have an healthcare profile?{" "}
                        <Link
                            href="/auth/signup"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            Create personal account
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}