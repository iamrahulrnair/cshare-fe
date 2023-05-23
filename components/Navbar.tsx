import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Menu } from 'antd';
import { useContext } from 'react';
import { AuthContext } from '../context/auth';

export default function Navbar() {
  const router = useRouter();
  const { authUser } = useContext(AuthContext);

  return (
    <nav className='px-10 bg-slate-300 flex justify-between  items-center'>
      <div>
        <Link href='/'>
          <h1 className='text-[4rem] cursor-pointer hover:text-slate-600'>
            Cshare
          </h1>
        </Link>
      </div>
      <div className='py-4'>
        <ul className='flex justify-between gap-20 text-2xl items-center'>
          {!authUser.isAuthenticated && <Link href='/auth/login'>Login</Link>}
          {!authUser.isAuthenticated && <Link href='/auth/signup'>Signup</Link>}
          <li>
            <Link href='/about'>About</Link>
          </li>
          <li>
            <Link href='/archive'>Archive</Link>
          </li>
          <li>
            <Link href='/latest'>What&#39;s new</Link>
          </li>
          <li>
            {authUser.isAuthenticated && (
              <Menu
                className='rounded-[5px] min-w-[200px] flex justify-center items-center p-3'
                mode='horizontal'
                items={[
                  {
                    label: authUser.username,
                    key: 'settings',
                    children: [
                      {
                        className: 'text-red-500',
                        label: 'logout',
                        key: 'logout',
                        onClick: async () => {
                          router.push('/auth/logout');
                        },
                      },
                      {
                        label: 'Create Code',
                        key: 'gist',
                        onClick: () => {
                          router.push('/code/create/');
                        },
                      },
                    ],
                    icon: (
                      <Avatar
                        src={authUser.image}
                        gap={6}
                        size={'large'}
                        draggable={false}
                      />
                    ),
                  },
                ]}
              ></Menu>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
