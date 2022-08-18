import type { NextPage } from 'next';
import { FormEvent, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import Link, { LinkProps } from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { getCookie } from '../../utils/auth';
import { AuthContext } from '../../context/utils/auth';
import { Error } from '../../components/utils/Error';

const Signup: NextPage = () => {
  const { csrf, setCsrf } = useContext(AuthContext);
  const [error, setError] = useState<{
    email: string | undefined;
    username: string | undefined;
    password: string | undefined;
    password2: string | undefined;
  }>({
    email: undefined,
    username: undefined,
    password: undefined,
    password2: undefined,
  });
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await axios.get('http://127.0.0.1:8000/api/account/csrf', {
        withCredentials: true,
      });
      setCsrf(getCookie('csrftoken'));
    })();
  }, []);

  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
    password2: '',
    username: '',
    first_name: '',
    last_name: '',
  });

  function updateUserState(e: any) {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  }

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    setError({
      email: undefined,
      username: undefined,
      password: undefined,
      password2: undefined,
    });
    try {
      const response = await toast.promise(
        axios.request({
          method: 'POST',
          url: 'http://127.0.0.1:8000/api/account/register/',
          withCredentials: true,
          data: userDetails,
          headers: {
            'X-CSRFToken': csrf,
          },
        }),
        {
          pending: 'Signing in...',
          success: {
            render: ({ data }: any) => {
              router.push('/auth/login');
              return `Hey there ${
                data.data.first_name || 'POI'
              }, Welcome to cshare.`;
            },
          },
          error: 'Something went wrong',
        }
      );
    } catch (err: any) {
      setError({
        username: err.response.data.username,
        email: err.response.data.email,
        password: err.response.data.password,
        password2: err.response.data.password2,
      });
    }
  }
  console.log(error);

  return (
    <form className='container m-auto h-screen flex flex-col justify-center items-center w-[50rem]'>
      <div>
        <h1 className='text-center'>Signup to share code.</h1>
      </div>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col justify-between my-5 space-y-4'>
          <label htmlFor='fname'>
            First name
            <span className='subscript'>(optional)</span>
          </label>
          <input
            value={userDetails.first_name}
            onChange={updateUserState}
            type='text'
            id='fname'
            name='first_name'
          />
        </div>
        <div className='flex flex-col justify-between my-5 space-y-4'>
          <label htmlFor='lname'>
            Last name<span className='subscript'>(optional)</span>
          </label>
          <input
            onChange={updateUserState}
            type='text'
            id='lname'
            name='last_name'
            value={userDetails.last_name}
          />
        </div>
        <div className='flex flex-col justify-between my-5 space-y-4'>
          <label htmlFor='uname'>Username </label>
          <input
            autoComplete='username'
            value={userDetails.username}
            onChange={updateUserState}
            type='text'
            id='uname'
            name='username'
          />
          {!_.isEmpty(error) && <Error msg={error.username} />}
        </div>
        <div className='flex flex-col justify-between my-5 space-y-4'>
          <label htmlFor='email'>Email</label>
          <input
            value={userDetails.email}
            onChange={updateUserState}
            type='text'
            id='email'
            name='email'
          />
          {!_.isEmpty(error) && <Error msg={error.email} />}
        </div>
        <div className='flex flex-col justify-between my-5 space-y-4'>
          <label htmlFor='pwd1'>Password </label>
          <input
            autoComplete='new-password'
            value={userDetails.password}
            onChange={updateUserState}
            type='password'
            id='pwd1'
            name='password'
          />
          {!_.isEmpty(error) && <Error msg={error.password} />}
        </div>
        <div className='flex flex-col justify-between my-5 space-y-4'>
          <label htmlFor='pwd2'>Confirm password</label>
          <input
            autoComplete='new-password'
            value={userDetails.password2}
            onChange={updateUserState}
            type='password'
            id='pwd2'
            name='password2'
          />
          {!_.isEmpty(error) && <Error msg={error.password2} />}
        </div>
      </div>
      <div className=' w-full flex gap-5 justify-start items-center'>
        <button onClick={handleFormSubmit} type='submit'>
          Signup
        </button>
        <div className='flex gap-5'>
          <p className='cursor-pointer hover:text-green-800 underline underline-offset-4'>
            forgot password ?
          </p>
          <span>|</span>
          <Link href='/auth/login'>
            <p className='cursor-pointer hover:text-green-800 underline underline-offset-4'>
              login ?
            </p>
          </Link>
        </div>
      </div>
    </form>
  );
};
export default Signup;
