import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

export type DiagramSession = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
};


export type ChatSession = {
  id: string;
  title: string;
  createdAt: Date;
  messageCount?: number;
};

export type ChatMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

interface AppState {
  // File and diagram states
  currentFile: File | null;
  nodes: Node[];
  edges: Edge[];
  selectedElement: Node | Edge | null;
  diagramSessions: DiagramSession[];
  activeDiagramSession: DiagramSession | null;

  // Chat states
  chatMessages: ChatMessage[];
  chatSessions: ChatSession[];
  activeChatSession: string | null;

  // Metadata panel
  showMetadataPanel: boolean;
  metadata: Record<string, any> | null;

  // UI States
  isDarkMode: boolean;
  sidebarOpen: boolean;

  // Actions
  setCurrentFile: (file: File | null) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedElement: (element: Node | Edge | null) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void; // ✅ Added clearMessages here
  createNewDiagramSession: (title: string) => void;
  setActiveDiagramSession: (sessionId: string | null) => void;
  createNewChatSession: () => void;
  setActiveChatSession: (sessionId: string | null) => void;
  toggleMetadataPanel: () => void;
  setMetadata: (metadata: Record<string, any> | null) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  currentFile: null,
  nodes: [],
  edges: [],
  selectedElement: null,
  diagramSessions: [],
  activeDiagramSession: null,

  chatMessages: [],
  chatSessions: [],
  activeChatSession: null,

  showMetadataPanel: true,
  metadata: null,

  isDarkMode: false,
  sidebarOpen: true,

  // Actions
  setCurrentFile: (file) => set({ currentFile: file }),

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  setSelectedElement: (element) => set({ selectedElement: element }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...message,
          timestamp: new Date(),
        },
      ],
    })),

  clearMessages: () => set({ chatMessages: [] }), // ✅ clearMessages function

  createNewDiagramSession: (title) =>
    set((state) => {
      const newSession = {
        id: `diagram-${Date.now()}`,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        diagramSessions: [...state.diagramSessions, newSession],
        activeDiagramSession: newSession,
      };
    }),

  setActiveDiagramSession: (sessionId) =>
    set((state) => ({
      activeDiagramSession:
        state.diagramSessions.find((session) => session.id === sessionId) || null,
    })),

  createNewChatSession: () =>
    set((state) => {
      const newSession = {
        id: `chat-${Date.now()}`,
        title: `Chat Session ${state.chatSessions.length + 1}`,
        createdAt: new Date(),
        messageCount: 0,
      };

      return {
        chatSessions: [...state.chatSessions, newSession],
        activeChatSession: newSession.id,
        chatMessages: [], // Clear messages when starting a new session
      };
    }),

  setActiveChatSession: (sessionId) => set({ activeChatSession: sessionId }),

  toggleMetadataPanel: () =>
    set((state) => ({ showMetadataPanel: !state.showMetadataPanel })),

  setMetadata: (metadata) => set({ metadata }),

  toggleDarkMode: () =>
    set((state) => ({ isDarkMode: !state.isDarkMode })),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
