import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import _ from 'lodash';

import { Error } from '../../components/utils/Error';
import { AuthContext } from '../../context/utils/auth';
import { getCookie } from '../../utils/auth';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<{
    email: string | undefined;
    password: string | undefined;
    message: string | undefined;
  }>({ email: undefined, password: undefined, message: undefined });

  const { csrf, setCsrf } = useContext(AuthContext);

  const router = useRouter();
  function updateUserState(e: any) {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  }
  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      await toast.promise(
        axios.post('http://127.0.0.1:8000/api/account/login/', userDetails, {
          withCredentials: true,
          headers: { 'X-CSRFToken': csrf },
        }),
        {
          pending: 'logging in...',
          success: {
            render: ({ data }: any) => {
              setCsrf(getCookie('csrftoken'));
              return 'Login successful';
            },
          },
          error: 'Something went wrong',
        },
        {
          pauseOnHover: false,
        }
      );
      router.push('/');
    } catch (err: any) {
      setError({
        email: err.response.data.email,
        password: err.response.data.password,
        message: err.response.data.message,
      });
    }
  }
  useEffect(() => {
    (async () => {
      await axios.get('http://127.0.0.1:8000/api/account/csrf', {
        withCredentials: true,
      });
      setCsrf(getCookie('csrftoken'));
      console.log(csrf);
    })();
  }, []);

  return (
    <div className='m-auto h-screen flex justify-center items-center'>
      <form className=' w-[50rem]'>
        <div>
          <h1 className='text-center'>Login to share code.</h1>
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex flex-col justify-between my-5 space-y-4'>
            <label htmlFor='email'>Email</label>
            <input
              onChange={updateUserState}
              value={userDetails.email}
              type='text'
              id='email'
              name='email'
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
            />
            {!_.isEmpty(error) && <Error msg={error.password} />}
            {!_.isEmpty(error) && <Error msg={error.message} />}
          </div>
        </div>
        <div className='mt-5 flex gap-5 justify-start items-center'>
          <button onClick={handleFormSubmit} type='submit'>
            Login
          </button>
          <div className='flex gap-5'>
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
    </div>
  );
};
export default Login;
