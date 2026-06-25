"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const MobileMenu = ({ session, navLinks }) => {
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
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {session && (
                <Link href="/dashboard">
                  Dashboard
                </Link>
              )}

              {!session ? (
                <>
                  <Link href="/login">
                    Login
                  </Link>

                  <Link href="/register">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile">
                    Profile
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