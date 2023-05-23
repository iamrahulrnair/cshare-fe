import { GetServerSidePropsContext, NextPage } from 'next';
import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Modal, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

import { AuthContext } from '../../context/auth';
import CodeEditor from '../../components/CodeEditor';
import { useRouter } from 'next/router';
import CommentBox from '../../components/CommentBox';
import { ProtectedPageRoute } from '../../utils/auth/session';
import { getFetcher } from '../../utils/axios/axios';

const CodeDetail: NextPage = (props: any) => {
  const { authUser } = useContext(AuthContext);
  const { codeDetails, comments } = props.data;
  const [userComments, setUserComments] = useState(comments);
  const [readOnly, setReadOnly] = useState(true);
  const [comment, setComment] = useState('');
  const router = useRouter();

  const COMMENT_PATH = `code/${codeDetails.id}/comments/`;
  const matchCode = authUser.username + '/' + codeDetails.extension;

  console.log(props);

  const onSubmitComment = async () => {
    const axiosInstance = getFetcher();

    try {
      const response = await axiosInstance.post(COMMENT_PATH, {
        comment,
      });
      setUserComments([...userComments, response.data]);
      setComment('');
    } catch (err: any) {
      console.log(err);
    }
  };
  const handleCommentUpdate = async (id: string, comment: string) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/code/comment/${id}/`,
        {
          comment,
        },
        {
          withCredentials: true,
        }
      );
      const currentComments = userComments;
      currentComments[userComments.findIndex((p: any) => p.id == id)].comment =
        response.data.comment;
      setUserComments([...currentComments]);
    } catch (err) {
      console.log(err);
    }
  };
  const handleCommentDelete = async (id: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/code/comment/${id}/`, {
        withCredentials: true,
      });
      let currentComments = userComments;
      currentComments = currentComments.filter((c: any) => c.id != id);
      setUserComments([...currentComments]);
    } catch (err) {}
  };
  const handleDelete = () => {
    const model = confirm({
      title: 'Do you want to delete this code block?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Ok',
      okType: 'danger',
      okButtonProps: {
        disabled: true,
      },
      content: (
        <div>
          <p>
            Type in the name <strong>{matchCode}</strong> to confirm deletion.
            This action cannot be undone.
          </p>
          <input
            onChange={(e) => {
              if (e.target.value === matchCode) {
                model.update({ okButtonProps: { disabled: false } });
              } else {
                model.update({ okButtonProps: { disabled: true } });
              }
            }}
            name='deleteCode'
            type='text'
            className='w-full'
          ></input>
        </div>
      ),
      onOk() {
        return new Promise((resolve, reject) => {
          (async () => {
            try {
              const res = await axios.delete(
                `http://127.0.0.1:8000/api/code/${codeDetails.id}/`,
                {
                  withCredentials: true,
                }
              );
              resolve(res);
              router.push('/');
            } catch (err: any) {
              reject(err);
            }
          })();
        }).catch((err) => console.log(err));
      },
      onCancel() {},
    });
  };
  const handleCodeUpdate = async (code: string) => {
    codeDetails.code = code;
  };
  const handleCodePatch = async () => {
    const code = JSON.stringify(codeDetails.code);
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/code/${codeDetails.id}/`,
        {
          code,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className='mx-[120px] my-[auto] py-10'>
      <div className=' bg-slate-300 px-3 py-4 rounded-t-md flex gap-4'>
        <p className='mx-5'>{codeDetails.description}</p>
        {authUser.email == codeDetails.user_details.email ? (
          <div>
            <div className='flex justify-center items-center gap-2'>
              <span
                className='hover:text-green-700 text-green-600 cursor-pointer'
                onClick={() =>
                  readOnly
                    ? setReadOnly(false)
                    : (() => {
                        handleCodePatch();
                        setReadOnly(true);
                      })()
                }
              >
                {readOnly ? 'Edit' : 'Update'}
              </span>
              <Divider type='vertical' />
              <span
                className='hover:text-red-700 text-red-500 cursor-pointer'
                onClick={handleDelete}
              >
                Delete
              </span>
              <Divider type='vertical' />
              <span
                className='hover:text-red-700 text-blue-500 cursor-pointer'
                // onClick={handleDelete}
              >
                Fork
              </span>
            </div>
          </div>
        ) : (
          <div>
            <span
              className='hover:text-red-700 text-blue-500 cursor-pointer'
              // onClick={handleDelete}
            >
              Copy
            </span>
          </div>
        )}
      </div>
      <div>
        <CodeEditor
          options={{ readOnly, minimap: { enabled: false }, outerHeight: 500 }}
          handleCodeUpdate={handleCodeUpdate}
          codeDetails={codeDetails}
        />
      </div>
      <div className='my-8 py-8 flex flex-col justify-center border-4 p-4 rounded-lg border-grey-400 '>
        <div className='bg-slate-300  rounded-t-md '>
          <p className='p-3'>Share what u express by writing a comment</p>
        </div>
        {userComments.length > 0 ? (
          userComments.map((el: any, index) => {
            return (
              <React.Fragment key={index}>
                <CommentBox
                  commentDetails={el}
                  authUser={authUser}
                  handleCommentUpdate={handleCommentUpdate}
                  handleCommentDelete={handleCommentDelete}
                />
              </React.Fragment>
            );
          })
        ) : (
          <Divider plain>No comments</Divider>
        )}
        <div>
          <textarea
            placeholder='Leave a comment'
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='bg-slate-100 w-full p-3 placeholder-[#333333ad] min-h-[100px] outline-none border-4 border-sky-200 rounded-lg focus:border-green-400'
          />
        </div>
        <div className='self-end'>
          <button
            className={'enabled:hover:bg-blue-100'}
            disabled={comment.length == 0 ? true : false}
            onClick={onSubmitComment}
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};
export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return ProtectedPageRoute(ctx, null, async () => {
    const axiosInstance = getFetcher(ctx.req);
    const { params } = ctx;
    const {
      data: { data },
    } = await axiosInstance.get(`code/${params.codeId}/`);

    return {
      data: {
        codeDetails: data.code,
        comments: data.comments,
      },
    };
  });
}
export default CodeDetail;
