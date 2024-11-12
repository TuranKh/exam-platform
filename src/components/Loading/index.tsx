import "./Loader.scss";

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='loader book'>
        <figure className='page'></figure>
        <figure className='page'></figure>
        <figure className='page'></figure>
      </div>
    </div>
  );
}
