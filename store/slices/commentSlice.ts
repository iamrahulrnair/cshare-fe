import { createSlice } from '@reduxjs/toolkit';
import {
  fetchComments,
  addComment,
  updateComment,
  removeComment,
} from '../actions';

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    data: [],
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(addComment.fulfilled, (state, action) => {
      console.log({state,action})
      state.data.push(action.payload);
    });

    builder.addCase(updateComment.fulfilled, (state, action) => {
      const { id, comment } = action.payload;
      const index = state.data.findIndex((comment: any) => comment.id === id);
      state.data[index].comment = comment;
    });

    builder.addCase(removeComment.fulfilled, (state, action) => {
      const  id = action.payload;
      state.data=state.data.filter((comment:any)=>{
        console.log(comment.id)
        return comment.id !== id
      })
      state.data.map((comment:any)=>{
        console.log(comment.id)
      })
    });
  },
});

export const commentsReducer = commentsSlice.reducer;
