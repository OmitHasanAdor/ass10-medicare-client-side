"use client";

import { useState } from "react";
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
import { Phone, UserCheck, Image } from "lucide-react"; // Image আইকন যোগ করা হয়েছে
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignUpForm({ redirectTo = "/auth/signin" }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("male");
    const [photo, setPhoto] = useState(""); // Photo ফিল্ডের স্টেট
    const [role, setRole] = useState("patient"); 

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();
    const toggleVisibility = () => setIsVisible((prev) => !prev);

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
        // 🎯 ১. প্রথমে Better-Auth দিয়ে শুধুমাত্র বেসিক অ্যাকাউন্ট তৈরি করা
        const { error: authError } = await signUp.email({
            email: email.trim(),
            password,
            name: name.trim(),
            image: photo.trim() // Better-Auth প্রোফাইল পিকচারকে ডিফল্ট 'image' হিসেবে চেনে
        });

        // যদি Better-Auth কোনো এরর দেয় (যেমন: ইমেইল অলরেডি ইউজড)
        if (authError) {
            setError(authError.message || "Something went wrong during signup.");
            setIsLoading(false);
            return;
        }

        // 🎯 ২. Better-Auth সফল হলে, এবার এক্সপ্রেস সার্ভারে সম্পূর্ণ ইউজার অবজেক্ট পাঠানো
        const fullUserData = {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            gender: gender,
            photo: photo.trim(),
            role: role, // 'patient', 'doctor', 'admin'
            status: role === "doctor" ? "pending" : "active",
            createdAt: new Date().toISOString()
        };

        // এক্সপ্রেস API-তে ডেটা পাঠানো (Port: 5000)
        const response = await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fullUserData)
        });

        const expressResult = await response.json();

        // যদি এক্সপ্রেস সার্ভার কোনো কারণে ডেটা সেভ করতে না পারে
        if (!response.ok) {
            setError(expressResult.message || "Failed to sync data with express server.");
            setIsLoading(false);
            return;
        }

        // 🎯 ৩. দুটি ধাপই সফল হলে সাকসেস মেসেজ ও স্টেট রিসেট
        setSuccess("Account created and profile updated successfully! Redirecting...");
        
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setPhoto("");

        setTimeout(() => {
            router.push(redirectTo);
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
                        isDisabled={isLoading}
                    >
                        Create Account
                    </Button>

                    {/* Autofill box */}
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-left">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <UserCheck size={12} /> Quick Demo Autofill:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                type="button" 
                                onClick={() => handleQuickFill("patient")}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-600 transition-colors"
                            >
                                + Patient Demo
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleQuickFill("doctor")}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-600 transition-colors"
                            >
                                + Doctor Demo
                            </button>
                            <button 
                                type="button" 
                                onClick={() => handleQuickFill("admin")}
                                className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-blue-600 transition-colors"
                            >
                                + Admin Demo
                            </button>
                        </div>
                    </div>

                    <div className="text-center pt-1 text-xs text-zinc-500">
                        Already have an account?{" "}
                        <Link
                            href="/auth/signin"
                            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                            Sign In instead
                        </Link>
                    </div>
                </form>
            </Card>
        </div>
    );
}