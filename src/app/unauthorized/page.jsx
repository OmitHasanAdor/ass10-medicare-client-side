"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6">

      {/* Background Blur */}
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-2xl"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-r from-blue-700 to-indigo-700 shadow-lg"
        >
          <ShieldAlert className="h-12 w-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-6xl font-extrabold text-blue-700"
        >
          401
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-3xl font-bold text-slate-800"
        >
          Unauthorized Access
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-5 max-w-xl text-slate-600 leading-8"
        >
          Sorry! You don&apos;t have permission to access this page.
          Please sign in with the appropriate account or return
          to the homepage.
        </motion.p>

        {/* Lock Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6"
        >
          <Lock className="mx-auto mb-3 h-10 w-10 text-blue-700" />

          <h3 className="text-lg font-semibold text-slate-800">
            Restricted Area
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            This section is only available for authorized users.
            Contact the administrator if you believe this is a mistake.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}