import React, { useContext, useState } from 'react';
import { UserDetails } from '../../pages/users/[username]';
import { getFetcher } from '../../utils/axios/axios';
import { AuthContext } from '../../context/auth';
import { useRouter } from 'next/router';

export function UserEditBox({
  user_details,
  save,
  post_save,
}: {
  user_details: Partial<UserDetails>;
  save: (user_details: UserDetails) => void;
  post_save: () => void;
}) {
  const [updated_details, setUpdatedDetails] =
    useState<Partial<UserDetails>>(user_details);
  const { authUser, setAuthUser } = useContext(AuthContext);
  const router = useRouter();
  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const axiosInstance = getFetcher();
      const response = await axiosInstance.patch<UserDetails>('account/me/', {
        first_name: updated_details.first_name,
        last_name: updated_details.last_name,
        bio: updated_details.bio,
      });
      save({ ...response.data });
      post_save();
    } catch (err) {
      console.log(err);
      setAuthUser({ isAuthenticated: false });
      router.push(`/auth/login?next=/users/${updated_details.username}`);
    }
  }
  return (
    <form className='p-3 flex flex-col' onSubmit={handleFormSubmit}>
      <div className='flex flex-col sm:flex-row gap-4 my-4'>
        <div>
          <label className='font-bold ' htmlFor='f_name'>
            First Name
          </label>
          <input
            placeholder={updated_details.first_name}
            value={updated_details.first_name}
            onChange={(e) => {
              setUpdatedDetails({
                ...updated_details,
                first_name: e.target.value,
              });
            }}
            id='f_name'
            className='w-full input--secondary'
          />
        </div>
        <div>
          <label className='font-bold' htmlFor='l_name'>
            Last Name
          </label>
          <input
            placeholder={updated_details.last_name}
            value={updated_details.last_name}
            onChange={(e) => {
              setUpdatedDetails({
                ...updated_details,
                last_name: e.target.value,
              });
            }}
            id='_name'
            className='w-full input--secondary'
          />
        </div>
      </div>
      <div>
        <label className='font-bold' htmlFor='bio'>
          Bio
        </label>
        <textarea
          placeholder={updated_details.bio}
          value={updated_details.bio}
          onChange={(e) => {
            setUpdatedDetails({
              ...updated_details,
              bio: e.target.value,
            });
          }}
          id='bio'
          className='w-full'
        ></textarea>
      </div>
      <button
        className='btn btn--success w-full hover:text-blue-400 my-4'
        type='submit'
      >
        Save
      </button>
    </form>
  );
}
