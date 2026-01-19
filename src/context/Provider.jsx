import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export function PrivateRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  if (loading) return null;

  return token ? children : <Navigate to="/" />;
}
