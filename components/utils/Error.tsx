export function Error({ msg }: { msg: string | undefined }) {
  if (msg) {
    return (
      <div className='bg-red-200 h-[30px] flex justify-center items-center rounded-md'>
        {msg}
      </div>
    );
  }
  return <></>;
}
