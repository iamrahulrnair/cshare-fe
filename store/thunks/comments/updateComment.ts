import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFetcher } from '../../../utils/axios';

export const updateComment = createAsyncThunk(
  'comments/update',
  async ({ codeId, comment,commentId }: any) => {
    const COMMENT_PATH = `code/${codeId}/comments/${commentId}/`;
    const axiosInstance = getFetcher();
    const { data } = await axiosInstance.patch(COMMENT_PATH, {
      comment,
    });
    return data;
  }
);
