import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Delete, Edit, EllipsisVertical, Eye } from "lucide-react";

export default function ActionsDropdown({
  onDelete,
  onEdit,
  onView,
}: {
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='link'>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[--radix-dropdown-menu-trigger-width] min-w-36 rounded-lg'
        align='start'
        side='left'
        sideOffset={4}
      >
        <DropdownMenuGroup>
          {onEdit && (
            <DropdownMenuItem className='cursor-pointer' onClick={onEdit}>
              <Edit />
              Redaktə et
            </DropdownMenuItem>
          )}
          {onView && (
            <DropdownMenuItem className='cursor-pointer' onClick={onView}>
              <Eye />
              Baxış keçir
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {onDelete && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onDelete} className='cursor-pointer'>
              <Delete />
              Sil
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
