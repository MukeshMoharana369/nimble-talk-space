import { useState } from "react";
import { Search, Plus, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const ContactList = ({ onMenuToggle }: { onMenuToggle?: () => void }) => {
  const { contacts, setActiveChat, addContact } = useChat();
  const [search, setSearch] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddContact = async () => {
    try {
      await addContact(newContactEmail);
      toast({
        title: "Contact added",
        description: "The contact has been added successfully",
      });
      setNewContactEmail("");
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this week, show day name
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show short date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-3 flex items-center justify-between border-b">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu size={20} />
          </Button>
        )}
        <h2 className="text-lg font-semibold flex-1 text-center">Chats</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus size={20} />
              <span className="sr-only">Add contact</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleAddContact}>Add Contact</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          <div className="divide-y">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => setActiveChat(contact)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={contact.avatar || "https://via.placeholder.com/40"}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                    contact.isOnline ? "bg-online" : "bg-offline"
                  )}></span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(contact.lastMessageTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate pr-2">
                      {contact.lastMessage || "No messages yet"}
                    </p>
                    {contact.unreadCount > 0 && (
                      <Badge variant="default" className="rounded-full">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No contacts found
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
