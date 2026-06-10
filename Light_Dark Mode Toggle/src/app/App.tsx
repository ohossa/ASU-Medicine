import React, { useState } from "react";
import { motion } from "motion/react";
import { ThemeToggle } from "./components/ThemeToggle";

export default function App() {
  // Default to dark mode (left side) as per typical preference or system pref could be checked here
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <motion.div
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden transition-colors"
      // Full screen background gradient transition
      animate={{
        backgroundColor: isDark ? "#09090b" : "#f4f4f5",
        backgroundImage: isDark 
          ? "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)" 
          : "radial-gradient(circle at 50% 50%, #ffffff 0%, #e4e4e7 100%)",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="z-10 flex flex-col items-center gap-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
        >
            <motion.h1 
                className="text-4xl font-bold tracking-tight"
                animate={{ color: isDark ? "#ffffff" : "#18181b" }}
            >
                {isDark ? "Dark Mode" : "Light Mode"}
            </motion.h1>
            <motion.p 
                className="mt-2 text-lg font-medium"
                animate={{ color: isDark ? "#a1a1aa" : "#71717a" }}
            >
                Interactive Toggle
            </motion.p>
        </motion.div>

        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      {/* Decorative ambient glow behind the toggle */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        animate={{
            width: "300px",
            height: "300px",
            backgroundColor: isDark ? "rgba(60, 100, 255, 0.15)" : "rgba(255, 200, 50, 0.2)",
        }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
}
