import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Alert, Divider } from 'antd';
import { Provider } from 'react-redux';
import NProgress from 'nprogress';

import { NavBar } from '../components/home';
import AuthContextProvider from '../context/auth';
import { store } from '../store';

import 'nprogress/nprogress.css';
import 'antd/dist/antd.css';
import '../styles/globals.scss';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps, router }: any) {
  const [isMobile, setIsMobile] = useState(false);
  const [isVerified, setIsVerified] = useState(undefined);
  useEffect(() => {
    if (window) {
      if (window.screen.width < 1000) {
        setIsMobile(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleRouteStart = () => {
      NProgress.start();
      NProgress.set(0.3);
      NProgress.configure({
        easing: 'ease',
        speed: 500,
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
      <AuthContextProvider>
        {!false ? (
          <>
            <NavBar />
            {isVerified==false && (
                <Alert
                  className='h-[80px] text-center'
                  message='You are not verfied yet. Please verify your email to access all the features.'
                  type='warning'
                />
              )}
            <div className='max-w-[1150px] my-0 mx-auto sm:min-h-[85vh] p-1 relative'>
              
              <Component {...pageProps} setUserVerified={setIsVerified} />
            </div>
            <Divider>
              <p className='text-center text-gray-500'>
                © 2023 <span className='text-gray-900 font-black'>Cshare</span>{' '}
                by{' '}
                <span>
                  <a href='https://github.com/iamrahulrnair'>iamrahulrnair</a>
                </span>
              </p>
            </Divider>
          </>
        ) : (
          <div className='h-[100vh] flex justify-center items-center flex-col'>
            <h1 className=''>
              <span className='font-extrabold'>Know media queries?</span>{' '}
              <span className='font-extralight'>
                Fix an issue raised in
                <a
                  className='ml-3'
                  href='https://github.com/iamrahulrnair/cshare-fe'
                >
                  Github
                </a>
              </span>
            </h1>
            <p className='subscript'>
              Please access Cshare via Laptop / Desktop
            </p>
          </div>
        )}

        <ToastContainer />
      </AuthContextProvider>
    </Provider>
  );
}

export default MyApp;
