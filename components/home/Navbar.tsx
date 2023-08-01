import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Divider, Menu } from 'antd';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/auth';

import styles from './styles/Navbar.module.scss';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';

export const NavBar = function ({ ref }: any) {
  const router = useRouter();
  const { authUser } = useContext(AuthContext);
  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav
      id='navbar'
      className='px-5 py-5 bg-slate-300 w-full flex justify-between  items-center'
    >
      <div className='flex justify-center items-center sm:gap-10'>
        <Link href='/'>
          <h1 className='text-[2rem] sm:text-[4rem] cursor-pointer hover:text-slate-600'>
            Cshare
          </h1>
        </Link>
        <Divider type='vertical' />
        <div className='search col relative hidden lg:flex'>
          <input
            className='input--user w-full rounded-l-[5px]'
            placeholder='Search...'
            type='text'
          />
        </div>
      </div>
      <div className='px-5 py-2 md:bg-slate-200 rounded-md max-md:bg-red-400 hidden lg:block'>
        <ul className='flex justify-center gap-20 text-2xl items-center'>
          {!authUser.isAuthenticated && (
            <Link href='/auth/login'>
              <button className={styles.nav__btn}>Login</button>
            </Link>
          )}
          {!authUser.isAuthenticated && (
            <Link href='/auth/signup'>
              <button className={styles.nav__btn}>Signup</button>
            </Link>
          )}
          <li>
            <Link href='/about'>
              <button className={styles.nav__btn}>About</button>
            </Link>
          </li>
          <li>
            <Link href='/archive'>
              <button className={styles.nav__btn}>Archive</button>
            </Link>
          </li>
          <li>
            <Link href='/latest'>
              <button className={styles.nav__btn}>What&#39;s new</button>
            </Link>
          </li>
          {authUser.isAuthenticated && (
            <li>
              <Menu
                className='rounded-[5px] min-w-[200px] flex justify-center items-center'
                mode='horizontal'
                items={[
                  {
                    label: authUser.username,
                    key: 'settings',
                    children: [
                      {
                        label: 'Profile',
                        key: 'profile',
                        onClick: () =>
                          router.push(`/users/${authUser.username}`),
                      },

                      {
                        label: 'Create Code',
                        key: 'gist',
                        onClick: () => {
                          router.push('/code/create/');
                        },
                      },
                      {
                        className: 'text-red-500',
                        label: 'logout',
                        key: 'logout',
                        onClick: async () => {
                          router.push('/auth/logout');
                        },
                      },
                    ],
                    icon: (
                      <Avatar
                        src={authUser.image?.startsWith('/')?authUser.image.split("/").pop():authUser.image}
                        size={35}
                        draggable={false}
                      />
                    ),
                  },
                ]}
              ></Menu>
            </li>
          )}
        </ul>
      </div>
      {authUser.isAuthenticated && (
        <Menu
          className='rounded-[5px] w-[200px] flex justify-center items-center sm:hidden'
          mode='horizontal'
          items={[
            {
              label: authUser.username?.length>13?authUser.username.slice(0,10)+'...':authUser.username,
              key: 'settings',
              children: [
                {
                  label: 'Profile',
                  key: 'profile',
                  onClick: () => router.push(`/users/${authUser.username}`),
                },

                {
                  label: 'Create Code',
                  key: 'gist',
                  onClick: () => {
                    router.push('/code/create/');
                  },
                },
                {
                  className: 'text-red-500',
                  label: 'logout',
                  key: 'logout',
                  onClick: async () => {
                    router.push('/auth/logout');
                  },
                },
              ],
              icon: <Avatar src={authUser.image} size={35} draggable={false} />,
            },
          ]}
        ></Menu>
      )}

      <MenuOutlined className='sm:hidden' onClick={() => setToggleMenu(true)} />
      {toggleMenu && (
        <div
          onClick={(e) => {
            setToggleMenu(false);
          }}
          className='lg:hidden  fixed z-50 bg-slate-800  h-screen w-screen top-0 left-0 bg-opacity-30 '
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`flex  fixed h-[100vh] w-[70vw] top-0 right-0 bg-slate-300  ${
              toggleMenu ? 'translate-x-0' : 'translate-x-[70vw]'
            }`}
          >
            <div className='absolute top-5 left-5'>
              <CloseOutlined
                className='text-3xl'
                onClick={() => setToggleMenu(false)}
              />
              <div className='content my-5 p-3 flex justify-center items-center flex-col'>
                <div className='search col relative'>
                  <input
                    className='input--user w-full rounded-l-[5px]'
                    placeholder='Search...'
                    type='text'
                  />
                </div>
                <ul
                  onClick={(e) => {
                    e.stopPropagation();
                    setToggleMenu(false);
                  }}
                  className='my-10 text-6xl'
                >
                  {!authUser.isAuthenticated && (
                    <li>
                      <Link href='/auth/login'>
                        <button className={styles.nav__btn}>Login</button>
                      </Link>
                    </li>
                  )}
                  {!authUser.isAuthenticated && (
                    <li>
                      <Link href='/auth/signup'>
                        <button className={styles.nav__btn}>Signup</button>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href='/about'>
                      <button className={styles.nav__btn}>About</button>
                    </Link>
                  </li>
                  <li>
                    <Link href='/archive'>
                      <button className={styles.nav__btn}>Archive</button>
                    </Link>
                  </li>
                  <li>
                    <Link href='/latest'>
                      <button className={styles.nav__btn}>
                        What&#39;s new
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
