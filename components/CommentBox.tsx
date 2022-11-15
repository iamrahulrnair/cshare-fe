import React, { useEffect, useState } from 'react';
import Link from 'next/link';

function CommentBox(props: any) {
  const { authUser, commentDetails, handleCommentUpdate, handleCommentDelete } =
    props;
  const [readOnlyComment, setReadOnlyComment] = useState(true);
  const [comment, setComment] = useState(commentDetails.comment);

  return (
    <div key={commentDetails.id} className='rounded-t-md my-7'>
      <div className='flex gap-4 items-center border-2 p-4 rounded-lg border-grey-200'>
        <img
          className='rounded-full w-[40px] my-3 '
          src={`http://127.0.0.1:8000${commentDetails.user_details.image}`}
          alt=''
        />
        <div>
          <Link href={`/${commentDetails.user_details.username}`}>
            <span className='text-[20px]'>
              {commentDetails.user_details.username}
            </span>
          </Link>
        </div>
        {authUser.username == commentDetails.user_details.username ? (
          <div className='flex gap-2'>
            <span
              className='hover:text-green-700 text-green-500 cursor-pointer'
              onClick={() => {
                readOnlyComment
                  ? setReadOnlyComment(false)
                  : (() => {
                      handleCommentUpdate(commentDetails.id, comment);
                      setReadOnlyComment(true);
                    })();
              }}
            >
              {readOnlyComment ? 'Edit' : 'Update'}
            </span>
            <strong>/</strong>
            <span
              className='hover:text-red-700 text-red-500 cursor-pointer'
              onClick={() => {
                handleCommentDelete(commentDetails.id);
              }}
            >
              Delete
            </span>
          </div>
        ) : (
          ''
        )}
      </div>
      <textarea
        defaultValue={comment}
        onChange={(e) => setComment(e.target.value)}
        readOnly={
          authUser.username == commentDetails.user_details.username
            ? readOnlyComment
            : true
        }
        placeholder='Leave a comment'
        className=' w-full p-3 placeholder-[#333333ad] outline-none border-4 border-sky-500 rounded-lg focus:border-green-400'
      ></textarea>
    </div>
  );
}
export default CommentBox;
