import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../services/movieService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authApi.getSession());

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login(email, password) {
        const nextSession = authApi.login(email, password);
        setSession(nextSession);
        return nextSession;
      },
      register(payload) {
        const nextSession = authApi.register(payload);
        setSession(nextSession);
        return nextSession;
      },
      logout() {
        authApi.logout();
        setSession(null);
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
