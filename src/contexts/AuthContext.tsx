
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("chatUser");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Simulate delay for loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Simulate login functionality
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll create a mock user
    const mockUser: User = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      isOnline: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUser(mockUser);
    localStorage.setItem("chatUser", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  // Simulate signup functionality
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      isOnline: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };
    
    setUser(mockUser);
    localStorage.setItem("chatUser", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("chatUser");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
