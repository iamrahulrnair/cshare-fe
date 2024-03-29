import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { AuthContext } from '../../../context/auth';
import { Error } from '../../../components/utils/Error';
import { CodeEditor } from '../../../components/code';
import { getFetcher } from '../../../utils/axios/axios';
import { GetServerSidePropsContext } from 'next';
import { ProtectedPageRoute } from '../../../utils/auth/session';
import { toast } from 'react-toastify';
// import { ProtectedPageRoute } from '../../../utils/auth/session';

function App(pageProps: any) {
  const router = useRouter();
  const { isAuthenticated,setUserVerified } = pageProps;
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [error, setError] = useState<any>({
    code: '',
    description: '',
  });
  const [codeDetails, setCodeDetails] = useState<any>({
    extension: '',
    description: '',
    code: undefined,
    is_public: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthUser({ isAuthenticated: false });
      router.push(`/auth/login?next=/code/create`);
    }
  }, []);
  useEffect(() => {
    if (authUser.isAuthenticated) {
      if (authUser.is_verified) {
        setUserVerified(true);
      } else {
        setUserVerified(false);
      }
    }
  }, [authUser]);
  if (!isAuthenticated) {
    return null;
  }

  function handleCodeUpdate(e: any) {
    setError({ code: '', description: '' });
    if (e.target) {
      const { name, value, checked } = e.target;

      setCodeDetails({
        ...codeDetails,
        [name]: value,
        is_public: name == 'is_public' ? checked : codeDetails.is_public,
      });
    } else {
      setCodeDetails({
        ...codeDetails,
        code: e == '' ? undefined : e,
      });
    }
  }
  async function handleCodeSubmit(e: any) {
    e.preventDefault();
    try {
      const axiosInstance = getFetcher();
      await axiosInstance.post('code/', codeDetails);
      // await axiosInstance.post('code', codeDetails);
      toast.success('Code block created successfully');
      router.push('/');
    } catch (err: any) {
      console.log(err.response.data);
      setError({
        code: err.response.data.code || '',
        description: err.response.data.description || '',
      });
    }
  }

  return (
    <div className='sm:w-[120rem] mx-10 my-[auto] py-7 gap-7 flex flex-col'>
      <input
        className='input--primary'
        name='description'
        onChange={handleCodeUpdate}
        value={codeDetails.description}
        placeholder='Code description...'
        type='text'
      />
      {!_.isEmpty(error.description) && <Error msg={error.description} />}
      <div className='w-[100%] h-[100%]'>
        <div className=' bg-slate-400 px-3 py-4 rounded-t-md'>
          <input
            type='text'
            name='extension'
            onChange={handleCodeUpdate}
            value={codeDetails.extension}
            placeholder='Filename including extension...'
            className='min-w-[25rem] mb-3 input--primary'
          />
        </div>
        <CodeEditor
          handleCodeUpdate={handleCodeUpdate}
          codeDetails={codeDetails}
          height={'200px'}
        />
      </div>
      {!_.isEmpty(error.code) && <Error msg={error.code} />}
      <div className='flex items-center  self-end'>
        <label htmlFor='code'>
          Note: This is will be a &nbsp;
          <span className='font-extrabold'>
            {!codeDetails.is_public ? 'private' : 'public'}
          </span>
          &nbsp; code block, click below to set it &nbsp;
          <span className='font-extrabold'>
            {!codeDetails.is_public ? 'public' : 'private'}
          </span>
          &nbsp;
        </label>
        <input
          className='mx-5'
          id='code'
          name='is_public'
          onChange={handleCodeUpdate}
          type='checkbox'
        ></input>
        <button
          disabled={authUser.is_verified == false}
          className='mx-5 btn btn--success'
          onClick={handleCodeSubmit}
        >
          Contribute to cshare
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return ProtectedPageRoute(ctx, null, null);
};

export default App;
