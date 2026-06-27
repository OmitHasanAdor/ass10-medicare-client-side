"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const MobileMenu = ({ session, navLinks, dashboardHref }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <Menu size={28} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-6">
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-5">
              {/* জেনারেল নেভিগেশন লিঙ্কসমূহ */}
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-medium text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* 🚀 রোল বেসড ড্যাশবোর্ড রুট */}
              {session && (
                <Link 
                  href={dashboardHref || "/dashboard"} 
                  className="font-medium text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              {/* অথেন্টিকেশন লিঙ্কসমূহ */}
              {!session && (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="font-medium text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link 
                    href="/auth/signup" 
                    className="font-medium text-gray-700 hover:text-blue-600 transition"
                    onClick={() => setOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;