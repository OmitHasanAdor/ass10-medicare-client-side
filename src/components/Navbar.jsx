import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import MobileMenu from "./MobileMenu";
import UserDropdown from "./UserDropdown";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 🔄 সেশন থাকলে ডাটাবেজের সঠিক কালেকশন থেকে ফটোসহ ডেটা নিয়ে আসার লজিক
  let fullUserData = session?.user || null;

  if (session?.user?.email) {
    try {
      // আপনার এক্সপ্রেস ব্যাকএন্ড এপিআই-তে রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/current-user?email=${session.user.email}`,
        { cache: "no-store" } // লেটেস্ট ডেটা নিশ্চিত করতে ক্যাশ অফ রাখা হলো
      );

      if (res.ok) {
        const dbUser = await res.json();
        // সেশনের ইউজার ডেটার সাথে ডাটাবেজ থেকে আসা role এবং photo মার্জ করে দেওয়া হলো
        fullUserData = { ...session.user, ...dbUser };
      }
    } catch (error) {
      console.error("Error fetching full user data in Navbar:", error);
    }
  }

  // 👑 রোল অনুযায়ী ড্যাশবোর্ড পাথ নির্ধারণ (ডিফল্ট হিসেবে রোল না থাকলে /dashboard এ যাবে)
  const dashboardHref = fullUserData?.role 
    ? `/dashboard/${fullUserData.role.toLowerCase()}` 
    : "/dashboard";

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

            {/* 🚀 রোল বেসড ড্যাশবোর্ড রুট ডায়নামিকালি বসানো হয়েছে */}
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
              // 🚀 এখানে সেশন ইউজারের বদলে ফটো ও রোলসহ আপডেট হওয়া fullUserData পাস করা হয়েছে
              <UserDropdown user={fullUserData} />
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <MobileMenu
              session={session}
              navLinks={navLinks}
              // মোবাইল মেনুর ভেতরেও ড্যাশবোর্ড রুট ডায়নামিক করার জন্য পাস করা হলো
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