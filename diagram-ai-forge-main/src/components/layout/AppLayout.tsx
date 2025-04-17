
import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import Sidebar from "./Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  requireAuth?: boolean;
}

const AppLayout: FC<AppLayoutProps> = ({
  children,
  title,
  requireAuth = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { sidebarOpen } = useStore();

  // Loading state
  if (isLoading) {
    return (
      <div className="grid h-screen w-full place-items-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <motion.main
        className={cn(
          "flex-1 overflow-hidden transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-60" : "ml-16"
        )}
      >
        <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </div>
      </motion.main>
    </div>
  );
};

export default AppLayout;
