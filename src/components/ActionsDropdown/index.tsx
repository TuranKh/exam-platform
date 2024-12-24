import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CirclePlay, Delete, Edit, EllipsisVertical, Eye } from "lucide-react";

export default function ActionsDropdown({
  onDelete,
  onEdit,
  onView,
  onStart,
  title,
}: {
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
  onStart?: () => void;
  title: string;
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
          {onStart && (
            <DropdownMenuItem
              className='cursor-pointer whitespace-nowrap	'
              onClick={onStart}
            >
              <CirclePlay />
              {title || "Başla"}
            </DropdownMenuItem>
          )}
          {onView && (
            <DropdownMenuItem className='cursor-pointer' onClick={onView}>
              <Eye />
              Baxış keçir
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        {onDelete && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onDelete} className='cursor-pointer'>
              <Delete />
              Sil
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
