"use client";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useState } from "react";
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
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();
    const toggleVisibility = () => setIsVisible((prev) => !prev);

    const demoCredentials = {
        admin: { email: "admin@medicare.com", password: "AdminPassword123!" },
        doctor: { email: "amanda.ross@medicare.com", password: "DoctorPassword123!" },
        patient: { email: "sarah@example.com", password: "PatientPassword123!" }
    };

    const handleQuickFill = (roleType) => {
        const creds = demoCredentials[roleType];
        if (creds) {
            setEmail(creds.email);
            setPassword(creds.password);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email.trim() || !password) {
            setError("All fields are required.");
            return;
        }

        setIsLoading(true);

        let dynamicRole = "patient";
        if (email.trim() === "admin@medicare.com") {
            dynamicRole = "admin";
        } else if (email.trim() === "amanda.ross@medicare.com") {
            dynamicRole = "doctor";
        }

        try {
            const { error: authError } = await signIn.email({
                email: email.trim(),
                password: password,
                role: dynamicRole
            });

            if (authError) {
                setError(authError.message || "Invalid email or password.");
                return;
            }

            setSuccess(`Logged in successfully as ${dynamicRole}!`);

            const destination = dynamicRole === "patient"
                ? "/dashboard/patient"
                : dynamicRole === "doctor"
                    ? "/dashboard/doctor"
                    : "/dashboard/admin";

            router.push(destination);
        } catch (err) {
            console.error(err);
            setError("An unexpected network error occurred.");
        } finally {
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
                                aria-label={isVisible ? "Hide password" : "Show password"} // এটি নিশ্চিত করুন
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

                    {/* Submit Button - Dynamic Theme Color */}
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                    >
                        Authorize Sign In
                    </Button>

                    {/* Credentials Box styled with blue accents */}
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
                                <span className="font-semibold">Admin:</span> admin@medicare.com <span className="text-zinc-400">(Click to fill)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill("doctor")}
                                className="text-left hover:underline focus:outline-none text-blue-950 dark:text-zinc-300"
                            >
                                <span className="font-semibold">Clinician:</span> amanda.ross@medicare.com <span className="text-zinc-400">(Click to fill)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickFill("patient")}
                                className="text-left hover:underline focus:outline-none text-blue-950 dark:text-zinc-300"
                            >
                                <span className="font-semibold">Patient:</span> sarah@example.com <span className="text-zinc-400">(Click to fill)</span>
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