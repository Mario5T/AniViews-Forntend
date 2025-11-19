import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({ user: null, token: null, login: ()=>{}, logout: ()=>{} });

const storageKey = 'aniviews_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const { user, token } = JSON.parse(raw);
        setUser(user || null);
        setToken(token || null);
      }
    } catch {}
  }, []);

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(storageKey, JSON.stringify({ user: data.user, token: data.token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(storageKey);
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}
