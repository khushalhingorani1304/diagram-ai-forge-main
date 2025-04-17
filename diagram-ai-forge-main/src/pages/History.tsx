
import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Calendar,
  Search,
  FileUp,
  MessageSquare,
  Trash2,
  Star,
  Filter,
  ArrowDownUp,
  Download
} from "lucide-react";

const History = () => {
  const navigate = useNavigate();
  const { diagramSessions, chatSessions } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Mock data for demonstration
  const mockDiagramSessions = [
    {
      id: "diagram-1",
      title: "Main Process Flow",
      createdAt: new Date(2023, 6, 15),
      updatedAt: new Date(2023, 7, 2),
      thumbnail: "/placeholder.svg"
    },
    {
      id: "diagram-2",
      title: "Heat Exchanger System",
      createdAt: new Date(2023, 5, 20),
      updatedAt: new Date(2023, 5, 28),
      thumbnail: "/placeholder.svg"
    },
    {
      id: "diagram-3",
      title: "Valve Control Loop",
      createdAt: new Date(2023, 4, 10),
      updatedAt: new Date(2023, 4, 15),
      thumbnail: "/placeholder.svg"
    },
    {
      id: "diagram-4",
      title: "Pressure Regulation Subsystem",
      createdAt: new Date(2023, 3, 5),
      updatedAt: new Date(2023, 3, 20),
      thumbnail: "/placeholder.svg"
    }
  ];
  
  const mockChatSessions = [
    {
      id: "chat-1",
      title: "What is P&ID",
      createdAt: new Date(2025, 4, 16),
      messageCount: 12
    },
    {
      id: "chat-2",
      title: "Pressure Control Loop Questions",
      createdAt: new Date(2025, 4, 16),
      messageCount: 8
    },
    {
      id: "chat-3",
      title: "ISO Standards Clarification",
      createdAt: new Date(2025, 4, 17),
      messageCount: 15
    }
  ];

  // Combine mock data with store data
  const allDiagramSessions = [...diagramSessions, ...mockDiagramSessions];
  
  // Add messageCount to store chat sessions if it doesn't exist
  const storeChatSessionsWithCount = chatSessions.map(session => ({
    ...session,
    messageCount: session.messageCount || 5 // Default value
  }));
  
  const allChatSessions = [...storeChatSessionsWithCount, ...mockChatSessions];
  
  // Sort function
  const sortByDate = <T extends { createdAt: Date }>(a: T, b: T) => {
    if (sortDirection === "desc") {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
  };

  // Filter function
  const filterByQuery = <T extends { title: string }>(items: T[]) => {
    if (!searchQuery) return items;
    
    return items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredDiagrams = filterByQuery(allDiagramSessions).sort(sortByDate);
  const filteredChats = filterByQuery(allChatSessions).sort(sortByDate);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <AppLayout title="History">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-muted-foreground">
            View and manage your past P&ID diagram sessions and chat history
          </p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={toggleSortDirection}>
            <ArrowDownUp className="mr-2 h-4 w-4" />
            {sortDirection === "desc" ? "Newest First" : "Oldest First"}
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="diagrams">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="diagrams" className="flex-1 sm:flex-initial">
              <FileUp className="mr-2 h-4 w-4" />
              Diagrams
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex-1 sm:flex-initial">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagrams">
            {filteredDiagrams.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDiagrams.map((session) => (
                  <Card key={session.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={session.thumbnail || "/placeholder.svg"}
                        alt={session.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 font-medium">{session.title}</h3>
                      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Created: {session.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/diagram`)}
                        >
                          Open
                        </Button>
                        <Button variant="outline" size="sm" className="px-2">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="px-2">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="px-2">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <FileUp className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No diagrams found</h3>
                <p className="mb-4 text-muted-foreground">
                  You haven't created or uploaded any P&ID diagrams yet.
                </p>
                <Button onClick={() => navigate("/upload")}>
                  Upload a Diagram
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chats">
            {filteredChats.length > 0 ? (
              <div className="space-y-4">
                {filteredChats.map((session) => (
                  <Card key={session.id} className="overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{session.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {session.createdAt.toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{(session as any).messageCount || 0} messages</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate("/chat")}
                        >
                          Continue
                        </Button>
                        <Button variant="outline" size="sm" className="px-2">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <MessageSquare className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No chat history found</h3>
                <p className="mb-4 text-muted-foreground">
                  You haven't had any conversations with the AI assistant yet.
                </p>
                <Button onClick={() => navigate("/chat")}>
                  Start a Chat
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
};

export default History;
