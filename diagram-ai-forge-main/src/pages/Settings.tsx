
import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Moon, 
  LogOut, 
  Bell, 
  Shield,
  Eye,
  Lock,
  Database
} from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, update the user profile here
    
    setIsSaving(false);
  };

  return (
    <AppLayout title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="grid">
                <button className="flex items-center gap-3 rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <User className="h-4 w-4" />
                  Account
                </button>
                <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-muted">
                  <Shield className="h-4 w-4" />
                  Security
                </button>
                <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-muted">
                  <Bell className="h-4 w-4" />
                  Notifications
                </button>
                <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-muted">
                  <Eye className="h-4 w-4" />
                  Appearance
                </button>
                <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-muted">
                  <Database className="h-4 w-4" />
                  Data & Storage
                </button>
              </nav>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      {user?.image ? (
                        <AvatarImage src={user.image} />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          {name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" x2="19" y1="8" y2="14" />
                        <line x1="22" x2="16" y1="11" y2="11" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about your diagrams and chats
                    </p>
                  </div>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your work while editing diagrams
                    </p>
                  </div>
                  <Switch
                    checked={autoSaveEnabled}
                    onCheckedChange={setAutoSaveEnabled}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Change Password</Label>
                      <p className="text-sm text-muted-foreground">
                        Update your password for better security
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Lock className="mr-2 h-4 w-4" />
                      Update
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sign out of all devices</Label>
                      <p className="text-sm text-muted-foreground">
                        Log out from all devices where you're currently signed in
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base text-destructive">
                        Delete Account
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all your data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default Settings;
