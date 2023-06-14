import React, { useState, createContext, useContext, FC } from "react";

type User = {
  username: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    // Mock user data for login
    if (username === "user@gmail.com" && password === "password") {
      setIsLoggedIn(true);
      setUser({ username });
      const token ="test-token";
      localStorage.setItem('token', token);
    } else {
      alert("Invalid username or password");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
