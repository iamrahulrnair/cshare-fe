import { useState, useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { getCookie } from '../../../utils/auth';
import { AuthContext } from '../../../context/utils/auth';
import { Error } from '../../../components/utils/Error';
import CodeEditor from '../../../components/CodeEditor';

function App() {
  const { csrf, setCsrf } = useContext(AuthContext);
  const [check, setCheck] = useState(false);
  const [error, setError] = useState<any>({
    code: '',
    description: '',
  });

  useEffect(() => {
    (async () => {
      await axios.get('http://127.0.0.1:8000/api/account/csrf/', {
        withCredentials: true,
      });
      setCsrf(getCookie('csrftoken'));
    })();
  }, []);

  const router = useRouter();

  const [codeDetails, setCodeDetails] = useState<any>({
    extension: '',
    description: '',
    code: undefined,
    is_public: check,
  });
  function handleCodeUpdate(e: any) {
    setError({ code: '', description: '' });
    if (e.target) {
      const { name, value } = e.target;
      setCodeDetails({
        ...codeDetails,
        [name]: value,
      });
    } else {
      setCodeDetails({ ...codeDetails, code: e == '' ? undefined : e });
    }
  }
  async function handleCodeSubmit(e: any) {
    e.preventDefault();

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/code/',
        {
          ...codeDetails,
          code: JSON.stringify(codeDetails.code),
          is_public: check,
        },
        {
          withCredentials: true,
          headers: { 'X-CSRFToken': csrf },
        }
      );
      router.push('/');
    } catch (err: any) {
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
            className='w-[200px]'
          />
        </div>
        <CodeEditor
          handleCodeUpdate={handleCodeUpdate}
          codeDetails={codeDetails}
          height={'200px'}
        />
      </div>
      {!_.isEmpty(error.code) && <Error msg={error.code} />}
      <div className='self-end'>
        <label htmlFor='code'>
          Note: This is will be a &nbsp;
          <span className='font-extrabold'>
            {!check ? 'private' : 'public'}
          </span>
          &nbsp; code block, click below to set it &nbsp;
          <span className='font-extrabold'>
            {!check ? 'public' : 'private'}
          </span>
          &nbsp;
        </label>
        <input
          className='mx-5'
          id='code'
          name='is_public'
          onChange={() => setCheck(!check)}
          type='checkbox'
          checked={check}
        ></input>
        <button className='mx-5' onClick={handleCodeSubmit}>
          Contribute to cshare
        </button>
      </div>
    </div>
  );
}

export default App;
