import React, { useContext, useEffect } from 'react';
import { getFetcher } from '../../utils/axios/axios';
import { clearAuthCookies, parseCookies } from '../../utils/auth/cookie';
import { AuthContext } from '../../context/auth';
import { useRouter } from 'next/router';

function Logout() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    const { refresh_token: refresh } = parseCookies();
    (async () => {
      try {
        const axiosInstance = getFetcher();
        const res = await axiosInstance.post('account/logout/', {
          refresh,
        });
        clearAuthCookies();
        window.location.href = '/';
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  return <h1>Signing out...</h1>;
}

export default Logout;
