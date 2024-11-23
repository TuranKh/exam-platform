import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DatePickerProps = {
  date: string | null;
  setDate: (date: string | null) => void;
  maxDate: Date | null;
  minDate: Date | null;
};

const DatePicker: React.FC<DatePickerProps> = function ({
  date,
  setDate,
  maxDate = null,
  minDate = new Date("1900-01-01"),
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
          {date ? format(date, "PPP") : <span>Tarix seçin</span>}
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
