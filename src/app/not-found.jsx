"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, HeartPulse } from "lucide-react";

const NotFound = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-white px-5"
    >
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative max-w-3xl mx-auto text-center z-10">
        {/* Medical Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 150,
          }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              boxShadow: [
                "0 0 0 rgba(37,99,235,.3)",
                "0 0 35px rgba(37,99,235,.5)",
                "0 0 0 rgba(37,99,235,.3)",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="bg-blue-600 p-6 rounded-3xl shadow-xl"
          >
            <HeartPulse className="w-16 h-16 text-white" />
          </motion.div>
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-blue-600"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 text-3xl md:text-5xl font-bold text-slate-900"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-slate-600 text-base md:text-lg max-w-xl mx-auto leading-8"
        >
          The page you are looking for may have been removed, renamed,
          or is temporarily unavailable. Please check the URL or
          navigate back to continue using MediCare Connect.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              <Home size={20} />
              Back To Home
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/find-doctors"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-600 px-8 py-4 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              <Search size={20} />
              Find Doctors
            </Link>
          </motion.div>
        </motion.div>

        {/* Extra Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.8,
            duration: 0.5,
          }}
          whileHover={{
            y: -8,
            transition: {
              duration: 0.3,
            },
          }}
          className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
        >
          <motion.h3
            animate={{
              opacity: [1, 0.8, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="text-xl font-bold text-slate-900"
          >
            Need Medical Assistance?
          </motion.h3>

          <p className="mt-3 text-slate-600 leading-7">
            Our healthcare network is always ready to help you find
            trusted doctors, hospitals, and appointments quickly and
            securely.
          </p>

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-100 px-5 py-3 font-semibold text-red-600"
          >
            🚑 Emergency Hotline: 999
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default NotFound;