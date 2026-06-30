"use client";
import { Phone, UserCheck, Image } from "lucide-react"; 
import { useState, useEffect } from "react";
import { signUp, signIn, useSession } from "@/lib/auth-client"; // useSession এবং signIn যোগ করা হয়েছে
import { useRouter } from "next/navigation";

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
    Person,
    At,
    ShieldKeyhole,
} from "@gravity-ui/icons";
import toast from "react-hot-toast";

export default function SignUpForm({ redirectTo = "/dashboard/patient" }) { // ডিফল্ট রিডাইরেক্ট পেশেন্ট ড্যাশবোর্ডে
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("male");
    const [photo, setPhoto] = useState(""); 
    const [role, setRole] = useState("patient"); 

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();
    const { data: session } = useSession(); // কারেন্ট ইউজার সেশন ট্র্যাকিং
    const toggleVisibility = () => setIsVisible((prev) => !prev);

    // 🎯 গুগল দিয়ে লগইন করে ব্যাক করার পর অটোমেটিক এক্সপ্রেস ব্যাকএন্ডে ডাটা পুশ করার ইফেক্ট
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
                        toast.success("Successfully secured profile as Patient!");
                        router.push(redirectTo);
                    }
                } catch (err) {
                    console.error("Sync error:", err);
                }
            };
            syncGoogleUser();
        }
    }, [session, router, redirectTo]);

    // 🌐 Google Sign-In হ্যান্ডলার
    const handleGoogleSignIn = async () => {
        setError("");
        setIsGoogleLoading(true);
        try {
            toast.loading("Connecting to Google Secure Portal...");
            await signIn.social({
                provider: "google",
                callbackURL: window.location.origin + "/auth/signup", // সাইনআপ পেজেই ব্যাক করবে ডাটা সিঙ্ক করার জন্য
            });
        } catch (err) {
            console.error(err);
            toast.error("Google authentication failed.");
            setIsGoogleLoading(false);
        }
    };

    const handleQuickFill = (selectedRole) => {
        setRole(selectedRole);
        if (selectedRole === "admin") {
            setName("System Admin");
            setEmail("admin@medicare.com");
            setPassword("AdminPassword123!");
            setPhone("+8801700000000");
            setGender("male");
            setPhoto("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde");
        } else if (selectedRole === "doctor") {
            setName("Dr. Amanda Ross");
            setEmail("amanda.ross@medicare.com");
            setPassword("DoctorPassword123!");
            setPhone("+8801800000000");
            setGender("female");
            setPhoto("https://images.unsplash.com/photo-1559839734-2b71ea197ec2");
        } else {
            setName("Sarah Jenkins");
            setEmail("sarah@example.com");
            setPassword("PatientPassword123!");
            setPhone("+8801900000000");
            setGender("female");
            setPhoto("https://images.unsplash.com/photo-1494790108377-be9c29b29330");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim() || !phone.trim()) return setError("All fields are required.");
        if (password.length < 6) return setError("Password must be at least 6 characters.");

        setIsLoading(true);

        try {
            const { error: authError } = await signUp.email({
                email: email.trim(),
                password,
                name: name.trim(),
                image: photo.trim() 
            });

            if (authError) {
                setError(authError.message || "Something went wrong during signup.");
                setIsLoading(false);
                return;
            }

            const fullUserData = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                gender: gender,
                photo: photo.trim(),
                role: role, 
                status: role === "doctor" ? "pending" : "active",
                createdAt: new Date().toISOString()
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fullUserData)
            });

            const expressResult = await response.json();

            if (!response.ok) {
                setError(expressResult.message || "Failed to sync data with express server.");
                setIsLoading(false);
                return;
            }

            toast.success("Account created successfully!");
            setSuccess("Account created and profile updated successfully! Redirecting...");
            
            setName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setPhoto("");

            setTimeout(() => {
                router.push(role === "patient" ? "/dashboard/patient" : redirectTo);
            }, 1500);

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
                        Create Healthcare Profile
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Join MediCare Connect to manage medical records and appointments.
                    </p>
                </div>

                {/* 🌐 Google Sign-In Button */}
                <div className="mb-4">
                    <Button
                        type="button"
                        onClick={handleGoogleSignIn}
                        isLoading={isGoogleLoading}
                        isDisabled={isGoogleLoading || isLoading}
                        className="w-full h-11 rounded-xl font-medium text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </Button>
                    <div className="relative flex py-4 items-center">
                        <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
                        <span className="shrink mx-4 text-zinc-400 text-xs uppercase tracking-wider font-semibold">Or email</span>
                        <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
                    </div>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    
                    {/* Role Tabs */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Register As
                        </Label>
                        <div className="grid grid-cols-3 gap-2 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
                            {["patient", "doctor", "admin"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                                        role === r
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <TextField isRequired name="name" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Full Name
                        </Label>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 focus-within:border-blue-600 transition-colors">
                            <Person className="text-zinc-400 pointer-events-none" size={16} />
                            <Input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Email */}
                    <TextField isRequired name="email" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Email Address
                        </Label>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 focus-within:border-blue-600 transition-colors">
                            <At className="text-zinc-400 pointer-events-none" size={16} />
                            <Input
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Photo URL Field */}
                    <TextField name="photo" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Profile Photo URL
                        </Label>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 focus-within:border-blue-600 transition-colors">
                            <Image alt={'user logo'} className="text-zinc-400 pointer-events-none" size={16} />
                            <Input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={photo}
                                onChange={(e) => setPhoto(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Phone & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <TextField isRequired name="phone" className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Phone Number
                            </Label>
                            <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 focus-within:border-blue-600 transition-colors">
                                <Phone className="text-zinc-400 pointer-events-none" size={14} />
                                <Input
                                    type="text"
                                    placeholder="+88017..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                                />
                            </InputGroup>
                        </TextField>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Gender
                            </Label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="h-10 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-600 transition-colors"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <TextField isRequired name="password" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            Password
                        </Label>
                        <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-950 focus-within:border-blue-600 transition-colors">
                            <ShieldKeyhole className="text-zinc-400 pointer-events-none" size={16} />
                            <Input
                                type={isVisible ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent py-2 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                            />
                            <button
                                type="button"
                                onClick={toggleVisibility}
                                className="focus:outline-none text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                            >
                                {isVisible ? <EyeSlash size={18} /> : <Eye size={18} />}
                            </button>
                        </InputGroup>
                    </TextField>

                    {error && <div className="p-3 text-xs font-medium rounded-xl bg-red-100/60 text-red-700 border border-red-200">{error}</div>}
                    {success && <div className="p-3 text-xs font-medium rounded-xl bg-blue-100/60 text-blue-800 border border-blue-200">{success}</div>}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-11 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors mt-2"
                        isLoading={isLoading}
                        isDisabled={isLoading || isGoogleLoading}
                    >
                        Create Account
                    </Button>

                    {/* Autofill box */}
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-left">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <UserCheck size={12} /> Quick Demo Autofill:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleQuickFill("patient")} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-600 transition-colors">+ Patient Demo</button>
                            <button type="button" onClick={() => handleQuickFill("doctor")} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-600 transition-colors">+ Doctor Demo</button>
                            <button type="button" onClick={() => handleQuickFill("admin")} className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-600 transition-colors">+ Admin Demo</button>
                        </div>
                    </div>

                    <div className="text-center pt-1 text-xs text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/auth/signin" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Sign In instead</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}