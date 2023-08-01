import Link from 'next/link';
import React from 'react';

function Custom404() {
  return (
    <div className='h-[80vh] sm:h-[80vh] flex justify-center items-center flex-col'>
      <h1 className='text-center'>
        <span className='font-extrabold'>
          OOPS &apos;404&apos;... check out my projects@
          <Link
          rel='noopener noreferrer'
          target='_blank'
            className='underline cursor-pointer text-7xl'
            href='https://github.com/iamrahulrnair/'
          >
            github
          </Link>
        </span>
      </h1>
      <p>click <Link href="/">here</Link> to go to home</p>
    </div>
  );
}

export default Custom404;
