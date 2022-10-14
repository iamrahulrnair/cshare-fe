import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined, InfoOutlined } from '@ant-design/icons';
const { confirm } = Modal;

import CodeEditor from '../../components/CodeEditor';
import { useRouter } from 'next/router';
import { getCookie } from '../../utils/auth';

const CodeDetail: NextPage = (props: any) => {
  const codeDetails = props.data;
  const authUser = props.authUser;
  const matchCode = authUser.username + '/' + codeDetails.extension;
  const [readOnly, setReadOnly] = useState(true);
  const router = useRouter();

  try {
    codeDetails.code = JSON.parse(codeDetails.code);
  } catch (err: any) {}

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
                  headers: { 'X-CSRFToken': getCookie('csrftoken')! },
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
  return (
    <div className='mx-[120px] my-[auto] py-10'>
      <h1>Code Detail</h1>
      <div className=' bg-slate-400 px-3 py-4 rounded-t-md'>
        <p>{codeDetails.description}</p>
        {authUser.email == codeDetails.user_details.email ? (
          <div>
            <button onClick={() => setReadOnly(false)}>Edit</button>
            <Button onClick={handleDelete}>Delete</Button>
          </div>
        ) : (
          <div>
            <button>Fork</button>
          </div>
        )}
      </div>
      <div>
        <CodeEditor
          options={{ readOnly, minimap: { enabled: false }, outerHeight: 500 }}
          updateCodeState={() => {}}
          codeDetails={codeDetails}
        />
      </div>
      <div className='my-8 py-8 flex flex-col justify-center '>
        <div className='bg-slate-400  rounded-t-md'>
          <p className='p-3'>Share what u express by writing a comment</p>
        </div>
        <div>
          <textarea
            placeholder='Leave a comment'
            rows={4}
            className='bg-slate-100 w-full p-3 placeholder-[#333333ad] min-h-[100px] outline-none border-4 border-sky-200 rounded-lg focus:border-green-400'
          />
        </div>
        <div className='self-end'>
          <button>Comment</button>
        </div>
      </div>
    </div>
  );
};
export async function getServerSideProps({ params }: any) {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/code/${params.codeId}/`
    );
    console.log(res.data);
    return {
      props: {
        data: res.data,
      },
    };
  } catch (err: any) {
    return {
      notFound: true,
    };
  }
}
export default CodeDetail;
