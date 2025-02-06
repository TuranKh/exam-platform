import { Icons } from "../Icons";
import "./Loader.scss";

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='w-20 flex flex-col gap-2 justify-center items-center'>
        <Icons.loading />
        <p className='whitespace-nowrap'>Zəhmət olmasa gözləyin...</p>
      </div>
    </div>
  );
}
