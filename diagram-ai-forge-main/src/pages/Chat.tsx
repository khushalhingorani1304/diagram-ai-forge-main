
// import { useState } from "react";
// import { motion } from "framer-motion";
// import AppLayout from "@/components/layout/AppLayout";
// import { useStore } from "@/store/useStore";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { 
//   Send, 
//   FileText, 
//   PlusCircle, 
//   Clock, 
//   Bot,
//   User,
//   RefreshCw,
//   ChevronDown,
//   Image
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useAuth } from "@/providers/AuthProvider";

// // Mock function that simulates AI response with a delay
// const mockAiResponse = async (prompt: string): Promise<string> => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));
  
//   // Simple responses based on keyword detection
//   if (prompt.toLowerCase().includes("valve")) {
//     return "The standard valve symbols in P&ID diagrams include gate valves, globe valves, ball valves, butterfly valves, and check valves. Each has a specific symbol representation indicating its function in the process flow.";
//   } else if (prompt.toLowerCase().includes("sensor") || prompt.toLowerCase().includes("transmitter")) {
//     return "Sensors and transmitters in P&ID diagrams are represented by circles with function identifiers like PT (Pressure Transmitter), TT (Temperature Transmitter), FT (Flow Transmitter), or LT (Level Transmitter).";
//   } else if (prompt.toLowerCase().includes("standard") || prompt.toLowerCase().includes("iso")) {
//     return "The main standards for P&ID diagrams include ISO 10628, ISA S5.1, and BS 5070. These standards define the symbols and conventions used in process engineering and help ensure consistency across different engineering disciplines.";
//   } else {
//     return "I'm your P&ID Assistant. I can help you understand diagram elements, interpret engineering standards, and answer questions about process control systems. If you have a specific P&ID element or system you'd like to know more about, please let me know.";
//   }
// };

// const Chat = () => {
//   const { user } = useAuth();
//   const { createNewChatSession, chatSessions, chatMessages, addChatMessage } = useStore();
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeSession, setActiveSession] = useState("current");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!input.trim() || isLoading) return;
    
//     const userMessage = input.trim();
//     setInput("");
    
//     // Add user message to the chat
//     addChatMessage({
//       content: userMessage,
//       role: "user"
//     });
    
//     setIsLoading(true);
    
//     try {
//       // Get AI response
//       const aiResponse = await mockAiResponse(userMessage);
      
//       // Add AI response to the chat
//       addChatMessage({
//         content: aiResponse,
//         role: "assistant"
//       });
//     } catch (error) {
//       console.error("Error getting AI response:", error);
      
