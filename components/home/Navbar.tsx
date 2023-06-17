import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Divider, Menu } from 'antd';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/auth';

import styles from './styles/Navbar.module.scss';

export const NavBar = function ({ ref }: any) {
  const router = useRouter();
  const { authUser } = useContext(AuthContext);

  return (
    <nav id='navbar' className='px-10 py-5 bg-slate-300 w-full flex justify-between  items-center'>
      <div className='flex justify-center items-center gap-10'>
        <Link href='/'>
          <h1 className='text-[4rem] cursor-pointer hover:text-slate-600'>
            Cshare
          </h1>
        </Link>
        <Divider type='vertical' />
        <div className='search flex col relative'>
          <input
            className='input--user min-w-[400px] rounded-l-[5px]'
            placeholder='Search...'
            type='text'
          />
        </div>
      </div>
      <div className='px-5 py-3 bg-slate-200 rounded-md'>
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
            <Link href='#'>
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
                        src={authUser.image}
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
    </nav>
  );
};
