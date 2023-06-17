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

    if (getProps) {
      return {
        props: getProps(),
      };
    }

    return {
      props: {
        isAuthenticated: true,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        isAuthenticated: false,
      },
    };
  }
}
