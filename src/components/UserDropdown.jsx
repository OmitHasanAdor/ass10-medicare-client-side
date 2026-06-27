"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import LogoutButton from "./LogoutButton";

const UserDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 focus:outline-none"
      >
        {/* 🛠️ এখানে user?.image এর বদলে user?.photo ব্যবহার করা হয়েছে */}
        <Image
          src={
            user?.photo ||
            "https://i.pravatar.cc/150"
          }
          alt={user?.name || "User"}
          width={40}
          height={40}
          className="rounded-full object-cover" // 📸 ছবি সুন্দরভাবে ফিট রাখার জন্য object-cover যোগ করা হয়েছে
        />

        <span className="font-medium text-gray-700">
          {user?.name || "User"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white border rounded-2xl shadow-lg p-2 z-50">
          {/* ℹ️ (ঐচ্ছিক) ড্রপডাউনের ভেতরে ইউজারের রোল বা ইমেইল দেখানোর জন্য */}
          <div className="px-4 py-1.5 text-xs text-gray-400 font-medium capitalize border-b mb-1">
            {user?.role || "guest"}
          </div>

          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 text-sm"
          >
            Profile
          </Link>

          <Link
            href="/dashboard"
            className="block px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 text-sm"
          >
            Dashboard
          </Link>

          <div className="px-4 cursor-pointer py-2 border-t mt-1">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;