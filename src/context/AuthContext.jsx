import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // carrega token ao iniciar a app
  useEffect(() => {
    const storedToken = localStorage.getItem("token_nexus");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  function login(accessToken) {
    localStorage.setItem("token_nexus", accessToken);
    setToken(accessToken);
  }

  function logout() {
    localStorage.removeItem("token_nexus");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
