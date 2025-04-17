
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { isDarkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    if (isDarkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [isDarkMode, setTheme]);

  const handleToggle = () => {
    toggleDarkMode();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className="flex h-10 w-10 items-center justify-center rounded-md bg-background/90 shadow-sm backdrop-blur-sm hover:bg-secondary"
      aria-label="Toggle theme"
    >
      <Sun
        size={20}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={20}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </motion.button>
  );
}
