import type { NextPage } from 'next';
import { CodeBlock } from '../components/code';

import _ from 'lodash';
import Link from 'next/link';
import { getFetcher } from '../utils/axios/axios';
import { useContext, useEffect } from 'react';
import { Avatar, Divider } from 'antd';
import { AuthContext } from '../context/auth';

interface codeDetailsProps {
  id: number;
  extension: string;
  description: string;
  code: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_details: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    image: string;
  };
}

const Home = (props: any) => {
  const { authUser } = useContext(AuthContext);
  const { data, setUserVerified } = props;
  useEffect(() => {
    if (authUser.isAuthenticated) {
      if (authUser.is_verified) {
        setUserVerified(true);
      } else {
        setUserVerified(false);
      }
    }
    
  }, [authUser]);
  return (
    data.length > 0 &&
    data.map((code: codeDetailsProps, index) => {
      return (
        <>
          <div className='mt-20 mx-10'>
            <div className='flex p-5 justify-start items-center'>
              <div>
                <Avatar
                  draggable={false}
                  src={code.user_details.image}
                  size={50}
                ></Avatar>
              </div>
              <Divider type='vertical' />
              <div className='flex flex-col'>
                <div className='flex justify-center items-center gap-4'>
                  <Link
                    href={`/users/${code.user_details.username}`}
                    className='inline-block'
                  >
                    <a>{code.user_details.username}</a>
                  </Link>
                  /
                  <Link href={`/code/${code.id}`} className='inline-block'>
                    <a>{code.extension}</a>
                  </Link>
                </div>
                <div>
                  <p className='subscript'>
                    {/* TODO: create an issue for this, convert to user readable format */}
                    created at: {code.created_at}
                  </p>
                </div>
              </div>
            </div>
            <Link href={`/code/${code.id}`} key={index}>
              <div key={code.id}>
                <CodeBlock
                  code={code.code}
                  language={code.extension.split('.').pop()}
                />
              </div>
            </Link>
          </div>
        </>
      );
    })
  );
};
export async function getServerSideProps({ req }: any) {
  try {
    const axiosInstance = getFetcher(req, false);
    const response = await axiosInstance.get('code');

    return {
      props: {
        data: response.data,
      },
    };
  } catch (err: any) {
    console.log(err);
    return {
      props: {
        data: [],
      },
    };
  }
}
export default Home;
