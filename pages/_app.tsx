import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../components/Navbar';
import 'antd/dist/antd.css';
import '../styles/globals.scss';
import AuthContextProvider from '../context/auth';
import { Divider } from 'antd';

function MyApp({ Component, pageProps }: any) {
  return (
    <AuthContextProvider>
      <Navbar />
      <div className='w-[1400px] my-0 mx-auto min-h-[100vh]'>
        <Component {...pageProps} />
      </div>
      <Divider>
        <p className='text-center text-gray-500'>
          © 2021 <span className='text-gray-900 bold'>Cshare</span>
        </p>
      </Divider>

      <ToastContainer />
    </AuthContextProvider>
  );
}

export default MyApp;
