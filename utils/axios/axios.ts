import axios from 'axios';
import { NextRequest } from 'next/server';
import { parseCookies, saveTokensAsCookie } from '../auth/cookie';
import { IncomingMessage } from 'http';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;

export const getFetcher = (
  req:
    | (IncomingMessage & {
        cookies: Partial<{
          [key: string]: string;
        }>;
      })
    | null = null,
  protectedRoute = true
) => {
  // parseCookie handles ssr csr issue
  const cookieData = parseCookies(req);
  const access_token = cookieData.access_token;
  const refresh_token = cookieData.refresh_token;
  const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
      ...(protectedRoute
        ? {
            Authorization: access_token ? 'Bearer ' + access_token : '',
          }
        : {}),

      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  axiosInstance.interceptors.request.use((request) => {
    request.withCredentials = true;
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (originalRequest.url == 'account/me/') {
        return Promise.reject(error);
      }
      if (typeof error.response === 'undefined') {
        alert(
          'A server/network error occurred. ' +
            'Sorry about this - we will get it fixed shortly.'
        );
        return Promise.reject(error);
      }
      if (
        error.response.data.code === 'token_not_valid' &&
        error.response.status === 401 &&
        error.response.statusText === 'Unauthorized'
      ) {
        if (refresh_token) {
          const token_parts = JSON.parse(atob(refresh_token.split('.')[1]));
          const now = Math.ceil(Date.now() / 1000);
          if (token_parts.exp > now) {
            return axiosInstance
              .post('/account/token/refresh/', {
                refresh: refresh_token,
              })
              .then((response) => {
                // either move the user to login in ssr or pass token,
                //  to the header till a csr raise a request

                originalRequest.headers[
                  'Authorization'
                ] = `Bearer ${response.data.access}`;

                if (typeof window == 'undefined') {
                  // Cannot handle redirect in server side for axios instance
                  return Promise.reject(error);
                } else {
                  const access_token = response.data.access;
                  saveTokensAsCookie({ access_token });
                  return axiosInstance(originalRequest);
                }
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          } else {
            console.log('Refresh token is expired', token_parts.exp, now);
            return Promise.reject('Refresh token is expired');
          }
        } else {
          console.log('Refresh token not available.');
          return Promise.reject('Refresh token not available.');
        }
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};
