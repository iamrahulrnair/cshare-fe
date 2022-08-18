import React, { useState, createContext } from 'react';

export const AuthContext = createContext<any>({});

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [csrf, setCsrf] = useState(null);
  const state = {
    csrf,
    setCsrf,
  };
  return (
    <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>
  );
}
