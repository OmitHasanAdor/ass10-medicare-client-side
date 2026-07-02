"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  // Handler to clear the active authentication session and redirect the user
  const handleLogout = async () => {
    // 1. Terminate the authentication session using Better Auth client handler
    await authClient.signOut();

    // 2. Redirect the user back to the home page route safely
    router.push("/");
    
    // 3. Refresh the current route server components to discard cache state values
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 cursor-pointer font-medium"
    >
      Logout
    </button>
  );
};

export default LogoutButton;