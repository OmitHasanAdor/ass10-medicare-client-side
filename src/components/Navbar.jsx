import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MobileMenu from "./MobileMenu";
import UserDropdown from "./UserDropdown";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 🔄 If a session exists, fetch user profile details (photo, role, etc.) from the primary database collection
  let fullUserData = session?.user || null;

  if (session?.user?.email) {
    try {
      // Sending a request to the Express backend API
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/current-user?email=${session.user.email}`,
        { cache: "no-store" } // Caching is disabled to ensure the latest database state is retrieved
      );

      if (res.ok) {
        const dbUser = await res.json();
        // Merging session user credentials with the role and photo details from the database
        fullUserData = { ...session.user, ...dbUser };
      }
    } catch (error) {
      console.error("Error fetching full user data in Navbar:", error);
    }
  }

  // 👑 Dynamic dashboard path resolution based on user role (defaults to /dashboard/patient if missing)
  const dashboardHref = fullUserData?.role 
    ? `/dashboard/${fullUserData.role.toLowerCase()}` 
    : "/dashboard/patient";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Doctors", href: "/find-doctors" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              M
            </div>

            <div>
              <h2 className="font-bold text-xl">
                MediCare
                <span className="text-blue-600"> Connect</span>
              </h2>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-gray-700 hover:text-blue-600 transition"
              >
                {item.name}
              </Link>
            ))}

            {/* 🚀 Render the dynamic role-based dashboard route */}
            {session && (
              <Link
                href={dashboardHref}
                className="font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {!session ? (
              <>
                <Link
                  href="/auth/signin"
                  className="px-5 py-2 rounded-xl border font-medium hover:bg-gray-50"
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/signup"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // 🚀 Passing the synchronized fullUserData (with photo and role properties) instead of raw session user object
              <UserDropdown user={fullUserData} />
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileMenu
              session={session}
              navLinks={navLinks}
              // Passed to ensure the dashboard route stays dynamic inside the mobile view layout
              dashboardHref={dashboardHref}
              user={fullUserData} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;