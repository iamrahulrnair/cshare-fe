import React, { useContext, useEffect, useState } from 'react';
import { getFetcher } from '../../utils/axios/axios';
import { Avatar, Divider, Empty } from 'antd';
import Link from 'next/link';
import { AuthContext } from '../../context/auth';
import { FollowUnfollowButton } from './FollowUnfollowButton';

interface FollowingUsers {
  id: number;
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

export function Following({ user }: { user: string }) {
  const [leaders, setLeaders] = useState<Partial<FollowingUsers[]> | []>(
    undefined
  );
  const { authUser, setAuthUser } = useContext(AuthContext);


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
          <React.Fragment key={leader.id}>
            <div className='flex justify-between items-start sm:flex-row flex-col '>
              <div className='flex gap-4'>
                <div>
                  <Avatar size={50} src={leader.leader_details.image} alt='' />
                </div>
                <div className='flex flex-col justify-center items-center'>
                   <div className='sm:flex hidden'>
                     <p>{leader.leader_details.first_name}</p>
                    &nbsp;
                    <p>{leader.leader_details.last_name}</p>
                    &nbsp;
                   </div>
                    <Link href={`/users/${leader.leader_details.username}`}>
                      <a className='subscript text-blue-400 underline'>
                        {leader.leader_details.username}
                      </a>
                    </Link>
                </div>
              </div>
              <div>
                {leader.leader_details.username !== authUser.username &&
                    <FollowUnfollowButton
                      is_following={leader.is_following}
                      user={leader}
                    />
                    }
              </div>
            </div>
            <Divider dashed />
          </React.Fragment>
        );
      })}
    </div>
  );
}
