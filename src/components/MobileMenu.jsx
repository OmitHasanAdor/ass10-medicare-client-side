"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const MobileMenu = ({ session, navLinks, dashboardHref }) => {
  const [open, setOpen] = useState(false);

  // মেনু খোলা অবস্থায় background scroll বন্ধ রাখা (ভালো UX practice)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menuContent = open && (
    <div className="fixed inset-0 z-999 bg-black/50">
      <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl">
        <div className="flex justify-end">
          <button onClick={() => setOpen(false)} aria-label="Close menu">
            <X />
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          {/* General navigation links */}
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

          {/* 🚀 Role-based dashboard route */}
          {session && (
            <Link
              href={dashboardHref || "/dashboard"}
              className="font-medium text-gray-700 hover:text-blue-600 transition"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {/* Authentication links */}
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
  );

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={28} />
      </button>

      {menuContent &&
        typeof document !== "undefined" &&
        createPortal(menuContent, document.body)}
    </>
  );
};

export default MobileMenu;