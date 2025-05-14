
import { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, MoreVertical, Trash2 } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const ChatWindow = () => {
  const { activeChat, messages, sendMessage, deleteContact, blockContact, clearChatHistory } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmBlockOpen, setConfirmBlockOpen] = useState(false);
  const [confirmClearHistoryOpen, setConfirmClearHistoryOpen] = useState(false);
  
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

  const handleViewProfile = () => {
    toast({
      title: "View Profile",
      description: `Viewing ${activeChat?.name}'s profile`,
    });
    // In a real app, you'd navigate to the profile page or open a profile modal
  };

  const handleClearChatHistory = () => {
    if (activeChat) {
      clearChatHistory(activeChat.id);
      setConfirmClearHistoryOpen(false);
      toast({
        title: "Chat cleared",
        description: "Chat history has been cleared successfully",
      });
    }
  };

  const handleBlockContact = () => {
    if (activeChat) {
      blockContact(activeChat.id);
      setConfirmBlockOpen(false);
      toast({
        title: "Contact blocked",
        description: `${activeChat.name} has been blocked`,
      });
    }
  };

  const handleDeleteContact = () => {
    if (activeChat) {
      deleteContact(activeChat.id);
      setConfirmDeleteOpen(false);
      toast({
        title: "Contact deleted",
        description: `${activeChat.name} has been deleted from your contacts`,
      });
    }
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
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeChat.avatar || "https://via.placeholder.com/40"}
              alt={activeChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
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
          <Button variant="ghost" size="icon" className={cn("", isMobile ? "h-10 w-10" : "")}>
            <Phone className={cn("", isMobile ? "h-5 w-5" : "h-4 w-4")} />
            <span className="sr-only">Call</span>
          </Button>
          <Button variant="ghost" size="icon" className={cn("", isMobile ? "h-10 w-10" : "")}>
            <Video className={cn("", isMobile ? "h-5 w-5" : "h-4 w-4")} />
            <span className="sr-only">Video call</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("", isMobile ? "h-10 w-10" : "")}>
                <MoreVertical className={cn("", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewProfile} className={cn("", isMobile && "h-11 text-base py-2")}>
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfirmClearHistoryOpen(true)} className={cn("", isMobile && "h-11 text-base py-2")}>
                Clear chat history
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfirmBlockOpen(true)} className={cn("", isMobile && "h-11 text-base py-2")}>
                Block contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setConfirmDeleteOpen(true)} className={cn("text-destructive", isMobile && "h-11 text-base py-2")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete contact
              </DropdownMenuItem>
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
                  "max-w-[80%] rounded-lg px-4 py-3 animate-slide-in", 
                  isSent ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                )}
              >
                <p className="break-words text-[15px]">{message.text}</p>
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
      
      {/* Message input - fixed at the bottom for mobile */}
      <div className="p-3 border-t sticky bottom-0 bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 h-11"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newMessage.trim()}
            className={cn("", isMobile ? "h-11 w-11" : "")}
          >
            <Send className={cn("", isMobile ? "h-5 w-5" : "h-4 w-4")} />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>

      {/* Confirmation Dialogs */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {activeChat.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteContact}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmBlockOpen} onOpenChange={setConfirmBlockOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {activeChat.name}? They will not be able to send you messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmBlockOpen(false)}>Cancel</Button>
            <Button onClick={handleBlockContact}>Block</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmClearHistoryOpen} onOpenChange={setConfirmClearHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Chat History</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear the chat history with {activeChat.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmClearHistoryOpen(false)}>Cancel</Button>
            <Button onClick={handleClearChatHistory}>Clear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatWindow;
