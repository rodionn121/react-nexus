import { createContext, useEffect, useState, useCallback } from "react";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. Carrega o token inicial
  useEffect(() => {
    const storedToken = localStorage.getItem("token_nexus");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // 2. Verifica se é Admin sempre que o token mudar
  useEffect(() => {
    async function verificacaoAdm() {
      // Se não houver token, garante que isAdmin é false e sai
      if (!token) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const res = await fetch("https://backend-nexus-md0p.onrender.com/usuario/admin", {
          method: 'GET', // Fora dos headers
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setIsAdmin(data.is_admin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erro na verificação de Admin:", error);
        setIsAdmin(false);
      }
    }

    verificacaoAdm();
  }, [token]); // IMPORTANTE: Só executa quando o token muda

  function login(accessToken) {
    localStorage.setItem("token_nexus", accessToken);
    setToken(accessToken);
  }

  function logout() {
    localStorage.removeItem("token_nexus");
    setToken(null);
    setIsAdmin(false);
  }

  return (
    // Adicionei isAdmin e loading aqui para poderes usar no resto da app
    <AuthContext.Provider value={{ token, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}