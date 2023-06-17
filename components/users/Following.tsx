import React, { useContext, useEffect, useState } from 'react';
import { getFetcher } from '../../utils/axios/axios';
import { set } from 'lodash';
import { Avatar, Divider, Empty } from 'antd';
import Link from 'next/link';
import { followUser, unfollowUser } from '../../utils/auth';
import { AuthContext } from '../../context/auth';
import { useRouter } from 'next/router';
import { LoadingOutlined } from '@ant-design/icons';
import { FollowButton, UnFollowButton } from './';

interface FollowingUsers {
  leader: number;
  follower: number;
  leader_details: {
    image: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  is_following: boolean;
}
[];

export function Following({ user }: { user: string }) {
  const [leaders, setLeaders] = useState<Partial<FollowingUsers[]> | []>(
    undefined
  );
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [showSpinner, setShowSpinner] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const axiosInstance = getFetcher();
        const response = await axiosInstance.get(`core/${user}?tab=following`);
        setLeaders(response.data);
      } catch (error) {
        console.log(error);
        setLeaders([]);
      }
    })();
  }, [user]);
  if (leaders === undefined) {
    return <div>Loading...</div>;
  }
  if (leaders.length === 0) {
    return (
      <Empty
        className='flex flex-col min-h-[50vh] justify-center border-black'
        description='No connections'
      />
    );
  }

  return (
    <div className='flex flex-col p-10'>
      {leaders.map((leader) => {
        return (
          <>
            <div className='flex justify-between items-center'>
              <div className='flex gap-4'>
                <div>
                  <Avatar size={50} src={leader.leader_details.image} alt='' />
                </div>
                <div className='flex flex-col'>
                  <div className='flex justify-center items-center'>
                    <p>{leader.leader_details.first_name}</p>
                    &nbsp;
                    <p>{leader.leader_details.last_name}</p>
                    &nbsp;
                    <Link href={`/users/${leader.leader_details.username}`}>
                      <a className='subscript '>
                        {leader.leader_details.username}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div>
                {leader.leader_details.username !== authUser.username &&
                  (leader.is_following ? (
                    <UnFollowButton
                      user={leader}
                      post_save={() => {
                        const updatedLeaders = leaders.map(
                          (_leader: FollowingUsers) => {
                            if (
                              _leader.leader_details.username ===
                              leader.leader_details.username
                            ) {
                              return { ..._leader, is_following: false };
                            }
                            return _leader;
                          }
                        );
                        setLeaders(
                          updatedLeaders as Partial<FollowingUsers[]> | []
                        );
                      }}
                    />
                  ) : (
                    <FollowButton
                      user={leader}
                      post_save={() => {
                        const updatedLeaders = leaders.map((_leader) => {
                          if (
                            _leader.leader_details.username ===
                            leader.leader_details.username
                          ) {
                            return { ..._leader, is_following: true };
                          }
                          return _leader;
                        });
                        setLeaders(
                          updatedLeaders as Partial<FollowingUsers[]> | []
                        );
                      }}
                    />
                  ))}
              </div>
            </div>
            <Divider dashed />
          </>
        );
      })}
    </div>
  );
}
