"use client";

import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

export default function Loading() {
  return (
    <section className="fixed inset-0 flex items-center justify-center bg-linear-to-br from-blue-950 via-blue-900 to-blue-700">

      {/* Background Glow */}
      <div className="absolute h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>

      <div className="relative flex flex-col items-center">

        {/* Icon */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl"
        >
          <HeartPulse className="h-12 w-12 text-blue-700" />
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          className="mt-8 text-3xl font-bold text-white"
        >
          MediCare Connect
        </motion.h2>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: 0.3,
          }}
          className="mt-2 text-blue-100"
        >
          Loading your healthcare dashboard...
        </motion.p>

        {/* Dots */}
        <div className="mt-8 flex gap-3">

          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="h-4 w-4 rounded-full bg-white"
            />
          ))}

        </div>

      </div>
    </section>
  );
}