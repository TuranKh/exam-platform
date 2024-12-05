import { cn } from "@/lib/utils";
import { format, setDefaultOptions } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { az } from "date-fns/locale";

type DatePickerProps = {
  date: string | null;
  setDate: (date: string | null) => void;
  maxDate?: Date | null;
  minDate?: Date | null;
};

setDefaultOptions({ locale: az });

const DatePicker: FC<DatePickerProps> = function ({
  date,
  setDate,
  maxDate = null,
  minDate = null,
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PP") : <span>Tarix seçin</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(date) => {
            if (maxDate) {
              return date > maxDate || date < minDate;
            }

            return date < minDate;
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
