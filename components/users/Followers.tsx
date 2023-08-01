import React, { useContext, useEffect, useState } from 'react';
import { getFetcher } from '../../utils/axios/axios';
import { Avatar, Divider, Empty } from 'antd';
import Link from 'next/link';
import { followUser, unfollowUser } from '../../utils/auth';
import { AuthContext } from '../../context/auth';
import { useRouter } from 'next/router';
import { FollowUnfollowButton } from './FollowUnfollowButton';

interface sample {
  id: number;
  leader: number;
  follower: number;
  follower_details: {
    image: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export function Followers({ user }: { user: string }) {
  const [followers, setFollowers] = useState<Partial<sample[]> | []>(undefined);
  const { authUser, setAuthUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const axiosInstance = getFetcher();
        const response = await axiosInstance.get(`core/${user}/?tab=followers`);
        setFollowers(response.data);
      } catch (err) {
        console.log(err);
        setFollowers([]);
      }
    })();
  }, [user]);
  if (followers === undefined) {
    return <div>Loading...</div>;
  }
  if (followers.length === 0) {
    return (
      <Empty
        className='flex flex-col min-h-[50vh] justify-center border-black'
        description='No followers'
      />
    );
  }

  return (
    <div className='flex flex-col p-10'>
      {followers.map((follower) => {
        return (
          <React.Fragment key={follower.id}>
            <div className='flex justify-between items-start sm:flex-row flex-col'>
              <div className='flex gap-4'>
                <div>
                  <Avatar
                    size={50}
                    src={follower.follower_details.image}
                    alt=''
                  />
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <div className='sm:flex hidden'>
                    <p>{follower.follower_details.first_name}</p>
                    &nbsp;
                    <p>{follower.follower_details.last_name}</p>
                    &nbsp;
                  </div>
                    <Link href={`/users/${follower.follower_details.username}`}>
                      <a className='subscript text-blue-400 underline'>
                        {follower.follower_details.username}
                      </a>
                    </Link>
                </div>
              </div>
              <div>
                {follower.follower_details.username !== authUser.username &&
                  <FollowUnfollowButton
                      is_following={follower.is_following}
                      user={follower}
                    />}
              </div>
            </div>
            <Divider dashed />
          </React.Fragment>
        );
      })}
    </div>
  );
}
