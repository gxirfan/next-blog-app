"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "@/api/axios";
import { IUserResponse } from "@/app/types/user-response.dto";

interface AuthContextType {
  user: IUserResponse | null;
  isLoading: boolean;
  login: (userData: IUserResponse) => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialUser, // Sunucudan gelen ilk veri
}: {
  children: React.ReactNode;
  initialUser: IUserResponse | null;
}) => {
  const [user, setUser] = useState<IUserResponse | null>(initialUser);
  // SSR verisi varsa loading false, yoksa true başlar
  const [isLoading, setIsLoading] = useState(!initialUser);

  const checkAuthStatus = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/status");
      if (data?.data?.user) setUser(data.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hydration sonrası veriyi bir kez tazele (isteğe bağlı)
  useEffect(() => {
    if (!initialUser) {
      checkAuthStatus();
    }
  }, [initialUser, checkAuthStatus]);

  const login = (userData: IUserResponse) => setUser(userData);
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
