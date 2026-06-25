import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MobileMenu from "./MobileMenu";
import UserDropdown from "./UserDropdown";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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

            {session && (
              <Link
                href="/dashboard"
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
                  href="/login"
                  className="px-5 py-2 rounded-xl border font-medium hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <UserDropdown user={session.user} />
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileMenu
              session={session}
              navLinks={navLinks}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;