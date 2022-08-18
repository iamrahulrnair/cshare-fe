import type { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import { AuthContext } from '../../context/utils/auth';
import { getCookie } from '../../utils/auth';

function handleFormSubmit(e: FormEvent) {
  // e.preventDefault();
  // toast.success('Logged in ');
}

const Login: NextPage = () => {
  const { csrf, setCsrf } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const res = await axios.get('http://127.0.0.1:8000/api/account/csrf', {
        withCredentials: true,
      });
      setCsrf(getCookie('csrftoken'));
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
            <input type='text' id='email' name='email' />
          </div>
          <div className='flex flex-col justify-between my-5 space-y-4'>
            <label htmlFor='pwd'>Password</label>
            <input type='password' id='password' name='pwd' />
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
