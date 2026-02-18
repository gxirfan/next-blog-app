"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "@/api/axios";

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  bio: string;
  isEmailVerified: boolean;
  isEmailPublic: boolean;
  role: string;
  gender: string;
  location: string;
  birthDate: Date;
  avatar: string;
  cover: string;
  status: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  register: (userData: UserProfile) => void;
  login: (userData: UserProfile) => void;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/auth/status");

      if (response.data && response.data.data) {
        setUser(response.data.data.user as UserProfile);
      }
    } catch (_error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback((userData: UserProfile) => {
    setUser(userData);
  }, []);

  const register = useCallback((userData: UserProfile) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (_error) {
      // Optionally log the error for debugging
      // console.error("Logout error:", _error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = { user, isLoading, login, logout, checkAuthStatus, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
