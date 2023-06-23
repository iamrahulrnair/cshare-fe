import React, { useEffect, useState } from 'react';
import { followUser, unfollowUser } from '../../utils/auth';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export function FollowUnfollowButton({
  user,
  is_following,
  pre_save = () => {},
  save = () => {},
  post_save = () => {},
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(is_following);
  const router = useRouter();

  useEffect(() => {
    setIsFollowing(is_following);
  }, [is_following]);

  async function handleAction(action) {
    try {
      setShowSpinner(true);
      if (action === 'follow') {
        await followUser(
          user.leader_details?.username || user.follower_details?.username
        );
        setIsFollowing(true);
      } else {
        await unfollowUser(
          user.leader_details?.username || user.follower_details?.username
        );
        setIsFollowing(false);
      }
      pre_save();
      save();
      post_save();
      setShowSpinner(false);
    } catch (err) {
      setShowSpinner(false);

      if (err.response.status === 401) {
        router.push(
          `/auth/login?next=/users/${
            user.leader_details?.username || user.follower_details?.username
          }`
        );
      }
    }
  }

  return (
    <>
      {!isFollowing ? (
        <button
          disabled={showSpinner}
          onClick={async () => {
            handleAction('follow');
          }}
          className='btn btn--success hover:text-blue-500 m-5'
        >
          {showSpinner ? (
            <LoadingOutlined style={{ fontSize: 24 }} spin />
          ) : (
            'Follow'
          )}
        </button>
      ) : (
        <button
          disabled={showSpinner}
          onClick={async () => {
            handleAction('unfollow');
          }}
          className='btn btn--success hover:text-blue-500 m-5'
        >
          {showSpinner ? (
            <LoadingOutlined style={{ fontSize: 24 }} spin />
          ) : (
            'Unfollow'
          )}
        </button>
      )}
    </>
  );
}
