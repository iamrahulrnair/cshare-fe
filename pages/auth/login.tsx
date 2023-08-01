import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import _ from 'lodash';

import { Error } from '../../components/utils/Error';
import { useRouter } from 'next/router';
import { getFetcher } from '../../utils/axios/axios';
import { saveTokensAsCookie } from '../../utils/auth/cookie';
import { AuthContext } from '../../context/auth';
import { GithubOutlined, LoadingOutlined } from '@ant-design/icons';

const Login: NextPage = () => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [oAuthStarted, setOAuthStarted] = useState(false);
  const [error, setError] = useState<{
    email: string | undefined;
    password: string | undefined;
    message: string | undefined;
  }>({
    email: undefined,
    password: undefined,
    message: undefined,
  });

  const { authUser, setAuthUser } = useContext(AuthContext);
  const router = useRouter();

  function updateUserState(e: any) {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  }
  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    const axiosInstance = getFetcher();

    try {
      const response = await toast.promise(
        axiosInstance.post('account/token/', userDetails),
        {
          pending: 'logging in...',
          success: {
            render: ({ data }: any) => {
              return 'Login successful';
            },
          },
          error: 'Something went wrong',
        },
        {
          pauseOnHover: false,
        }
      );
      const { access: access_token, refresh: refresh_token } = response.data;

      saveTokensAsCookie({
        access_token,
        refresh_token,
      });
      setAuthUser({ isAuthenticated: true });
      router.push((router.query.next as string) || '/');
    } catch (err: any) {
      setError({
        email: err.response.data.email || '',
        password: err.response.data.password || '',
        message: err.response.data.detail || '',
      });
    }
  }
  async function handleSocialLogin() {
    try {
      setOAuthStarted(true);
      window.location.href = process.env.NEXT_PUBLIC_OAUTH_URL as string;
    } catch (err) {
      console.log(err);
      toast.error('social authentication failed');
      setOAuthStarted(false);
    }
  }

  return (
      <form className='md:w-[50rem] md:p-0 md:h-[85vh] h-[50rem] flex flex-col justify-center items-center'>
        <div>
          <h1 className='text-4xl sm:text-5xl'>Login to share code.</h1>
        </div>
        <div className='flex flex-col w-[70%]'>
          <div className='flex flex-col justify-between my-5 space-y-4'>
            <label htmlFor='email'>Email</label>
            <input
              onChange={updateUserState}
              value={userDetails.email}
              type='text'
              id='email'
              name='email'
              className='input--primary w-full'
            />
            {!_.isEmpty(error) && <Error msg={error.email} />}
          </div>
          <div className='flex flex-col justify-between my-5 space-y-4'>
            <label htmlFor='pwd'>Password</label>
            <input
              onChange={updateUserState}
              value={userDetails.password}
              type='password'
              id='password'
              name='password'
              className='input--primary w-full'
            />
            {!_.isEmpty(error) && <Error msg={error.password} />}
            {!_.isEmpty(error) && <Error msg={error.message} />}
          </div>
        </div>
        <div className='mt-5 flex flex-col gap-5 justify-start items-center'>
          <div className='flex gap-5 mb-5'>
          <button
            className='btn btn--success'
            onClick={handleFormSubmit}
            type='submit'
          >
            Login
          </button>
          <button
            className='btn btn--success hover:bg-gray-900 hover:text-gray-100'
            onClick={handleSocialLogin}
            type='button'
          >
            <span>
              {oAuthStarted ? (
                <LoadingOutlined />
              ) : (
                <GithubOutlined className='text-3xl' />
              )}
            </span>
          </button>
          </div>
          <div className='gap-5 flex'>
            <p className='cursor-pointer hover:text-green-800 underline underline-offset-4'>
              forgot password ?
            </p>
            <span>|</span>
            <Link href='/auth/signup'>
              <p className='cursor-pointer hover:text-green-800 underline underline-offset-4'>
                signup ?
              </p>
            </Link>
          </div>
        </div>
      </form>
  );
};
export default Login;
