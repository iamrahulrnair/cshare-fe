import { Avatar, Badge } from 'antd';
import Link from 'next/link';
import React from 'react';
import { CodeBlock } from '../code';

export function UserCodes({ user_details, codes }) {
  return (
    <div className='flex flex-col gap-4'>
      {codes.map((code) => (
       <React.Fragment key={code.id}>
        <Badge.Ribbon
          text={code.is_public ? 'Public' : 'Private'}
          color={code.is_public ? '#bfdb38' : '#a5d6a7'}
        >
          <div className='flex flex-col gap-2 p-4'>
            <div className='flex gap-2'>
              <Avatar size='large' src={user_details.image} />
              <div className='flex flex-col'>
                <div className=' flex gap-4 px-2'>
                  <Link
                    href={`/users/${user_details.username}`}
                    className='inline-block'
                  >
                    <a>{user_details.username}</a>
                  </Link>
                  /
                  <Link href={`/code/${code.id}`} className='inline-block'>
                    <a>{code.extension}</a>
                  </Link>
                </div>
                <p className='subscript px-2'>Created: {code.created_at}</p>
                <p className='subscript px-2'>{code.extension}</p>
                <div className='min-w-[80rem] max-h-[50rem] overflow-hidden rounded-lg mt-2'>
                  <Link href={`/code/${code.id}`} className='inline-block'>
                    <CodeBlock
                      code={code.code}
                      language={code.extension.split('.').pop()}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Badge.Ribbon>
       </React.Fragment>
      ))}
    </div>
  );
}
