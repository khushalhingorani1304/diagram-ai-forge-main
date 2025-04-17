
import { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileUp, 
  MessageSquare, 
  History, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import userImage from './logo1.png'; 


interface SidebarProps {
  className?: string;
}

const Sidebar: FC<SidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useStore();
  const { logout, user } = useAuth();

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Upload", icon: FileUp, path: "/upload" },
    { label: "Chat", icon: MessageSquare, path: "/chat" },
    { label: "History", icon: History, path: "/history" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const variants = {
    expanded: { width: "240px" },
    collapsed: { width: "64px" },
  };

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col bg-slate-800 text-white shadow-lg transition-all",
        className
      )}
      initial={sidebarOpen ? "expanded" : "collapsed"}
      animate={sidebarOpen ? "expanded" : "collapsed"}
      variants={variants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {sidebarOpen && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold"
          >
            P&ID Assistant
          </motion.h1>
        )}
        <button
          onClick={toggleSidebar}
          className="grid h-10 w-10 place-items-center rounded-md hover:bg-slate-700"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="mt-8 flex flex-1 flex-col gap-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex h-12 w-full items-center gap-3 rounded-md px-3 transition-colors",
              location.pathname === item.path
                ? "bg-slate-700"
                : "hover:bg-slate-700/60"
            )}
          >
            <item.icon size={20} />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto mb-6 flex flex-col gap-2 px-2">
        {user && (
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-slate-600">
              {user.image ? (
                <img src={userImage} alt={"User"} className="h-full w-full object-cover" />
              ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col overflow-hidden text-sm"
              >
                <span className="font-medium">{"Khushal"}</span>
                <span className="truncate text-xs opacity-70">{"khushal3802.be22@chitkara.edu.in"}</span>
              </motion.div>
            )}
          </div>
        )}


        <button
          onClick={() => logout()}
          className="flex h-12 w-full items-center gap-3 rounded-md px-3 text-red-300 transition-colors hover:bg-red-500/20"
        >
          <LogOut size={20} />
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
