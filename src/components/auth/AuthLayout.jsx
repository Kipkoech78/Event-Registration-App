import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* LEFT SIDE (Background + Text) */}
      <div className="relative w-full lg:w-1/2 h-screen">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Centered Text */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white space-y-4">
          <motion.h1
            className="text-3xl lg:text-5xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Welcome to ExpoPass
          </motion.h1>

          <motion.p
            className="text-lg lg:text-xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Your gateway to events, innovation & networking
          </motion.p>

          <motion.div
            className="text-xl lg:text-2xl font-semibold text-yellow-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            🎟 Register • Scan • Experience
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE (Form Area) */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
