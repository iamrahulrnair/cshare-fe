import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';

import '../styles/globals.scss';
import AuthContextProvider from '../context/utils/auth';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <AuthContextProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </AuthContextProvider>
    </div>
  );
}

export default MyApp;
