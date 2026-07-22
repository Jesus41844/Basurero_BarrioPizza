"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  puntos: number;
  rol?: string;
}

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isStaff: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string, nombre: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const fetchUser = useCallback(async (jwt: string) => {
    try {
      const res = await fetch(`${API}/api/v1/client/wallet`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.usuario || data;
      }
    } catch { /* ignore */ }
    return null;
  }, []);

  const login = useCallback(async (email: string) => {
    const res = await fetch(`${API}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al iniciar sesión");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));
    setToken(data.token);
    setUser(data.usuario);
  }, []);

  const register = useCallback(async (email: string, nombre: string) => {
    const res = await fetch(`${API}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al registrarse");
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.usuario));
    setToken(data.token);
    setUser(data.usuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const data = await fetchUser(token);
    if (data) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    }
  }, [token, fetchUser]);

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isStaff: user?.rol === "staff",
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
