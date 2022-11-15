import axios from 'axios';
import type { NextPage } from 'next';
import CodeBlock from '../components/code/CodeBlock';

import _ from 'lodash';
import Link from 'next/link';

const Home: NextPage = ({ authUser, data }: any) => {
  return (
    data.length > 0 &&
    data.map((el: any) => (
      <Link href={`/code/${el.id}`}>
        <div
          key={el.id}
          className='cursor-pointer mx-auto w-[100rem] mt-20 flex flex-col gap-10'
        >
          <CodeBlock code={JSON.parse(el.code)} language={el.extension} />
        </div>
      </Link>
    ))
  );
};
export async function getServerSideProps({ req }: any) {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/code');

    return {
      props: {
        data: response.data,
      },
    };
  } catch (err: any) {
    return {
      props: {
        error: 'Somthing went wrong',
      },
    };
  }
}
export default Home;
