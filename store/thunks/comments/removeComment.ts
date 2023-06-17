import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFetcher } from '../../../utils/axios';

export const removeComment = createAsyncThunk(
  'comments/remove',
  async ({ codeId, commentId }: any) => {
    const COMMENT_PATH = `code/${codeId}/comments/${commentId}/`;
    const axiosInstance = getFetcher();
    const { data } = await axiosInstance.delete(COMMENT_PATH);
    return data;
  }
);
