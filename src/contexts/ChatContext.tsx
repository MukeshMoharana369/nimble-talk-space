
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  isRead: boolean;
};

type Contact = {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  isOnline: boolean;
  isBlocked?: boolean;
};

type ChatContextType = {
  activeChat: Contact | null;
  contacts: Contact[];
  messages: Message[];
  setActiveChat: (contact: Contact | null) => void;
  sendMessage: (text: string) => void;
  addContact: (email: string) => Promise<void>;
  deleteContact: (contactId: string) => void;
  blockContact: (contactId: string) => void;
  clearChatHistory: (contactId: string) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Contact | null>(null);

  // Load mock contacts
  useEffect(() => {
    if (user) {
      // Mock contacts data
      const mockContacts: Contact[] = [
        {
          id: "usr_123456789",
          name: "Alex Johnson",
          email: "alex@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
          lastMessage: "Hey, how's it going?",
          lastMessageTime: Date.now() - 3600000, // 1 hour ago
          unreadCount: 1,
          isOnline: true,
        },
        {
          id: "usr_987654321",
          name: "Taylor Smith",
          email: "taylor@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
          lastMessage: "Can we schedule a meeting tomorrow?",
          lastMessageTime: Date.now() - 86400000, // 24 hours ago
          unreadCount: 0,
          isOnline: false,
        },
        {
          id: "usr_456789123",
          name: "Jamie Parker",
          email: "jamie@example.com",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
          lastMessage: "I sent you the document.",
          lastMessageTime: Date.now() - 172800000, // 48 hours ago
          unreadCount: 0,
          isOnline: true,
        },
      ];
      setContacts(mockContacts);
      
      // Load stored contacts if any
      const storedContacts = localStorage.getItem("chatContacts");
      if (storedContacts) {
        try {
          const parsedContacts = JSON.parse(storedContacts);
          setContacts([...mockContacts, ...parsedContacts]);
        } catch (e) {
          console.error("Error parsing stored contacts:", e);
        }
      }
    }
  }, [user]);

  // Load messages for active chat
  useEffect(() => {
    if (activeChat && user) {
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: "msg_" + Math.random().toString(36).substr(2, 9),
          senderId: user.id,
          receiverId: activeChat.id,
          text: "Hey there!",
          timestamp: Date.now() - 3600000, // 1 hour ago
          isRead: true,
        },
        {
          id: "msg_" + Math.random().toString(36).substr(2, 9),
          senderId: activeChat.id,
          receiverId: user.id,
          text: "Hi! How are you?",
          timestamp: Date.now() - 3540000, // 59 minutes ago
          isRead: true,
        },
        {
          id: "msg_" + Math.random().toString(36).substr(2, 9),
          senderId: user.id,
          receiverId: activeChat.id,
          text: "I'm good, thanks for asking. How about you?",
          timestamp: Date.now() - 3480000, // 58 minutes ago
          isRead: true,
        },
        {
          id: "msg_" + Math.random().toString(36).substr(2, 9),
          senderId: activeChat.id,
          receiverId: user.id,
          text: "Doing well! Just finishing up some work.",
          timestamp: Date.now() - 3420000, // 57 minutes ago
          isRead: true,
        },
      ];
      setMessages(mockMessages);
      
      // Load stored messages if any
      const chatKey = `chat_${user.id}_${activeChat.id}`;
      const storedMessages = localStorage.getItem(chatKey);
      if (storedMessages) {
        try {
          setMessages([...mockMessages, ...JSON.parse(storedMessages)]);
        } catch (e) {
          console.error("Error parsing stored messages:", e);
        }
      }
    }
  }, [activeChat, user]);

  // Send a new message
  const sendMessage = (text: string) => {
    if (!activeChat || !user) return;

    const newMessage: Message = {
      id: "msg_" + Math.random().toString(36).substr(2, 9),
      senderId: user.id,
      receiverId: activeChat.id,
      text,
      timestamp: Date.now(),
      isRead: false,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Update contact's last message
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === activeChat.id
          ? {
              ...contact,
              lastMessage: text,
              lastMessageTime: Date.now(),
            }
          : contact
      )
    );

    // Store message in local storage
    const chatKey = `chat_${user.id}_${activeChat.id}`;
    const storedMessages = localStorage.getItem(chatKey);
    const updatedMessages = storedMessages
      ? [...JSON.parse(storedMessages), newMessage]
      : [newMessage];
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));

    // Mock receiving a reply after a short delay
    setTimeout(() => {
      const replies = [
        "That's interesting!",
        "I see what you mean",
        "Thanks for letting me know",
        "I'll get back to you on that",
        "Sounds good to me",
      ];
      
      const replyMessage: Message = {
        id: "msg_" + Math.random().toString(36).substr(2, 9),
        senderId: activeChat.id,
        receiverId: user.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: Date.now(),
        isRead: false,
      };
      
      setMessages((prevMessages) => [...prevMessages, replyMessage]);
      
      // Update stored messages
      const updatedMessagesWithReply = [...updatedMessages, replyMessage];
      localStorage.setItem(chatKey, JSON.stringify(updatedMessagesWithReply));
    }, 2000);
  };

  // Add a new contact
  const addContact = async (email: string): Promise<void> => {
    // Check if contact already exists
    if (contacts.some((contact) => contact.email === email)) {
      throw new Error("Contact already exists");
    }

    // Create new contact
    const newContact: Contact = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      unreadCount: 0,
      isOnline: Math.random() > 0.5, // Randomly online or offline for demo
    };

    setContacts((prevContacts) => [...prevContacts, newContact]);

    // Store in local storage
    const storedContacts = localStorage.getItem("chatContacts");
    const updatedContacts = storedContacts
      ? [...JSON.parse(storedContacts), newContact]
      : [newContact];
    localStorage.setItem("chatContacts", JSON.stringify(updatedContacts));
  };

  // Delete contact
  const deleteContact = (contactId: string) => {
    // Remove from contacts list
    setContacts((prevContacts) => prevContacts.filter(contact => contact.id !== contactId));
    
    // If this was the active chat, clear it
    if (activeChat && activeChat.id === contactId) {
      setActiveChat(null);
    }
    
    // Update local storage
    const storedContacts = localStorage.getItem("chatContacts");
    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);
        const updatedStoredContacts = parsedContacts.filter((c: Contact) => c.id !== contactId);
        localStorage.setItem("chatContacts", JSON.stringify(updatedStoredContacts));
      } catch (e) {
        console.error("Error updating stored contacts:", e);
      }
    }
    
    // Clear chat history from local storage
    if (user) {
      const chatKey = `chat_${user.id}_${contactId}`;
      localStorage.removeItem(chatKey);
    }
  };
  
  // Block contact
  const blockContact = (contactId: string) => {
    setContacts((prevContacts) => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isBlocked: true } 
          : contact
      )
    );
    
    // Update local storage
    const storedContacts = localStorage.getItem("chatContacts");
    if (storedContacts) {
      try {
        const parsedContacts = JSON.parse(storedContacts);
        const updatedStoredContacts = parsedContacts.map((c: Contact) => 
          c.id === contactId ? { ...c, isBlocked: true } : c
        );
        localStorage.setItem("chatContacts", JSON.stringify(updatedStoredContacts));
      } catch (e) {
        console.error("Error updating stored contacts:", e);
      }
    }
  };
  
  // Clear chat history
  const clearChatHistory = (contactId: string) => {
    if (activeChat && activeChat.id === contactId) {
      setMessages([]);
    }
    
    // Clear from local storage
    if (user) {
      const chatKey = `chat_${user.id}_${contactId}`;
      localStorage.removeItem(chatKey);
    }
    
    // Update last message in contacts list
    setContacts((prevContacts) => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, lastMessage: undefined, lastMessageTime: undefined } 
          : contact
      )
    );
  };

  const value = {
    activeChat,
    contacts,
    messages,
    setActiveChat,
    sendMessage,
    addContact,
    deleteContact,
    blockContact,
    clearChatHistory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
