import { MousePointerClick } from "lucide-react";
import { ReactElement } from "react";

export default function BulkActions({
  rowIds,
  clearSelection,
  additionalBulkActions,
}: {
  rowIds: Set<number>;
  clearSelection: () => void;
  additionalBulkActions?: (rowIds: Set<number>) => ReactElement;
}) {
  return (
    <div className='flex absolute bottom-8 left-1/2 items-center space-x-4 rounded-xl border border-gray-300 bg-white p-4 shadow-lg w-fit transform -translate-x-1/2'>
      <span className='flex items-center space-x-2 text-gray-500'>
        <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-700'>
          {rowIds.size}
        </span>
        <span className='text-sm font-medium'>seçilib</span>
      </span>
      <div className='h-6 w-px bg-gray-300' />
      <button
        onClick={clearSelection}
        type='button'
        className='flex items-center space-x-2 duration-100 text-blue-600 hover:text-blue-700'
      >
        <MousePointerClick className='h-5 w-5' />
        <span className='text-sm font-medium'>Seçimi təmizlə</span>
      </button>
      {additionalBulkActions?.(rowIds)}
    </div>
  );
}
