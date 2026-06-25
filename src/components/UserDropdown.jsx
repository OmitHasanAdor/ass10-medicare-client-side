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
        className="flex items-center gap-3"
      >
        <Image
          src={
            user.image ||
            "https://i.pravatar.cc/150"
          }
          alt={user.name}
          width={40}
          height={40}
          className="rounded-full"
        />

        <span className="font-medium">
          {user.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 bg-white border rounded-2xl shadow-lg p-2">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            Profile
          </Link>

          <Link
            href="/dashboard"
            className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
          >
            Dashboard
          </Link>

          <div className="px-4 py-2">
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;