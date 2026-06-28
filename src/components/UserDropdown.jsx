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
      document.removeEventListener("mousedown", close);
  }, []);

  // 🚀 রোল অনুযায়ী ডাইনামিক ড্যাশবোর্ড রুট বা পাথ নির্ধারণ করা
  // ইউজার রোল যদি 'admin', 'doctor' বা 'patient' হয়, তবে সেই অনুযায়ী রাউট তৈরি হবে। 
  // কোনো রোল না থাকলে ডিফল্টভাবে শুধু '/dashboard' এ যাবে।
  const dashboardLink = user?.role 
    ? `/dashboard/${user.role.toLowerCase()}` 
    : "/dashboard/patient";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 focus:outline-none"
      >
        <Image
          src={user?.photo || "https://i.pravatar.cc/150"}
          alt={user?.name || "User"}
          width={40}
          height={40}
          className="rounded-full h-13 w-13 object-cover" 
        />

        <span className="font-medium text-gray-700">
          {user?.name || "User"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white border rounded-2xl shadow-lg p-2 z-50">
          <div className="px-4 py-1.5 text-xs text-gray-400 font-medium capitalize border-b mb-1">
            {user?.role || "guest"}
          </div>

          {/* 🎯 এখানে আগে ফিক্সড '/dashboard' ছিল, এখন ডাইনামিক 'dashboardLink' বসানো হয়েছে */}
          <Link
            href={dashboardLink}
            onClick={() => setOpen(false)} // মেনু ক্লিক করলে যেন ড্রপডাউনটি বন্ধ হয়ে যায়
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