import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Avatar, Divider } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  SaveFilled,
  SaveOutlined,
} from '@ant-design/icons';

export function CommentBox(props: any) {
  const [showDeleteSpinner, setShowDeleteSpinner] = useState(false);

  const { authUser, commentDetails, handleCommentUpdate, handleCommentDelete } =
    props;
  const [readOnlyComment, setReadOnlyComment] = useState(true);
  const [comment, setComment] = useState(commentDetails.comment);
  const AuthUserIsOwner =
    authUser.username == commentDetails.user_details.username;
  return (
    <div key={commentDetails.id} className='flex flex-col gap-3 my-7'>
      <div
        className={`flex gap-4 items-center border-2 p-4  + ${
          AuthUserIsOwner ? 'justify-end' : ''
        }`}
      >
        <div className='flex  justify-center items-center gap-5'>
          <Avatar size={50} src={commentDetails.user_details.image} />
          <div>
            <Link href={`/users/${commentDetails.user_details.username}`}>
              <a className='text-[15px] text-blue-500'>
                {commentDetails.user_details.username}
              </a>
            </Link>
          </div>
          {authUser.username == commentDetails.user_details.username ? (
            <div className='flex justify-center items-center gap-2'>
              <span
                className='cursor-pointer hover:text-blue-400'
                onClick={() => {
                  readOnlyComment
                    ? setReadOnlyComment(false)
                    : (() => {
                        handleCommentUpdate(commentDetails.id, comment);
                        setReadOnlyComment(true);
                      })();
                }}
              >
                {readOnlyComment ? (
                  <EditOutlined
                    title='Edit comment'
                    onClick={() => setReadOnlyComment(false)}
                  />
                ) : (
                  <SaveOutlined title='Save comment' />
                )}
              </span>
              <Divider type='vertical' />
              <span
                className=' cursor-pointer hover:text-red-400'
                onClick={async() => {
                  setShowDeleteSpinner(true);
                  await handleCommentDelete(commentDetails.id);
                  setShowDeleteSpinner(false);
                }}
              >
                {showDeleteSpinner ? (
                  <LoadingOutlined style={{ fontSize: 24 }} spin />
                ) : (
                  <DeleteOutlined title='Delete comment' />
                )}
              </span>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <textarea
        disabled={readOnlyComment}
        defaultValue={comment}
        onChange={(e) => setComment(e.target.value)}
        readOnly={
          authUser.username == commentDetails.user_details.username
            ? readOnlyComment
            : true
        }
        className=' w-full p-3'
      ></textarea>
    </div>
  );
}
