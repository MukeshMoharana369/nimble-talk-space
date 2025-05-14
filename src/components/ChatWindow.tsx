
import { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ChatWindow = () => {
  const { activeChat, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeChat) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const formatMessageTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!activeChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/20">
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
          <p className="text-muted-foreground">
            Select a contact to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeChat.avatar || "https://via.placeholder.com/40"}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className={cn(
              "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background",
              activeChat.isOnline ? "bg-online" : "bg-offline"
            )}></span>
          </div>
          <div>
            <h2 className="font-medium">{activeChat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {activeChat.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
            <span className="sr-only">Video call</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Clear chat history</DropdownMenuItem>
              <DropdownMenuItem>Block contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((message) => {
          const isSent = message.senderId === user?.id;
          return (
            <div 
              key={message.id} 
              className={cn(
                "flex", 
                isSent ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2 animate-slide-in", 
                  isSent ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                )}
              >
                <p className="break-words">{message.text}</p>
                <div 
                  className={cn(
                    "text-xs mt-1", 
                    isSent ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {formatMessageTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
