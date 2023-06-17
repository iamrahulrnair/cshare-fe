import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFetcher } from '../../../utils/axios';

export const fetchComments = createAsyncThunk(
  'comments/fetch',
  async (codeId: any) => {
    const COMMENT_PATH = `code/${codeId}/comments/`;
    const axiosInstance = getFetcher();
    const { data } = await axiosInstance.get(COMMENT_PATH);
    return data;
  }
);
