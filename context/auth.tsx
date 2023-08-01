import React, { useState, createContext, useEffect } from 'react';
import { getFetcher } from '../utils/axios/axios';
import { clearAuthCookies } from '../utils/auth/cookie';
interface AuthUser {
  isAuthenticated: boolean | null;
  email?: string;
  username?: string;
  id?: number;
  image?: string;
  is_verified?: boolean;
}

export const AuthContext = createContext<{
  authUser: AuthUser;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser>>;
}>({
  authUser: {
    isAuthenticated: null,
  },
  setAuthUser: () => null,
});

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
        clearAuthCookies()
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
