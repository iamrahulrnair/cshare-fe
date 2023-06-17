import { getFetcher } from '../axios';

export async function followUser(username: string) {
  const axiosInstance = getFetcher();
  const response = await axiosInstance.post(`core/follow/${username}/`);
  return response.data;
}

export async function unfollowUser(username: string) {
    const axiosInstance = getFetcher();
    const response = await axiosInstance.delete(`core/unfollow/${username}/`);
    return response.data;
}