import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from 'next/app';
import axios from 'axios';

import Navbar from '../components/Navbar';
import 'antd/dist/antd.css';
import '../styles/globals.scss';
import AuthContextProvider from '../context/utils/auth';

function MyApp({ Component, pageProps, authUser }: any) {
  return (
    <div>
      <AuthContextProvider>
        <Navbar authUser={authUser} />
        <Component {...pageProps} authUser={authUser} />
        <ToastContainer />
      </AuthContextProvider>
    </div>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const pageProps = await App.getInitialProps(appContext);
  try {
    var response;
    response = await axios.get('http://127.0.0.1:8000/api/account/me', {
      withCredentials: true,
      headers: {
        ...(appContext.ctx.req && {
          Cookie: appContext.ctx.req.headers.cookie,
        }),
      },
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
