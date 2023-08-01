import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/auth';
import { getFetcher } from '../../../utils/axios';
import {
  clearAuthCookies,
  clearOAuthCookies,
  parseCookies,
  saveTokensAsCookie,
} from '../../../utils/auth/cookie';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

function OAuthComplete() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const _cookie = parseCookies();
    const token =
      _cookie.token?.replace(/\\054/g, ',').replaceAll('\\', '') || `{}`;
    const { access_token, refresh_token } = JSON.parse(token);
    console.log({token});
    

    if (access_token && refresh_token) {
      clearAuthCookies();
      saveTokensAsCookie({
        access_token,
        refresh_token,
      });
      const axiosInstance = getFetcher();
      axiosInstance
        .get('account/me/')
        .then((response) => {
          setAuthUser({ ...response.data, isAuthenticated: true });
          clearOAuthCookies();
          router.push('/');
        })

        .catch((err) => {
          console.log("here");
          
          console.log(err);
          
          setAuthUser({ isAuthenticated: false });
          router.push('/auth/login');
        });
    } else {
      console.log("there");

      setAuthUser({ isAuthenticated: false });
      toast.error('Invalid authentication');
      router.push('/auth/login');
    }
  }, []);
  return (
    <div>
      <h3 className='text-3xl'>Redirecting...</h3>
      <p>
        If the Browser not redirected click{' '}
        <span
          onClick={() => router.push('/')}
          className='underline text-blue-400 cursor-pointer'
        >
          here to continue
        </span>
      </p>
    </div>
  );
}

export default OAuthComplete;
