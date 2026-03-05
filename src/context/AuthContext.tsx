"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loginUser, registerUser, getCurrentUser, UserResponse } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

interface JWTPayload {
  user_id: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("clp_access_token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode<JWTPayload>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          getCurrentUser(decoded.user_id)
            .then(setUser)
            .catch(() => {
              localStorage.removeItem("clp_access_token");
              setToken(null);
            })
            .finally(() => setLoading(false));
        } else {
          localStorage.removeItem("clp_access_token");
          setLoading(false);
        }
      } catch {
        localStorage.removeItem("clp_access_token");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    localStorage.setItem("clp_access_token", data.clp_access_token);
    setToken(data.clp_access_token);
    const decoded = jwtDecode<JWTPayload>(data.clp_access_token);
    const userData = await getCurrentUser(decoded.user_id);
    setUser(userData);
  };

  const register = async (email: string, password: string, role: string) => {
    await registerUser({ email, password, role });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("clp_access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
