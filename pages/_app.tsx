import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Divider } from 'antd';
import { Provider } from 'react-redux';
import NProgress from 'nprogress';

import { NavBar } from '../components/home';
import AuthContextProvider from '../context/auth';
import { store } from '../store';

import 'nprogress/nprogress.css';
import 'antd/dist/antd.css';
import '../styles/globals.scss';
import { useEffect, useRef } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps, router }: any) {

  useEffect(() => {
    const handleRouteStart = () => {
      NProgress.start();
      NProgress.set(.3);
      NProgress.configure({
        easing: 'ease',
        speed:500,
        showSpinner: false, 
      });
    };
    const handleRouteDone = () => NProgress.done();

    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteDone);
    router.events.on('routeChangeError', handleRouteDone);

    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteDone);
      router.events.off('routeChangeError', handleRouteDone);
    };
  }, [router]);

  return (
    <Provider store={store}>
      <Head>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
      </Head>
      <AuthContextProvider>
        <NavBar  />
        <div className='max-w-[1400px] my-0 mx-auto min-h-[85vh] p-1'>
          <Component {...pageProps} />
        </div>
        <Divider>
          <p className='text-center text-gray-500'>
            © 2023 <span className='text-gray-900 font-black'>Cshare</span> by{' '}
            <span>
              <a href='https://github.com/iamrahulrnair'>iamrahulrnair</a>
            </span>
          </p>
        </Divider>

        <ToastContainer />
      </AuthContextProvider>
    </Provider>
  );
}

export default MyApp;
