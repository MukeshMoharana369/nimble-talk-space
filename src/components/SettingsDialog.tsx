
import { useState, useEffect } from "react";
import { Settings, Moon, Sun, BellRing, BellOff, Shield, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ isOpen, onOpenChange }: SettingsDialogProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [privacy, setPrivacy] = useState("friends");
  const { toast } = useToast();

  // Apply dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSaveSettings = () => {
    // In a real app, this would persist settings to the backend
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sounds for notifications and messages</p>
              </div>
              <Switch 
                id="sound-effects" 
                checked={soundEffects} 
                onCheckedChange={setSoundEffects}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {notifications ? <BellRing className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <Label htmlFor="notifications">Enable Notifications</Label>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications} 
                onCheckedChange={setNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="read-receipts">Read Receipts</Label>
                <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
              </div>
              <Switch 
                id="read-receipts" 
                checked={readReceipts} 
                onCheckedChange={setReadReceipts}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <Label>Who can contact you</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={privacy === "everyone" ? "default" : "outline"} 
                  onClick={() => setPrivacy("everyone")}
                  size="sm"
                >
                  Everyone
                </Button>
                <Button 
                  variant={privacy === "friends" ? "default" : "outline"} 
                  onClick={() => setPrivacy("friends")}
                  size="sm"
                >
                  Friends Only
                </Button>
                <Button 
                  variant={privacy === "none" ? "default" : "outline"} 
                  onClick={() => setPrivacy("none")}
                  size="sm"
                >
                  No One
                </Button>
              </div>
            </div>
            
            <div className="pt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <Label>About Your Data</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. We never share your personal information with third parties.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Download My Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveSettings}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
