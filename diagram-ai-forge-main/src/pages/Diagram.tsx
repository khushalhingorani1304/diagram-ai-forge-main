
import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  addEdge,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, 
  Terminal, 
  Settings, 
  Info, 
  Save, 
  Share,
  Plus,
  Edit3,
  Trash,
  Maximize2,
  Minimize2,
  Send
} from "lucide-react";
import { MCPConnection } from "@/components/mcp/MCPConnection";
import { useMCPConnection, useMCPChat, useMCPDiagramSync } from "@/services/mcpService";
import { toast } from "sonner";

// Initial diagram elements
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Main Inlet Valve' },
    position: { x: 150, y: 50 },
  },
  {
    id: '2',
    data: { label: 'Pressure Sensor P-101' },
    position: { x: 150, y: 150 },
  },
  {
    id: '3',
    data: { label: 'Control Valve V-103' },
    position: { x: 300, y: 150 },
  },
  {
    id: '4',
    data: { label: 'Pressure Relief Valve' },
    position: { x: 450, y: 200 },
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'Outlet' },
    position: { x: 600, y: 300 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

const Diagram = () => {
  const { currentFile, showMetadataPanel, toggleMetadataPanel } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{content: string, role: 'user' | 'assistant'}>>([]);
  
  // MCP Integration
  const { status: mcpStatus } = useMCPConnection();
  const { syncDiagramChanges } = useMCPDiagramSync();
  const { sendMessage } = useMCPChat();
  
  // Handle chat message submission
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    if (mcpStatus === 'connected') {
      // Send the message to MCP server (this also adds it to local state)
      sendMessage(chatMessage);
    } else {
      // Just add the message to local state if not connected to MCP
      setChatMessages(prev => [
        ...prev, 
        { content: chatMessage, role: 'user' }
      ]);
      // Add a notification that MCP is not connected
      toast.warning("Not connected to MCP server. Connect to enable AI responses.", {
        description: "Your message was saved locally but won't receive a response."
      });
    }
    
    setChatMessage("");
  };

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      
      // Sync with MCP server if connected
      if (mcpStatus === 'connected') {
        syncDiagramChanges();
      }
    },
    [edges, setEdges, mcpStatus, syncDiagramChanges]
  );
  
  // Sync diagram changes with MCP server
  useEffect(() => {
    if (mcpStatus === 'connected') {
      syncDiagramChanges();
    }
  }, [nodes, edges, mcpStatus, syncDiagramChanges]);

  // Subscribe to chat messages from store
  useEffect(() => {
    const unsubscribe = useStore.subscribe(
      (state) => state.chatMessages,
      (messages) => {
        setChatMessages(messages);
      }
    );
    return unsubscribe;
  }, []);

  // Mock data for metadata panel (in a real app, this would be extracted from the diagram)
  const metadata = {
    elements: {
      valves: 3,
      sensors: 1,
      pipes: 4
    },
    specifications: {
      "Operating Pressure": "150 PSI",
      "Design Temperature": "180°F",
      "Control Loop": "PIC-101",
      "Material": "Stainless Steel 316"
    }
  };

  return (
    <AppLayout title="Diagram Editor">
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {currentFile ? currentFile.name : "Untitled Diagram"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {currentFile 
                ? `Last modified: ${new Date().toLocaleDateString()}`
                : "Create or upload a diagram to get started"
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MCPConnection />
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <div className="relative flex flex-1 rounded-lg border">
          <div className="relative flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
              <Panel position="top-left" className="flex gap-2">
                <Button size="sm" variant="secondary">
                  <Plus className="mr-2 h-4 w-4" /> Add Node
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button size="sm" variant="secondary">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </Panel>
            </ReactFlow>
          </div>

          {/* Metadata Panel */}
          <motion.div
            initial={{ width: 350 }}
            animate={{ width: showMetadataPanel ? 350 : 35 }}
            transition={{ duration: 0.3 }}
            className="flex h-full flex-col border-l bg-background"
          >
            <button
              onClick={toggleMetadataPanel}
              className="group flex h-full w-9 items-center justify-center border-r"
              style={{ display: showMetadataPanel ? "none" : "flex" }}
            >
              <ChevronRight className="h-4 w-4 transform text-muted-foreground transition-transform group-hover:text-foreground" />
            </button>

            {showMetadataPanel && (
              <div className="flex h-full flex-col">
                <div className="flex h-12 items-center justify-between border-b px-4">
                  <h3 className="text-sm font-medium">Diagram Information</h3>
                  <button
                    onClick={toggleMetadataPanel}
                    className="grid h-8 w-8 place-items-center rounded-md hover:bg-muted"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                </div>
                
                <Tabs defaultValue="info" className="flex-1">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="chat">AI Chat</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="flex-1 p-4">
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="mb-2 text-sm font-medium">Elements</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valves</span>
                            <span>{metadata.elements.valves}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sensors</span>
                            <span>{metadata.elements.sensors}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pipes</span>
                            <span>{metadata.elements.pipes}</span>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="mb-2 text-sm font-medium">Specifications</h4>
                        <div className="space-y-2 text-sm">
                          {Object.entries(metadata.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground">{key}</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="chat" className="flex h-full flex-col">
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-4">
                        {chatMessages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <Terminal className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              Ask questions about the diagram or request changes
                            </p>
                          </div>
                        ) : (
                          chatMessages.map((msg, index) => (
                            <div key={index} className="flex flex-col items-start gap-2">
                              <div className={`rounded-lg px-4 py-2 text-sm ${
                                msg.role === 'user' 
                                  ? 'bg-primary/10 self-end' 
                                  : 'bg-muted'
                              }`}>
                                {msg.role === 'assistant' && (
                                  <p className="mb-1 font-medium">AI Assistant</p>
                                )}
                                <p>{msg.content}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="border-t p-4">
                      <div className="flex gap-2 items-end">
                        <textarea
                          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="Ask a question about the diagram..."
                          rows={3}
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          size="icon" 
                          className="h-10 w-10"
                          onClick={handleSendMessage}
                          disabled={!chatMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="p-4">
                    <div className="space-y-4">
                      <Card className="p-4">
                        <h4 className="mb-2 text-sm font-medium">Display Settings</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Show grid</span>
                            <input type="checkbox" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Snap to grid</span>
                            <input type="checkbox" defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Show minimap</span>
                            <input type="checkbox" defaultChecked />
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-4">
                        <h4 className="mb-2 text-sm font-medium">MCP Connection</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Status</span>
                            <span className="text-sm font-medium">
                              {mcpStatus === 'connected' ? (
                                <span className="text-green-600">Connected</span>
                              ) : mcpStatus === 'connecting' ? (
                                <span className="text-yellow-600">Connecting...</span>
                              ) : mcpStatus === 'error' ? (
                                <span className="text-red-600">Error</span>
                              ) : (
                                <span className="text-gray-600">Disconnected</span>
                              )}
                            </span>
                          </div>
                          <div className="flex justify-end">
                            <Button size="sm" variant="outline">
                              Configure MCP
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Diagram;