//       // Add error message to the chat
//       addChatMessage({
//         content: "Sorry, I encountered an error processing your request. Please try again.",
//         role: "assistant"
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNewChat = () => {
//     createNewChatSession();
//     setActiveSession("current");
//   };

//   const formatTimestamp = (date: Date) => {
//     return formatDistanceToNow(date, { addSuffix: true });
//   };


//! ----------------------------------------------------------------------------------------------

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import AppLayout from "@/components/layout/AppLayout";
// import { useStore } from "@/store/useStore";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Send,
//   FileText,
//   PlusCircle,
//   Clock,
//   Bot,
//   User,
//   RefreshCw,
//   ChevronDown,
//   Image,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { useAuth } from "@/providers/AuthProvider";

// // Mock AI Response (optional)
// const mockAiResponse = async (prompt: string): Promise<string> => {
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   if (prompt.toLowerCase().includes("valve")) {
//     return "The standard valve symbols in P&ID diagrams include gate valves, globe valves, ball valves, butterfly valves, and check valves.";
//   } else if (prompt.toLowerCase().includes("sensor") || prompt.toLowerCase().includes("transmitter")) {
//     return "Sensors and transmitters in P&ID diagrams are represented by circles with function identifiers like PT (Pressure Transmitter), TT (Temperature Transmitter), FT (Flow Transmitter), or LT (Level Transmitter).";
//   } else if (prompt.toLowerCase().includes("standard") || prompt.toLowerCase().includes("iso")) {
//     return "The main standards for P&ID diagrams include ISO 10628, ISA S5.1, and BS 5070.";
//   } else {
//     return "I'm your P&ID Assistant. Ask me anything about process diagrams, symbols, or instrumentation.";
//   }
// };

// const Chat = () => {
//   const { user } = useAuth();
//   const {
//     createNewChatSession,
//     chatSessions,
//     chatMessages,
//     addChatMessage,
//     clearMessages,
//   } = useStore();

//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeSession, setActiveSession] = useState("current");

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api/chat", {
//           credentials: "include",
//         });

//         if (!res.ok) throw new Error("Failed to fetch history");

//         const messages = await res.json();
//         clearMessages();
//         messages.forEach((msg: any) => addChatMessage(msg));
//       } catch (err) {
//         console.error("Error fetching chat history:", err);
//       }
//     };

//     fetchHistory();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;
  
//     const userMessage = input.trim();
//     setInput("");
  
//     // Optimistically show user message in UI
//     addChatMessage({
//       content: userMessage,
//       role: "user",
//     });
  
//     setIsLoading(true);
  
//     try {
//       // ✅ Send user message to backend
//       const response = await fetch("http://localhost:3000/api/chat", {
//         method: "POST",
//         credentials: "include", // include cookies for auth
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: userMessage,
//           role: "user",
//         }),
//       });
  
//       const savedUserMessage = await response.json();
  
//       // Now simulate AI response (same mockAiResponse)
//       const aiResponse = await mockAiResponse(userMessage);
  
//       // ✅ Store assistant message in DB too
//       await fetch("http://localhost:3000/api/chat", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: aiResponse,
//           role: "assistant",
//         }),
//       });
  
//       // Show assistant message in UI
//       addChatMessage({
//         content: aiResponse,
//         role: "assistant",
//       });
//     } catch (error) {
//       console.error("Failed to send chat:", error);
//       addChatMessage({
//         content: "Sorry, I couldn’t process your message.",
//         role: "assistant",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleNewChat = () => {
//     createNewChatSession();
//     setActiveSession("current");
//   };

//   const formatTimestamp = (date: Date) => {
//     return formatDistanceToNow(date, { addSuffix: true });
//   };


//   return (
//     <AppLayout title="Chat">
//       <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border shadow-sm">
//         {/* Sidebar with chat history */}
//         <div className="flex w-64 flex-col border-r bg-muted/50">
//           <div className="flex items-center justify-between p-4">
//             <h2 className="font-medium">Chat History</h2>
//             <Button variant="ghost" size="icon" onClick={handleNewChat}>
//               <PlusCircle className="h-4 w-4" />
//             </Button>
//           </div>
          
//           <Tabs defaultValue="chats" className="flex-1">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="chats">Chats</TabsTrigger>
//               <TabsTrigger value="files">Files</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="chats" className="flex h-full flex-col">
//               <div className="flex-1 overflow-y-auto p-2">
//                 <Button 
//                   variant={activeSession === "current" ? "secondary" : "ghost"} 
//                   className="mb-1 w-full justify-start"
//                   onClick={() => setActiveSession("current")}
//                 >
//                   <Bot className="mr-2 h-4 w-4" />
//                   <span className="truncate">Current Session</span>
//                 </Button>
                
//                 {chatSessions.map((session) => (
//                   <Button
//                     key={session.id}
//                     variant={activeSession === session.id ? "secondary" : "ghost"}
//                     className="mb-1 w-full justify-start"
//                     onClick={() => setActiveSession(session.id)}
//                   >
//                     <Clock className="mr-2 h-4 w-4" />
//                     <span className="truncate">{session.title}</span>
//                   </Button>
//                 ))}
//               </div>
//             </TabsContent>
            
//             <TabsContent value="files" className="h-full overflow-y-auto p-2">
//               <Button variant="ghost" className="mb-1 w-full justify-start">
//                 <FileText className="mr-2 h-4 w-4" />
//                 <span className="truncate">P&ID Standard.pdf</span>
//               </Button>
//               <Button variant="ghost" className="mb-1 w-full justify-start">
//                 <FileText className="mr-2 h-4 w-4" />
//                 <span className="truncate">Valve Specifications.pdf</span>
//               </Button>
//               <Button variant="ghost" className="mb-1 w-full justify-start">
//                 <Image className="mr-2 h-4 w-4" />
//                 <span className="truncate">Control System.jpg</span>
//               </Button>
//             </TabsContent>
//           </Tabs>
//         </div>
        
//         {/* Chat area */}
//         <div className="flex flex-1 flex-col">
//           {/* Chat header */}
//           <div className="flex h-14 items-center justify-between border-b px-4">
//             <div className="flex items-center gap-2">
//               <Bot className="h-5 w-5 text-primary" />
//               <h2 className="font-medium">P&ID AI Assistant</h2>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="sm">
//                 <RefreshCw className="mr-2 h-4 w-4" /> New Chat
//               </Button>
//               <Button variant="ghost" size="icon">
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
          
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4">
//             <div className="mx-auto max-w-3xl space-y-6">
//               {chatMessages.length === 0 ? (
//                 <div className="rounded-lg bg-muted/50 p-6 text-center">
//                   <Bot className="mx-auto mb-4 h-12 w-12 text-primary/60" />
//                   <h3 className="mb-2 text-lg font-medium">How can I help you today?</h3>
//                   <p className="mb-6 text-muted-foreground">
//                     Ask me questions about P&ID diagrams, engineering standards, or process control elements.
//                   </p>
//                   <div className="grid gap-2 md:grid-cols-2">
//                     <Button variant="outline" className="justify-start" onClick={() => {
//                       setInput("What do the common valve symbols mean in P&ID diagrams?");
//                     }}>
//                       "What do the common valve symbols mean in P&ID diagrams?"
//                     </Button>
//                     <Button variant="outline" className="justify-start" onClick={() => {
//                       setInput("Explain the ISO standards for P&ID diagrams");
//                     }}>
//                       "Explain the ISO standards for P&ID diagrams"
//                     </Button>
//                     <Button variant="outline" className="justify-start" onClick={() => {
//                       setInput("What's the difference between a pressure transmitter and a pressure gauge?");
//                     }}>
//                       "What's the difference between a pressure transmitter and a pressure gauge?"
//                     </Button>
//                     <Button variant="outline" className="justify-start" onClick={() => {
//                       setInput("How do I represent a control loop in a P&ID diagram?");
//                     }}>
//                       "How do I represent a control loop in a P&ID diagram?"
//                     </Button>
//                   </div>
//                 </div>
//               ) : (
//                 chatMessages.map((message) => (
//                   <motion.div
//                     key={message.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`flex ${
//                       message.role === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`flex max-w-[80%] gap-3 rounded-lg p-4 ${
//                         message.role === "user"
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-muted"
//                       }`}
//                     >
//                       <div className="mt-1 flex-shrink-0">
//                         <Avatar className="h-8 w-8">
//                           {message.role === "user" ? (
//                             <>
//                               <AvatarImage src={user?.image} />
//                               <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
//                             </>
//                           ) : (
//                             <>
//                               <AvatarImage src="/bot-avatar.png" />
//                               <AvatarFallback>AI</AvatarFallback>
//                             </>
//                           )}
//                         </Avatar>
//                       </div>
//                       <div className="flex flex-col gap-1">
//                         <div className="flex items-center gap-2">
//                           <p className="text-sm font-medium">
//                             {message.role === "user" ? user?.name : "P&ID Assistant"}
//                           </p>
//                           <p className="text-xs opacity-70">
//                             {formatTimestamp(message.timestamp)}
//                           </p>
//                         </div>
//                         <p className="text-sm">{message.content}</p>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))
//               )}
              
//               {isLoading && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex justify-start"
//                 >
//                   <div className="flex max-w-[80%] gap-3 rounded-lg bg-muted p-4">
//                     <div className="mt-1 flex-shrink-0">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src="/bot-avatar.png" />
//                         <AvatarFallback>AI</AvatarFallback>
//                       </Avatar>
//                     </div>
//                     <div className="flex flex-col gap-1">
//                       <p className="text-sm font-medium">P&ID Assistant</p>
//                       <div className="flex space-x-1">
//                         <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
//                         <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.2s]"></div>
//                         <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.4s]"></div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           </div>
          
//           {/* Input form */}
//           <div className="border-t p-4">
//             <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
//               <div className="flex items-center gap-2">
//                 <Input
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   placeholder="Type your message..."
//                   className="flex-1"
//                   disabled={isLoading}
//                 />
//                 <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </div>
//               <p className="mt-2 text-xs text-center text-muted-foreground">
//                 P&ID Assistant can make mistakes. Consider checking important information.
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default Chat;



// !-------------------------------------------------


"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  FileText,
  PlusCircle,
  Clock,
  Bot,
  RefreshCw,
  ChevronDown,
  Image,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/providers/AuthProvider";

// Mock AI response for testing
const mockAiResponse = async (prompt: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (prompt.toLowerCase().includes("valve")) {
    return "The standard valve symbols in P&ID diagrams include gate valves, globe valves, ball valves, butterfly valves, and check valves.";
  } else if (prompt.toLowerCase().includes("sensor") || prompt.toLowerCase().includes("transmitter")) {
    return "Sensors and transmitters in P&ID diagrams are represented by circles with function identifiers like PT (Pressure Transmitter), TT (Temperature Transmitter), FT (Flow Transmitter), or LT (Level Transmitter).";
  } else if (prompt.toLowerCase().includes("standard") || prompt.toLowerCase().includes("iso")) {
    return "The main standards for P&ID diagrams include ISO 10628, ISA S5.1, and BS 5070.";
  } else {
    return "I'm your P&ID Assistant. Ask me anything about process diagrams, symbols, or instrumentation.";
  }
};

const Chat = () => {
  const { user } = useAuth();
  const {
    createNewChatSession,
    chatMessages,
    addChatMessage,
    clearMessages,
  } = useStore();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState("current");

  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [assistantMessages, setAssistantMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chat", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch history");

        const { userMessages, assistantMessages } = await res.json();

        clearMessages();
        setUserMessages(userMessages || []);
        setAssistantMessages(assistantMessages || []);

        userMessages.forEach((msg: string) =>
          addChatMessage({ content: msg, role: "user" })
        );
        assistantMessages.forEach((msg: string) =>
          addChatMessage({ content: msg, role: "assistant" })
        );
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    addChatMessage({ content: userMessage, role: "user" });
    setUserMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await mockAiResponse(userMessage);
      addChatMessage({ content: aiResponse, role: "assistant" });
      setAssistantMessages((prev) => [...prev, aiResponse]);

      await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessages: [...userMessages, userMessage],
          assistantMessages: [...assistantMessages, aiResponse],
        }),
      });
    } catch (error) {
      console.error("Failed to send chat:", error);
      addChatMessage({
        content: "Sorry, I couldn’t process your message.",
        role: "assistant",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    createNewChatSession();
    setActiveSession("current");
    clearMessages();
    setUserMessages([]);
    setAssistantMessages([]);
  };

  const formatTimestamp = (date: Date) =>
    formatDistanceToNow(date, { addSuffix: true });

  return (
    <AppLayout title="Chat">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">P&ID Chat Assistant</h1>
          <Button variant="outline" onClick={handleNewChat}>
            <RefreshCw className="w-4 h-4 mr-2" /> New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {chatMessages.map((msg, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Avatar>
                <AvatarFallback>
                  {msg.role === "user" ? "U" : "AI"}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-3 rounded-md max-w-lg shadow-sm">
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-3 rounded-md max-w-lg shadow-sm">
                <p className="text-sm animate-pulse">Typing...</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about P&ID diagrams..."
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Chat;
