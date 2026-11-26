import api from "@/api/axios/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Role {
  _id: string;
  name: string;
  value: string;
}

interface AdminUser {
  _id: string;
  email: string;
  storeName: string;
  fcmToken: string | null;
  roleId: Role;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  adminRoleId: string;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem("adminUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => Boolean(localStorage.getItem("accessToken")),
  );

  // Fallback default Admin roleId aapke API response ke hisaab se
  const [adminRoleId, setAdminRoleId] = useState<string>(
    "6b051799cd5bc6c21fc72f45",
  );

  // App load hone par /seed/getroles se Admin roleId fetch karna
  const fetchAdminRoleId = async (): Promise<string> => {
    try {
      const res = await api.get<Role[]>("/seed/getroles");
      const adminRole = res.data.find((r) => r.value === "admin");
      if (adminRole?._id) {
        setAdminRoleId(adminRole._id);
        return adminRole._id;
      }
    } catch (err) {
      console.error("Failed to fetch roles, using default admin roleId:", err);
    }
    return adminRoleId;
  };

  useEffect(() => {
    fetchAdminRoleId();
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    const roleId = adminRoleId || (await fetchAdminRoleId());

    const response = await api.post("/admin/loginadmin", {
      email,
      password,
      roleId,
    });

    // Dono formats handle karega (direct accessToken ya tokens.accessToken)
    const accessToken =
      response.data?.accessToken || response.data?.tokens?.accessToken;
    const refreshToken =
      response.data?.refreshToken || response.data?.tokens?.refreshToken;
    const userData = response.data?.data || response.data?.admin;

    if (!accessToken) {
      throw new Error("Token not received from login API");
    }

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    if (userData) {
      localStorage.setItem("adminUser", JSON.stringify(userData));
    }
    localStorage.setItem("isAuthenticated", "true");

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("isAuthenticated");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, adminRoleId, loginAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}