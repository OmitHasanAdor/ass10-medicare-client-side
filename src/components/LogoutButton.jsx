"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 font-medium"
    >
      Logout
    </button>
  );
};

export default LogoutButton;