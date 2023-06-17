import { GetServerSidePropsContext, NextPage } from 'next';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { Modal, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

import { AuthContext } from '../../context/auth';
import { CodeEditor } from '../../components/code';
import { useRouter } from 'next/router';
import { CommentBox } from '../../components/comment';
import { getFetcher } from '../../utils/axios/axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {
  fetchComments,
  addComment,
  updateComment,
  removeComment,
} from '../../store/actions';
import { useThunk } from '../../hooks';
import { clearAuthCookies } from '../../utils/auth/cookie';

const CodeDetail: NextPage = (props: any) => {
  const { codeDetails } = props.data;
  const { isAuthenticated } = props;

  const { authUser, setAuthUser } = useContext(AuthContext);
  const [readOnly, setReadOnly] = useState(true);
  const [comment, setComment] = useState('');
  const router = useRouter();

  const { data: comments } = useSelector<
    { comments: { data: any[] } },
    { data: any[] }
  >((state) => state.comments);

  const [doFetchComments] = useThunk(fetchComments);
  const [doAddComment, addCommentsError] = useThunk(addComment);
  const [doUpdateComment, updateCommentsError] = useThunk(updateComment);
  const [doRemoveComment, removeCommentsError] = useThunk(removeComment);

  const COMMENT_PATH = `code/${codeDetails.id}/comments/`;
  const matchCode = authUser.username + '/' + codeDetails.extension;

  useEffect(() => {
    if (!isAuthenticated) {
      setAuthUser({ isAuthenticated: false });
    }
    doFetchComments(codeDetails.id);
  }, []);

  if (
    addCommentsError?.message == 'Request failed with status code 401' ||
    updateCommentsError?.message == 'Request failed with status code 401' ||
    removeCommentsError?.message == 'Request failed with status code 401'
  ) {
    window.location.href = `/auth/login?next=/code/${codeDetails.id}`;
    return;
  }

  const handleCommentCreate = async () => {
    doAddComment({ comment, codeId: codeDetails.id }, (result) => {
      setComment('');
    });
  };

  const handleCommentUpdate = async (id: string, comment: string) => {
    doUpdateComment({ comment, codeId: codeDetails.id, commentId: id });
  };

  const handleCommentDelete = async (id: string) => {
    doRemoveComment({ codeId: codeDetails.id, commentId: id });
  };

  // FOR CODE

  const handleDelete = () => {
    const axiosInstance = getFetcher();
    const model = confirm({
      title: 'Do you want to delete this code block?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Ok',
      okType: 'danger',
      okButtonProps: {
        disabled: true,
      },
      width: 700,
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
            className='w-full input--user'
          ></input>
        </div>
      ),
      onOk() {
        return new Promise((resolve, reject) => {
          (async () => {
            try {
              const res = await axiosInstance.delete(`code/${codeDetails.id}/`);
              resolve(res);
              router.push('/');
              toast.success('Code deleted successfully');
            } catch (err: any) {
              reject(err);
              if (err.response.status == 401) {
                router.push(`/auth/login?next=/code/${codeDetails.id}`);
                return;
              }
              toast.error('Something went wrong');
            }
          })();
        }).catch((err) => console.log(err));
      },
      onCancel() {},

      style: {
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      },
      bodyStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30rem',
      },
    });
  };

  function handleCopy() {}

  const handleCodeUpdate = async (code: string) => {
    codeDetails.code = code;
  };
  const handleCodePatch = async () => {
    const code = codeDetails.code;
    const axiosInstance = getFetcher();
    try {
      await axiosInstance.patch(`code/${codeDetails.id}/`, {
        code,
      });
      toast.success('Code updated successfully');
    } catch (err: any) {
      console.log(err);
      router.push(`/auth/login?next=/code/${codeDetails.id}`);
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
                onClick={handleCopy}
              >
                Copy
              </span>
            </div>
          </div>
        ) : (
          <div>
            <span
              className='hover:text-red-700 text-blue-500 cursor-pointer'
              onClick={handleCopy}
            >
              Copy
            </span>
          </div>
        )}
      </div>
      <div>
        <CodeEditor
          options={{ readOnly, outerHeight: 500 }}
          handleCodeUpdate={handleCodeUpdate}
          codeDetails={codeDetails}
          language={codeDetails.extension.split('.').pop()}
        />
      </div>
      <div className='my-8 py-8 flex flex-col justify-center border-2  p-10'>
        <div className='bg-slate-300'>
          <p className='p-5 text-center'>
            Share what u express by writing a comment
          </p>
        </div>
        {comments.length > 0 ? (
          comments.map(
            (
              comment: {
                id: number;
                comment: string;
                user_details: {
                  username: string;
                  email: string;
                  image: string;
                };
              },
              index
            ) => {
              return (
                <React.Fragment key={index}>
                  <CommentBox
                    commentDetails={comment}
                    authUser={authUser}
                    handleCommentUpdate={handleCommentUpdate}
                    handleCommentDelete={handleCommentDelete}
                  />
                </React.Fragment>
              );
            }
          )
        ) : (
          <Divider plain>No comments</Divider>
        )}
        {authUser.isAuthenticated && (
          <>
            <div className='mb-10'>
              <textarea
                placeholder='Leave a comment'
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='w-full textarea--user'
              />
            </div>
            <div className='self-end'>
              <button
                className='btn btn--primary'
                disabled={comment.length == 0 ? true : false}
                onClick={handleCommentCreate}
              >
                Comment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const axiosInstance = getFetcher(ctx.req);
    const { params } = ctx;
    const {
      data: { data },
    } = await axiosInstance.get(`code/${params.codeId}/`);

    return {
      props: {
        data: {
          codeDetails: data.code,
          comments: data.comments,
          isAuthenticated: true,
        },
      },
    };
  } catch (err) {
    // if token expired or user is not authenticated
    if (err.response.status === 401) {
      const { params } = ctx;
      const axiosInstance = getFetcher(ctx.req, false);
      const {
        data: { data },
      } = await axiosInstance.get(`code/${params.codeId}/`);

      return {
        props: {
          data: {
            codeDetails: data.code,
            comments: data.comments,
            isAuthenticated: false,
          },
        },
      };
    }

    return {
      notFound: true,
    };
  }
}
export default CodeDetail;
