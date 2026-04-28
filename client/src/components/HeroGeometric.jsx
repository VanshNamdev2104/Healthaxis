import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/slice/auth.slice";
import LogoutConfirmDialog from "./LogoutConfirmDialog";

/* helper */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* floating shapes */
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-white/[0.15]",
            "shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const performLogout = () => {
    dispatch(logout());
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      
      {/* background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-blue-500/[0.05] blur-3xl" />

      {/* floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-cyan-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-blue-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-indigo-500/[0.15]"
          className="left-[10%] bottom-[10%]"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">

          {/* badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
          >
            <Circle className="h-2 w-2 fill-cyan-400 animate-pulse" />
            <span className="text-sm text-white/60 tracking-wide">
              Smart Healthcare Platform
            </span>
          </motion.div>

          {/* heading */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                Your Health, Simplified
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-300 via-white/90 to-blue-300">
                With HealthAxis
              </span>
            </h1>
          </motion.div>

          {/* description */}
          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed"
          >
            Access hospitals, manage appointments, and take control of your health — all in one powerful platform.
          </motion.p>

          {/* buttons */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            {isAuthenticated ? (
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/dashboard">
                  <button className="px-8 py-3 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:scale-105 transition shadow-xl">
                    Dashboard
                  </button>
                </Link>

                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="px-8 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex justify-center gap-4 flex-wrap">
                <Link to="/auth">
                  <button className="px-8 py-3 rounded-full bg-linear-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:scale-105 transition shadow-xl">
                    Get Started
                  </button>
                </Link>

                
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute inset-0 bg-linear-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={performLogout}
      />
    </div>
  );
}
