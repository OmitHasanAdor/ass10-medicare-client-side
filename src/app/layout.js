import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: {
        default: "MediCare Connect | Smart Healthcare Appointment Platform",
        template: "%s | MediCare Connect",
    },
    description:
        "MediCare Connect is a modern healthcare platform where patients can find verified doctors, book appointments, manage prescriptions, and make secure online payments.",
    keywords: [
        "MediCare Connect",
        "Healthcare Platform",
        "Doctor Appointment",
        "Find Doctors",
        "Online Consultation",
        "Medical Booking",
        "Verified Doctors",
        "Healthcare Management",
    ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
<Navbar></Navbar>
        <main>
          {children}
        </main>
        <Footer></Footer>
         <Toaster />
      </body>
    </html>
  );
}
