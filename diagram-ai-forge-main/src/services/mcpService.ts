
import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import { useStore } from '@/store/useStore';

// MCP Connection Status
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// MCP Server Configuration
interface MCPConfig {
  serverUrl: string;
  apiKey?: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
}

// MCP Connection State
interface MCPConnectionState {
  status: ConnectionStatus;
  lastError: string | null;
  reconnectAttempts: number;
  config: MCPConfig;
  socket: WebSocket | null;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  updateConfig: (config: Partial<MCPConfig>) => void;
  sendDiagramUpdate: (nodes: Node[], edges: Edge[]) => void;
  sendChatMessage: (message: string) => void;
}

// Default MCP configuration
const DEFAULT_CONFIG: MCPConfig = {
  serverUrl: 'ws://localhost:8080', // Default to localhost for development
  reconnectInterval: 3000, // 3 seconds
  maxReconnectAttempts: 5
};

// Create MCP connection store
export const useMCPConnection = create<MCPConnectionState>((set, get) => ({
  status: 'disconnected',
  lastError: null,
  reconnectAttempts: 0,
  config: DEFAULT_CONFIG,
  socket: null,
  
  // Connect to MCP server
  connect: () => {
    const { config, socket, status } = get();
    
    // Don't connect if already connecting or connected
    if (status === 'connecting' || status === 'connected') {
      return;
    }
    
    // Close existing socket if any
    if (socket) {
      socket.close();
    }
    
    set({ status: 'connecting', lastError: null });
    
    try {
      // Create new WebSocket connection
      const newSocket = new WebSocket(config.serverUrl);
      
      // Set up event handlers
      newSocket.onopen = () => {
        console.log('Connected to MCP server');
        set({ 
          status: 'connected', 
          reconnectAttempts: 0,
          socket: newSocket 
        });
      };
      
      newSocket.onclose = () => {
        console.log('Disconnected from MCP server');
        
        const { reconnectAttempts, config } = get();
        
        // Try to reconnect if not at max attempts
        if (reconnectAttempts < config.maxReconnectAttempts) {
          setTimeout(() => {
            set({ reconnectAttempts: reconnectAttempts + 1 });
            get().connect();
          }, config.reconnectInterval);
        } else {
          set({ 
            status: 'disconnected', 
            socket: null,
            lastError: 'Maximum reconnection attempts reached'
          });
        }
      };
      
      newSocket.onerror = (error) => {
        console.error('MCP connection error:', error);
        set({ 
          status: 'error',
          lastError: 'Connection error'
        });
      };
      
      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleIncomingMessage(message);
        } catch (error) {
          console.error('Error processing MCP message:', error);
        }
      };
      
      set({ socket: newSocket });
      
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      set({ 
        status: 'error', 
        lastError: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  // Disconnect from MCP server
  disconnect: () => {
    const { socket } = get();
    
    if (socket) {
      socket.close();
    }
    
    set({ 
      status: 'disconnected', 
      socket: null,
      reconnectAttempts: 0
    });
  },
  
  // Update MCP configuration
  updateConfig: (newConfig) => {
    set((state) => ({
      config: { ...state.config, ...newConfig }
    }));
  },
  
  // Send diagram updates to MCP server
  sendDiagramUpdate: (nodes, edges) => {
    const { socket, status } = get();
    
    if (!socket || status !== 'connected') {
      console.warn('Cannot send diagram update: Not connected to MCP server');
      return;
    }
    
    const message = {
      type: 'DIAGRAM_UPDATE',
      payload: {
        nodes,
        edges,
        timestamp: new Date().toISOString()
      }
    };
    
    try {
      socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending diagram update to MCP server:', error);
    }
  },
  
  // Send chat message to MCP server
  sendChatMessage: (message) => {
    const { socket, status } = get();
    
    if (!socket || status !== 'connected') {
      console.warn('Cannot send chat message: Not connected to MCP server');
      return;
    }
    
    const payload = {
      type: 'CHAT_MESSAGE',
      payload: {
        content: message,
        timestamp: new Date().toISOString()
      }
    };
    
    try {
      socket.send(JSON.stringify(payload));
    } catch (error) {
      console.error('Error sending chat message to MCP server:', error);
    }
  }
}));

// Handler for incoming MCP server messages
function handleIncomingMessage(message: any) {
  const store = useStore.getState();
  
  switch (message.type) {
    case 'DIAGRAM_UPDATE':
      // Handle diagram updates from MCP server
      if (message.payload.nodes && message.payload.edges) {
        store.setNodes(message.payload.nodes);
        store.setEdges(message.payload.edges);
        console.log('Diagram updated from MCP server');
      }
      break;
      
    case 'CHAT_RESPONSE':
      // Handle chat responses from MCP server
      if (message.payload.content) {
        store.addChatMessage({
          content: message.payload.content,
          role: 'assistant'
        });
        console.log('Received chat response from MCP server');
      }
      break;
      
    case 'METADATA_UPDATE':
      // Handle metadata updates from MCP server
      if (message.payload.metadata) {
        store.setMetadata(message.payload.metadata);
        console.log('Metadata updated from MCP server');
      }
      break;
      
    default:
      console.warn('Unknown message type from MCP server:', message.type);
  }
}

// Hook to synchronize diagram changes with MCP server
export function useMCPDiagramSync() {
  const { nodes, edges } = useStore();
  const { sendDiagramUpdate } = useMCPConnection();
  
  // This function would be called whenever nodes or edges change
  // It could be hooked into onNodesChange and onEdgesChange in ReactFlow
  const syncDiagramChanges = () => {
    sendDiagramUpdate(nodes, edges);
  };
  
  return { syncDiagramChanges };
}

// Hook to use MCP chat
export function useMCPChat() {
  const { sendChatMessage } = useMCPConnection();
  const { addChatMessage } = useStore();
  
  const sendMessage = (content: string) => {
    // Add user message to local state
    addChatMessage({
      content,
      role: 'user'
    });
    
    // Send message to MCP server
    sendChatMessage(content);
  };
  
  return { sendMessage };
}
