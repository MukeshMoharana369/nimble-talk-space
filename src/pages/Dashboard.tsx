
import { useState } from "react";
import ContactList from "@/components/ContactList";
import ChatWindow from "@/components/ChatWindow";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const ProfileDialog = () => {
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState("I love chatting with friends!");
    const [status, setStatus] = useState(true);

    const handleSave = () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email}
                disabled
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status">Status:</Label>
              <div className="flex items-center space-x-1">
                <span className={`w-3 h-3 rounded-full ${status ? 'bg-online' : 'bg-offline'}`}></span>
                <span>{status ? 'Online' : 'Offline'}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setStatus(!status)}
                className="ml-auto"
              >
                Toggle
              </Button>
            </div>
            <Button className="w-full" onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
          )}
          <h1 className="text-xl font-bold">ChatApp</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full h-9 w-9 p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ProfileDialog />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      
      <main className="flex-1 flex overflow-hidden">
        {isMobile ? (
          <>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetContent side="left" className="p-0 w-[80%] sm:w-[350px]">
                <ContactList onMenuToggle={() => setIsSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex-1">
              <ChatWindow />
            </div>
          </>
        ) : (
          <>
            <div className="w-[350px] flex-shrink-0">
              <ContactList />
            </div>
            <div className="flex-1">
              <ChatWindow />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
