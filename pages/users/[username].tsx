import { useRouter } from 'next/router';
import React from 'react';
import { getFetcher } from '../../utils/axios/axios';

function Username() {
  const router = useRouter();

  return <div>{router.query.username}</div>;
}

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const axiosInstance = getFetcher(context.req);
  const { data } = await axiosInstance.get(`account/${username}`);
  return {
    props: {},
  };
}

export default Username;
