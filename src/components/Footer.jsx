import Link from "next/link";
import {
    Phone,
    Mail,
    MapPin,
    HeartPulse,
} from "lucide-react";

import {
    FaFacebookF,
    FaLinkedinIn,
    FaTwitter,
    FaInstagram,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-white">
            {/* Top Section */}
            <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Logo & About */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-600 p-2 rounded-xl">
                                <HeartPulse className="w-6 h-6 text-white" />
                            </div>

                            <h2 className="text-2xl font-bold">MediCare</h2>
                        </div>

                        <p className="text-slate-400 leading-relaxed">
                            Smart healthcare platform helping patients find doctors,
                            schedule appointments, and access quality healthcare services
                            anytime, anywhere.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5">Quick Links</h3>

                        <ul className="space-y-3 text-slate-400">
                            <li>
                                <Link href="/" className="hover:text-blue-400 transition">
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link href="/find-doctors" className="hover:text-blue-400 transition">
                                    Find Doctors
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/"
                                    className="hover:text-blue-400 transition"
                                >
                                    Appointments
                                </Link>
                            </li>

                            <li>
                                <Link href="/about" className="hover:text-blue-400 transition">
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link href="/contact" className="hover:text-blue-400 transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5">
                            Contact Information
                        </h3>

                        <div className="space-y-4 text-slate-400">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                                <p>123 Healthcare Avenue, Medical City</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                <p>support@medicare.com</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500" />
                                <p>+880 1234-567890</p>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Hotline */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5">
                            Emergency Hotline
                        </h3>

                        <div className="bg-blue-600 rounded-2xl p-5">
                            <p className="text-blue-100 mb-2">
                                24/7 Emergency Support
                            </p>

                            <h2 className="text-3xl font-bold">
                                999
                            </h2>

                            <p className="text-blue-100 mt-2">
                                Immediate medical assistance available anytime.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            <Link
                                href="/"
                                className="bg-slate-800 hover:bg-blue-600 transition p-3 rounded-xl"
                            >
                                <FaFacebookF size={20} />
                            </Link>

                            <Link
                                href="/"
                                className="bg-slate-800 hover:bg-blue-600 transition p-3 rounded-xl"
                            >

                                <FaLinkedinIn size={20} />


                            </Link>

                            <Link
                                href="/"
                                className="bg-slate-800 hover:bg-blue-600 transition p-3 rounded-xl"
                            >
                                <FaTwitter size={20} />
                            </Link>

                            <Link
                                href="/"
                                className="bg-slate-800 hover:bg-blue-600 transition p-3 rounded-xl"
                            >
                                <FaInstagram size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-center md:text-left">
                        © {new Date().getFullYear()} MediCare. All Rights Reserved.
                    </p>

                    <div className="flex gap-6 text-slate-500">
                        <Link href="/" className="hover:text-blue-400">
                            Privacy Policy
                        </Link>

                        <Link href="/" className="hover:text-blue-400">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;