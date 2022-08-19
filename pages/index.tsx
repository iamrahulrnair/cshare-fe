import axios from 'axios';
import type { NextPage } from 'next';
import { getCookie } from '../utils/auth';
import { getAuthSession } from '../utils/lib/session';

import _ from 'lodash';

const Home: NextPage = ({ authUser }: any) => {
  return (
    <div className='text-[6rem]'>
      username:{authUser?.username}
      <button
        onClick={async () => {
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
        }}
      >
        click me
      </button>
    </div>
  );
};
// export async function getServerSideProps({ req }: any) {
//   try {
//     const data = await getAuthSession(req);

//     return {
//       props: {
//         data,
//       },
//     };
//   } catch (err: any) {
//     return {
//       redirect: {
//         destination: '/auth/login',
//         permanent: false,
//       },
//       props: {},
//     };
//   }
// }
export default Home;
