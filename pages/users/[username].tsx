import { Router, useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { getFetcher } from '../../utils/axios/axios';
import { Avatar, Col, Divider, Row, Tabs, TabsProps } from 'antd';
import { AuthContext } from '../../context/auth';
import Link from 'next/link';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

import styles from './Username.module.scss';

import {
  FollowUnfollowButton,
  Followers,
  Following,
  UserCodes,
  UserEditBox,
} from '../../components/users';
import Image from 'next/image';
import { toast } from 'react-toastify';

export interface UserDetails {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  image: string;
  followers: number;
  following: number;
  is_following?: boolean;
}
interface UserNamePropsInterface {
  user_details: UserDetails;
  codes: {
    id: number;
    extension: string;
    description: string;
    code: string;
    created_at: string;
    updated_at: string;
    is_public: boolean;
  }[];
  isAuthenticated: boolean;
  setUserVerified: (value: boolean) => void;
}

function Username({
  user_details,
  codes,
  isAuthenticated,
  setUserVerified
}: UserNamePropsInterface) {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState<Partial<UserDetails>>({});
  const [showProfileEditOptions, setShowProfileEditOptions] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthUser({ isAuthenticated: false });
    }
    setUserDetails(user_details);
    setIsFollowing(user_details.is_following || false);
  }, [user_details, setAuthUser, isAuthenticated]);

  useEffect(() => {
    if (authUser.isAuthenticated) {
      if (authUser.is_verified) {
        setUserVerified(true);
      } else {
        setUserVerified(false);
      }
    }
  }, [authUser]);

  function onTabChange(key: string) {
    setActiveKey(key);
  }
  
  function handleProfileImageUpload(e) {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      const axiosInstance = getFetcher();
      axiosInstance
        .patch('account/me/', formData)
        .then((response) => {
          setUserDetails({ ...userDetails, image: response.data.image });
          toast.success('Profile updated successfully');
        })
        .catch(() => {
          toast.error('Error while uploading image');
        });
    }
  }
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'All Codes',
      children: <UserCodes user_details={userDetails} codes={codes} />,
    },
    {
      key: '2',
      label: 'Followers',
      children: <Followers user={userDetails.username} />,
    },
    {
      key: '3',
      label: 'Following',
      children: <Following user={userDetails.username} />,
    },
  ];

  return (
    <section className='profile'>
      <Row className=' min-h-[80vh] p-10 relative'>
        <Col className='p-4 ' span={6}>
          <div className='flex flex-col sticky top-[35px] '>
            <div className={`${styles.container} relative flex justify-center items-center`}>
              <Image
                className={`rounded-full flex justify-center items-center`}
                src={userDetails.image}
                height={300}
                width={300}
              />
              {authUser.isAuthenticated &&
                authUser.username === userDetails.username && (
                  <div className={`${styles.overlay} cursor-pointer`}>
                    <div className={`${styles.text}`}>
                      <div className='relative'>
                        <label htmlFor='upload'>
                          <span>
                            <UploadOutlined
                              className='cursor-pointer'
                              style={{
                                fontSize: '50px',
                              }}
                            />
                          </span>
                          <input
                            onChange={handleProfileImageUpload}
                            type='file'
                            id='upload'
                            style={{
                              display: 'none',
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            {showProfileEditOptions ? (
              <UserEditBox
                user_details={userDetails}
                save={(data) => setUserDetails({ ...data })}
                post_save={() => setShowProfileEditOptions(false)}
              />
            ) : (
              <>
                <h1 className='text-4xl font-bold'>
                  {userDetails.first_name} {userDetails.last_name}
                </h1>
                <h1 className='text-3xl font-light text-[#333333a6]'>
                  {userDetails.username}
                </h1>
                <p>{userDetails.bio}</p>
                <Link href={'/users/profile'}>
                  {authUser.isAuthenticated &&
                  authUser.username === userDetails.username ? (
                    <>
                      <button
                        onClick={() => setShowProfileEditOptions(true)}
                        className='btn btn--success m-6 cursor-pointer'
                        disabled={authUser.is_verified == false}
                      >
                        Edit profile
                      </button>
                    </>
                  ) : (
                    <>
                      <FollowUnfollowButton
                        is_following={userDetails.is_following}
                        user={{
                          leader_details: userDetails,
                        }}
                        post_save={() => {
                          setIsFollowing(true);
                        }}
                      />
                    </>
                  )}
                </Link>
                <div className='flex items-center '>
                  <UserOutlined className='mr-2' />
                  <div className='flex gap-2 font-bold hover:text-blue-500 cursor-pointer'>
                    <span>{userDetails.followers}</span>
                    <p onClick={() => setActiveKey('2')}>Followers</p>
                  </div>
                  <Divider type='vertical' />
                  <div className='flex gap-2 font-bold hover:text-blue-500 cursor-pointer'>
                    <span>{userDetails.following}</span>
                    <p onClick={() => setActiveKey('3')}>Following</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Col>
        <Col className='p-4' span={18}>
          <div>
            <Tabs
              activeKey={activeKey}
              defaultActiveKey='1'
              items={tabItems}
              onChange={onTabChange}
            />
          </div>
        </Col>
      </Row>
    </section>
  );
}

export async function getServerSideProps(context: any) {
  // should show private code for auth users, else public codes.
  // Authorization header should be set for private codes.
  // if token expired then we can show the public code for the same user

  const { username } = context.params;
  const axiosInstance = getFetcher(context.req);
  try {
    // if user is authenticated and auth username is same as the username in the url
    const { data } = await axiosInstance.get<{
      user_details: any;
      codes: any[];
    }>(`account/users/${username}`);
    return {
      props: {
        user_details: data.user_details,
        codes: data.codes,
        isAuthenticated: true,
      },
    };
  } catch (err) {
    console.log(err);

    if (err.response.status === 401) {
      // if token expired or user is not authenticated
      const axiosInstance = getFetcher(context.req, false);
      const { data } = await axiosInstance.get(`account/users/${username}`);

      return {
        props: {
          user_details: data.user_details,
          codes: data.codes,
          isAuthenticated: false,
        },
      };
    }
    // if user does not exist or some other error
    console.log({ err });
    return {
      notFound: true,
    };
  }
}

export default Username;
