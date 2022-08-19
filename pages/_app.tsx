import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from 'next/app';
import axios from 'axios';
import '../styles/globals.scss';
import AuthContextProvider from '../context/utils/auth';

function MyApp({ Component, pageProps, authUser }: any) {
  return (
    <div>
      <AuthContextProvider>
        <Component {...pageProps} authUser={authUser} />
        <ToastContainer />
      </AuthContextProvider>
    </div>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const pageProps = await App.getInitialProps(appContext);
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/account/me', {
      withCredentials: true,
    });
    return {
      ...pageProps,
      authUser: { ...response.data, isAuthenticated: true },
    };
  } catch (err) {
    return {
      ...pageProps,
      authUser: { isAuthenticated: false },
    };
  }
};

export default MyApp;
