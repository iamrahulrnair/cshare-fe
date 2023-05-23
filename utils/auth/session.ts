import { GetServerSidePropsContext } from 'next';
import { getFetcher } from '../axios/axios';
import { clearAuthCookies } from './cookie';

export async function ProtectedPageRoute(
  context: GetServerSidePropsContext,
  redirectTo,
  getProps
) {
  try {
    const axiosInstance = getFetcher(context.req);
    const res = await axiosInstance.get('account/isauth');
    console.log(res.data);

    if (getProps) {
      return {
        props: getProps(),
      };
    }

    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: {
        destination: redirectTo ?? '/auth/login?next=/code/create',
        permanent: false,
      },
    };
  }
}
