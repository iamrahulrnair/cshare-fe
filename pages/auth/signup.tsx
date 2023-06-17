import type { NextPage } from 'next';
import { FormEvent, useContext, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { AuthContext } from '../../context/auth';
import { Error } from '../../components/utils/Error';
import { getFetcher } from '../../utils/axios/axios';
import { saveTokensAsCookie } from '../../utils/auth/cookie';

const Signup: NextPage = () => {
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
  const { setAuthUser } = useContext(AuthContext);

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
    const axiosInstance = getFetcher();
    try {
      const response = await toast.promise(
        axiosInstance.post('account/register/', {
          ...userDetails,
        }),
        {
          pending: 'Signing in...',
          success: {
            render: ({ data }: any) => {
              console.log(data);
              return `Hey there, Welcome to cshare.`;
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
      setAuthUser({
        isAuthenticated: true,
      });
      router.push('/');
    } catch (err: any) {
      setError({
        username: err.response.data.username,
        email: err.response.data.email,
        password: err.response.data.password,
        password2: err.response.data.password2,
      });
    }
  }

  return (
    <form className='container m-auto  flex flex-col justify-center items-center w-[50rem] h-[100%]'>
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
            className='input--primary'
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
            className='input--primary'
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
            className='input--primary'
            autoComplete='email'
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
            className='input--primary'
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
            className='input--primary'
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
            className='input--primary'
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
      <div className='mt-9 w-full flex gap-5 justify-start items-center mb-5'>
        <button
          className='btn btn--success mr-5'
          onClick={handleFormSubmit}
          type='submit'
        >
          Signup
        </button>
        <div className='flex gap-5'>
          <p className='cursor-pointer hover:text-color-purple-light underline underline-offset-4'>
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
