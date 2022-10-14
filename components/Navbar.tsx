import Link from 'next/link';
import axios from 'axios';
import { getCookie } from '../utils/auth';
import { useRouter } from 'next/router';
import { Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Navbar({ authUser }: any) {
  const router = useRouter();

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
            <Link href='/latest'>What's new</Link>
          </li>
          <li>
            {authUser.isAuthenticated && (
              <Menu
                className='rounded-[5px] flex'
                mode='horizontal'
                items={[
                  {
                    label: authUser.username,
                    key: 'settings',
                    children: [
                      {
                        label: 'logout',
                        key: 'logout',
                        onClick: async () => {
                          await axios.post(
                            'http://127.0.0.1:8000/api/account/logout/',
                            {},
                            {
                              withCredentials: true,
                              headers: {
                                'X-CSRFToken': getCookie('csrftoken')!,
                              },
                            }
                          );
                          router.push('/');
                        },
                      },
                      {
                        label: 'Create Code',
                        key: 'gist',
                        onClick: () => {
                          router.push('/code/create/', '', { shallow: true });
                        },
                      },
                    ],
                    icon: (
                      <img
                        className='rounded-[50%] h-[30px] inline'
                        src={authUser.image}
                        alt=''
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
