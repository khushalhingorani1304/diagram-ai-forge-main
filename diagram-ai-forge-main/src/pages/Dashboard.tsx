
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { Upload, Clock, Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const { diagramSessions, createNewDiagramSession } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");

  const handleCreateSession = () => {
    const title = newSessionTitle.trim() || `Project ${diagramSessions.length + 1}`;
    createNewDiagramSession(title);
    setIsCreating(false);
    setNewSessionTitle("");
    navigate("/upload");
  };

  const recentSessions = diagramSessions.slice(0, 3);

  return (
    <AppLayout title="Dashboard">
      <div className="grid gap-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Welcome to P&ID Assistant</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upload Diagram</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Upload a new P&ID diagram for analysis
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" onClick={() => navigate("/upload")}>
                  Upload New Diagram
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Projects</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  View your recent diagram projects
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full" onClick={() => navigate("/history")}>
                  View History
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Start Chat</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Ask questions about your P&ID diagrams
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full" onClick={() => navigate("/chat")}>
                  Start Chat Session
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Project</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Create a new P&ID project from scratch
                </p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button variant="secondary" className="w-full" onClick={() => setIsCreating(true)}>
                  Create New Project
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="mb-4 text-xl font-semibold">Recent Projects</h2>
          {recentSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recentSessions.map((session) => (
                <Card key={session.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted/40">
                    <div className="flex h-full items-center justify-center">
                      <Folder className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1 text-base">{session.title}</CardTitle>
                    <CardDescription className="line-clamp-1 text-xs">
                      Last edited: {session.updatedAt.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate(`/project/${session.id}`)}>
                      Open Project
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/40 p-8 text-center">
              <p className="text-muted-foreground">No recent projects found. Create a new project to get started.</p>
            </Card>
          )}
        </motion.section>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-md rounded-lg bg-background p-6 shadow-xl"
            >
              <h3 className="mb-4 text-lg font-medium">Create New Project</h3>
              <input
                type="text"
                className="mb-4 w-full rounded-md border border-input bg-background p-2 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Project Title"
                value={newSessionTitle}
                onChange={(e) => setNewSessionTitle(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSession}>Create</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Dashboard;
