"use client";

import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

const RegisterClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const loadingToast = toast.loading("Creating your account...");

    const { data, error } = await authClient.signUp.email({
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.photo,
    });

    toast.dismiss(loadingToast);

    if (error) {
      toast.error(error.message || "Signup failed");
      return;
    }

    toast.success("Account created successfully!");
    router.push(callbackUrl);
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (error) {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Create Account
          </h1>
          <p className="text-sm text-slate-500">
            Join MediCare Connect & start your journey
          </p>
        </div>

        {/* Form */}
        <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
          
          {/* Name */}
          <TextField
            isRequired
            name="name"
            className="w-full"
            validate={(v) =>
              v.length < 3 ? "Name must be at least 3 characters" : null
            }
          >
            <Label className="text-xs font-semibold text-slate-700 mb-1">Full Name</Label>
            <Input 
              placeholder="Enter your name" 
              className="w-full transition-all duration-200"
            />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Email */}
          <TextField isRequired name="email" type="email" className="w-full">
            <Label className="text-xs font-semibold text-slate-700 mb-1">Email Address</Label>
            <Input 
              placeholder="Enter your email" 
              className="w-full transition-all duration-200"
            />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Photo URL */}
          <TextField isRequired name="photo" type="url" className="w-full">
            <Label className="text-xs font-semibold text-slate-700 mb-1">Photo URL</Label>
            <Input 
              placeholder="Enter photo URL" 
              className="w-full transition-all duration-200"
            />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Password */}
          <TextField
            isRequired
            name="password"
            type="password"
            className="w-full"
            validate={validatePassword}
          >
            <Label className="text-xs font-semibold text-slate-700 mb-1">Password</Label>
            <Input 
              placeholder="Create strong password" 
              className="w-full transition-all duration-200"
            />
            <Description className="text-[11px] text-slate-400 mt-1 leading-normal">
              Min 6 chars + 1 number + 1 special character
            </Description>
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Check className="w-4 h-4" />
            Create Account
          </Button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-slate-200"></div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Or continue with</span>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        {/* Google Sign-In */}
        <Button
          variant="outline"
          className="w-full h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all duration-200"
          onClick={handleGoogleSignIn}
        >
          <FaGoogle className="text-red-500 text-base" /> Google
        </Button>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 pt-2">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-150 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterClient;