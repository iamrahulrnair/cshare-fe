import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';



import { AuthContext } from '../../../context/auth';
import { Error } from '../../../components/utils/Error';
import { CodeEditor } from '../../../components/code';
import { getFetcher } from '../../../utils/axios/axios';
import { GetServerSidePropsContext } from 'next';
import { ProtectedPageRoute } from '../../../utils/auth/session';
// import { ProtectedPageRoute } from '../../../utils/auth/session';

function App(pageProps: any) {
  const router = useRouter();
  const { isAuthenticated } = pageProps;
  const { setAuthUser } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthUser({ isAuthenticated: false });
      router.push(`/auth/login?next=/code/create`);
    }
    
  }, []);
  if (!isAuthenticated) {
    return null;
  }

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
      // router.push('/code');
    } catch (err: any) {
      console.log(err.response.data);
      setError({
        code: err.response.data.code || '',
        description: err.response.data.description || '',
      });
    }
  }

  return (
    <div className='mx-[120px] my-[auto] py-7 gap-7 flex flex-col'>
      <input
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
            className='min-w-[25rem] mb-3'
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
        <button className='mx-5 btn btn--success' onClick={handleCodeSubmit}>
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
