import { Eraser } from "lucide-react";

export default function BulkActions({ count }: { count: number }) {
  return (
    <div className='flex absolute bottom-8 left-1/2 items-center space-x-4 rounded-xl border border-gray-300 bg-white p-4 shadow-lg w-fit transform -translate-x-1/2'>
      <span className='flex items-center space-x-2 text-gray-500'>
        <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700'>
          {count}
        </span>
        <span className='text-sm font-medium'>selected</span>
      </span>
      <div className='h-6 w-px bg-gray-300' />
      <button
        type='button'
        className='flex items-center space-x-2 text-red-600 hover:text-red-700'
      >
        <Eraser className='h-5 w-5' />
        <span className='text-sm font-medium'>Delete</span>
      </button>
    </div>
  );
}
