import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFetcher } from '../../../utils/axios';

export const addComment = createAsyncThunk(
  'comments/add',
  async ({ codeId, comment }: any) => {
    const COMMENT_PATH = `code/${codeId}/comments/`;
    const axiosInstance = getFetcher();
    const { data } = await axiosInstance.post(COMMENT_PATH, {
      comment,
    });
    return data;
  }
);
