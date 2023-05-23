import type { NextPage } from 'next';
import CodeBlock from '../components/code/CodeBlock';

import _ from 'lodash';
import Link from 'next/link';
import { getFetcher } from '../utils/axios/axios';
import { useEffect } from 'react';
import { Col, Row, Avatar, Divider } from 'antd';

const Home: NextPage = ({ authUser, data }: any) => {
  return (
    data.length > 0 &&
    data.map((el: any, index) => {
      return (
        <>
          <Row className='bg-slate-100 mt-20'>
            <Col span={18}>
              <Link href={`/code/${el.id}`} key={index}>
                <div key={el.id} className='flex flex-col '>
                  <CodeBlock code={el.code} language={el.extension} />
                </div>
              </Link>
            </Col>
            <Col span={6}>
              <div className='flex flex-col justify-evenly items-center h-full'>
                <div className='flex justify-center items-center '>
                  <Avatar
                    draggable={false}
                    src={el.user_details.image}
                    size={50}
                  ></Avatar>
                  <Divider type='vertical' />
                  <a
                    href={`/users/${el.user_details.username}`}
                    className='text-xl text-blue-500'
                  >
                    @{el.user_details.username}
                  </a>
                </div>
                <Divider dashed />
                <p className='text-2xl font-bold'>{el.description}</p>
              </div>
            </Col>
          </Row>
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
    return {
      props: {
        data: [],
      },
    };
  }
}
export default Home;
