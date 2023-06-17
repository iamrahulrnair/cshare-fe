import React, { useState } from 'react';
import { followUser, unfollowUser } from '../../utils/auth';
import { LoadingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export function UnFollowButton({
  user,
  pre_save = () => {},
  save = () => {},
  post_save = () => {},
}) {
  const [showSpinner, setShowSpinner] = useState(false);
  const router = useRouter();
  return (
    <>
      <button
        disabled={showSpinner}
        onClick={async () => {
          try {
            setShowSpinner(true);
            await unfollowUser(
              user.leader_details?.username || user.follower_details?.username
            );
            setShowSpinner(false);
            pre_save();
            save();
            post_save();
          } catch (err) {
            setShowSpinner(false);

            if (err.response.status === 401) {
              router.push(
                `/auth/login?next=/users/${
                  user.leader_details?.username ||
                  user.follower_details?.username
                }`
              );
            }
          }
        }}
        className='btn btn--success hover:text-red-500'
      >
        {showSpinner ? (
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        ) : (
          'Unfollow'
        )}
      </button>
    </>
  );
}
