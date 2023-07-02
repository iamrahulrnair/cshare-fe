import { GetServerSidePropsContext, NextPage } from 'next';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { Modal, Divider, Select, Button } from 'antd';
import {
  CheckOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
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
import { DebounceSelect } from '../../components/utils/DebounceSelect';
import Link from 'next/link';

const CodeDetail: NextPage = (props: any) => {
  const { role: userRole, type: codeType } = props.meta;
  const BASE_URL = props.base_url;
  const { codeDetails } = props.data;
  const { setUserVerified } = props;
  const router = useRouter();

  const { authUser, setAuthUser } = useContext(AuthContext);
  const [readOnly, setReadOnly] = useState(true);
  const [comment, setComment] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [userSearchValues, setUserSearchValues] = useState([]);
  const [userSearchItems, setUserSearchItems] = useState([]);
  const [usersRole, setUsersRole] = useState('viewer');
  const [userShareToken, setUserShareToken] = useState(null);

  const CODE_OWNER = authUser.email == codeDetails.user_details.email;
  const PRIMARY_PREVILAGE =
    codeType == 'shareable' && userRole == 'editor' && authUser.isAuthenticated;

  const { data: comments } = useSelector<
    { comments: { data: any[] } },
    { data: any[] }
  >((state) => state.comments);
  const [doFetchComments] = useThunk(fetchComments);
  const [doAddComment, addCommentsError] = useThunk(addComment);
  const [doUpdateComment, updateCommentsError] = useThunk(updateComment);
  const [doRemoveComment, removeCommentsError] = useThunk(removeComment);

  useEffect(() => {
    doFetchComments(codeDetails.id);
  }, [doFetchComments, codeDetails.id]);

  useEffect(() => {
    if (authUser.isAuthenticated) {
      if (authUser.is_verified) {
        setUserVerified(true);
      } else {
        setUserVerified(false);
      }
    }
  }, [authUser]);

  if (authUser.isAuthenticated === false && router.query._share_id) {
    if (window !== undefined) {
      window.location.href = `/auth/login?next=/code/${codeDetails.id}?_share_id=${router.query._share_id}`;
    }
  }
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
            Type in the name{' '}
            <strong>{authUser.username + '/' + codeDetails.extension}</strong>{' '}
            to confirm deletion. This action cannot be undone.
          </p>
          <input
            onChange={(e) => {
              if (
                e.target.value ===
                authUser.username + '/' + codeDetails.extension
              ) {
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

  const handleCodeUpdate = async (code: string) => (codeDetails.code = code);

  const handleCodePatch = async () => {
    const code = codeDetails.code;
    const axiosInstance = getFetcher();
    const req_path = router.query._share_id
      ? `code/${codeDetails.id}/?_share_id=${router.query._share_id}`
      : `code/${codeDetails.id}/`;
    try {
      await axiosInstance.patch(req_path, {
        code,
      });
      toast.success('Code updated successfully');
      setCopySuccess(false);
    } catch (err: any) {
      console.log(err);
      router.push(`/auth/login?next=/code/${codeDetails.id}`);
    }
  };

  function handleCopy(newClip: string) {
    navigator.clipboard.writeText(newClip).then(
      () => {
        setCopySuccess(true);
      },
      () => {
        setCopySuccess(false);
      }
    );
  }
  const handleShare = () => setShareModalOpen(true);
  const shareModalHandleCancel = () => setShareModalOpen(false);

  async function shareModalHandleOk() {
    const parsedPayload = {
      code: codeDetails.id,
      role: usersRole,
      users_to_share: userSearchValues.map((user) => {
        return user.value;
      }),
    };
    if (parsedPayload.users_to_share.length == 0) {
      toast.error('Please select atleast one user');
      return;
    }

    const axiosInstance = getFetcher();
    setConfirmLoading(true);
    try {
      const response = await axiosInstance.post(`code/share/`, parsedPayload);
      setConfirmLoading(false);
      setUserShareToken(response.data.token);
      console.log(response.data);
    } catch (err) {
      setConfirmLoading(false);
      if (err.response.status == 401) {
        router.push(`/auth/login?next=/code/${codeDetails.id}`);
        return;
      }
      console.log(err);
    }
  }
  const handleUserSearch = (value): Promise<any> => {
    const axiosInstance = getFetcher(null, false);
    return axiosInstance
      .get<
        {
          id: number;
          username: string;
          image: string;
        }[]
      >(`core/search?users=${value}`)
      .then((res) => {
        setUserSearchItems(res.data);
        return res.data.map((user) => ({
          label: user.username,
          value: user.id,
        }));
      })
      .catch((err) => console.log(err));
  };

  if (!authUser.isAuthenticated && router.query._share_id) {
    return null;
  }

  return (
    <div className='mx-[120px] my-[auto] py-10'>
      <div className=' bg-slate-300 px-3 py-4 rounded-t-md flex gap-4 justify-between items-center'>
        <p className='mx-5'>{codeDetails.description}</p>
        {CODE_OWNER || PRIMARY_PREVILAGE ? (
          <div>
            <div className='flex justify-center items-center gap-2'>
              <span
                className='hover:text-blue-700 text-blue-500 cursor-pointer'
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
              {CODE_OWNER && (
                <>
                  <span
                    className='hover:text-red-700 text-red-500 cursor-pointer'
                    onClick={handleDelete}
                  >
                    Delete
                  </span>
                  <Divider type='vertical' />
                </>
              )}
              <span
                className='hover:text-blue-700 text-blue-500 cursor-pointer  flex items-center gap-2'
                onClick={() => handleCopy(codeDetails.code)}
              >
                {copySuccess ? 'Copied' : 'Copy'}
                {copySuccess ? (
                  <CheckOutlined className='text-gray-900' />
                ) : (
                  <CopyOutlined className='text-gray-900' />
                )}
              </span>
              {CODE_OWNER && (
                <>
                  <Divider type='vertical' />
                  <span
                    onClick={handleShare}
                    className='hover:text-blue-700 text-blue-500 cursor-pointer flex items-center gap-2'
                  >
                    Share
                    <ShareAltOutlined className='text-gray-900' />
                  </span>
                </>
              )}
              <Modal
                title='Share code with others by assinging roles'
                open={shareModalOpen}
                onOk={shareModalHandleOk}
                onCancel={shareModalHandleCancel}
                okText='Create link'
                footer={[
                  <div key='1' className='flex'>
                    <Button
                      onClick={shareModalHandleCancel}
                      className='btn btn--danger flex justify-center items-center m-5 text-center'
                    >
                      Cancel
                    </Button>
                    {!userShareToken ? (
                      <Button
                        loading={confirmLoading}
                        onClick={shareModalHandleOk}
                        className={`btn btn--primary flex justify-center items-center m-5 text-center`}
                      >
                        Create link
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          const absoluteUrl = `${BASE_URL}/?_share_id=${userShareToken}`;
                          handleCopy(absoluteUrl);
                          toast.success('Link copied to clipboard');
                        }}
                        className='btn btn--success flex justify-center items-center m-5 text-center'
                      >
                        <ShareAltOutlined className='text-gray-900 text-3xl hover:text-green-700' />{' '}
                      </Button>
                    )}
                  </div>,
                ]}
              >
                <div className='flex flex-col gap-5'>
                  <div className='flex flex-col w-full'>
                    <label htmlFor='user'>Add user</label>
                    <DebounceSelect
                      className='input--user'
                      mode='multiple'
                      value={userSearchValues}
                      placeholder='Select users'
                      fetchOptions={handleUserSearch}
                      onChange={(newValue) => {
                        setUserShareToken(null);
                        setUserSearchValues(newValue);
                      }}
                      style={{ width: '100%' }}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          <Divider />
                          <div className='flex items-center gap-5 p-4'>
                            Choose Role:
                            <Select
                              defaultValue='viewer'
                              style={{ width: 120 }}
                              allowClear
                              value={usersRole}
                              onChange={(value) => {
                                setUsersRole(value);
                              }}
                              options={[
                                { value: 'editor', label: 'Editor' },
                                {
                                  value: 'viewer',
                                  label: 'Viewer',
                                },
                              ]}
                            />
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        ) : (
          <div>
            <span
              className='hover:text-red-700 text-blue-500 cursor-pointer  flex items-center gap-2'
              onClick={() => handleCopy(codeDetails.code)}
            >
              {copySuccess ? 'Copied' : 'Copy'}
              {copySuccess ? (
                <CheckOutlined className='text-gray-900' />
              ) : (
                <CopyOutlined className='text-gray-900' />
              )}
            </span>
          </div>
        )}
        {codeDetails.last_updated_by && (
          <div className='flex gap-3 p-2'>
            <span className='text-gray-500'>last edited by:</span>
            <span className='text-gray-900'>
              <Link href={`/users/${codeDetails.last_updated_by}`}>
                <a className='text-[15px] text-blue-500'>
                  {codeDetails.last_updated_by}
                </a>
              </Link>
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
                <React.Fragment key={comment.id}>
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
                disabled={comment.length == 0 ? true : false || authUser.is_verified == false}
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
  const req = ctx.req;
  const _share_id = ctx.query._share_id;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  try {
    const axiosInstance = getFetcher(ctx.req);
    const { params } = ctx;
    const req_path = _share_id
      ? `code/${params.codeId}/?_share_id=${_share_id}`
      : `code/${params.codeId}/`;
    const {
      data: { data },
    } = await axiosInstance.get(req_path);
    const absoluteUrl = new URL(`/code/${data.code.id}`, baseUrl);
    // We dont know if the user is authenticated or not, since it can be a public as well as private code.
    return {
      props: {
        data: {
          codeDetails: data.code,
          comments: data.comments,
        },
        base_url: absoluteUrl.href,
        meta: data.meta,
      },
    };
  } catch (err) {
    // if token expired or user is not authenticated
    if (err.response.status === 401) {
      const { params } = ctx;
      const axiosInstance = getFetcher(ctx.req, false);
      try {
        const {
          data: { data },
        } = await axiosInstance.get(`code/${params.codeId}/`);
        const absoluteUrl = new URL(`/code/${data.code.id}`, baseUrl);

        return {
          props: {
            data: {
              codeDetails: data.code,
              comments: data.comments,
            },
            base_url: absoluteUrl.href,
            meta: data.meta,
          },
        };
      } catch (err) {
        return {
          notFound: true,
        };
      }
    }

    return {
      notFound: true,
    };
  }
}
export default CodeDetail;
