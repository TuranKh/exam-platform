import DatePicker from "@/components/Datepicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function Search<T>({
  filters,
  setFilters,
  children,
}: {
  filters: T;
  setFilters: Dispatch<SetStateAction<T>>;
  children: JSX.Element;
}) {
  const handleResetAll = () => {
    setFilters({} as T);
  };
  return (
    <>
      <div className='flex space-x-4 items-end'>
        <div className='w-1/4'>
          <Input
            placeholder='İmtahan Adı'
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>

        <div className='w-1/4'>
          <DatePicker
            maxDate={new Date()}
            date={filters.createdAt}
            setDate={(date) => setFilters({ ...filters, createdAt: date })}
          />
        </div>

        <div className='w-1/4'>
          <Select
            onValueChange={(value) =>
              setFilters({ ...filters, isActive: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value='null'>Hamısı</SelectItem>
                <SelectItem value='true'>Aktiv</SelectItem>
                <SelectItem value='false'>Passiv</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {children}
        <Button variant='secondary' onClick={handleResetAll} className='mt-4'>
          Axtarışı sıfırla
          <RotateCcw />
        </Button>
      </div>
    </>
  );
}
