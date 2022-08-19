import React, { useState, createContext } from 'react';

export const AuthContext = createContext<any>({});

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [csrf, setCsrf] = useState(null);
  const [authUser, setAuthUser] = useState({});

  const state = {
    csrf,
    setCsrf,
    authUser,
    setAuthUser,
  };
  return (
    <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>
  );
}
