import { createContext, useCallback, useEffect, useState } from "react";
import { signin, signup, getCurrentUser } from "@/api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, email, roles }
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("aerocart_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await getCurrentUser();
      setUser(me);
    } catch {
      localStorage.removeItem("aerocart_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async ({ email, password }) => {
    const token = await signin({ email, password });
    localStorage.setItem("aerocart_token", token);
    await loadUser();
  };

  const register = async ({ username, email, password }) => {
    await signup({ username, email, password });
  };

  const logout = () => {
    localStorage.removeItem("aerocart_token");
    setUser(null);
  };

  const isAdmin = !!user?.roles?.includes("Admin");

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, login, register, logout, refresh: loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
