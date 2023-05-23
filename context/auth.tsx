import React, { useState, createContext, useEffect } from 'react';
import { getFetcher } from '../utils/axios/axios';

export const AuthContext = createContext<any>({});

interface AuthUser {
  isAuthenticated: boolean | null;
  email?: string;
  username?: string;
  id?: number;
}

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authUser, setAuthUser] = useState<AuthUser>({
    isAuthenticated: null,
  });

  useEffect(() => {
    const axiosInstance = getFetcher();
    axiosInstance
      .get('account/me/')
      .then((response) => {
        setAuthUser({ ...response.data, isAuthenticated: true });
      })
      .catch((err) => {
        setAuthUser({ isAuthenticated: false });
      });
  }, [authUser.isAuthenticated]);

  const state = {
    authUser,
    setAuthUser,
  };

  return (
    <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>
  );
}
