import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgePlus, CircleDot, CopyCheck, LetterText } from "lucide-react";
import { Input } from "./ui/input";

export function AddQuestion() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          Sual əlavə et
          <BadgePlus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Sualın detallarını seçin</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='justify-between'>
            Birneçə seçim
            <CopyCheck color='grey' />
          </DropdownMenuItem>
          <DropdownMenuItem className='justify-between'>
            Tək seçim
            <CircleDot color='grey' />
          </DropdownMenuItem>
          <DropdownMenuItem className='justify-between'>
            Açıq sual
            <LetterText color='grey' />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div>
            <Input placeholder='Sual sayı' type='number' />
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
