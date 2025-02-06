import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import { AvailableValues, FormChangeProps } from "../FormBuilder";
import { Option } from "../FormBuilder/components/CustomSelect";

export function Autocomplete({
  formFieldDetails,
  options,
}: {
  formFieldDetails: {
    onChange: (details: FormChangeProps) => void;
    value: AvailableValues;
    label: string;
    key: string;
  };
  options: Option[];
}) {
  const [open, setOpen] = useState(false);

  const foundOption = useMemo(() => {
    const result = options.find(
      (optionDetails) => optionDetails.value === formFieldDetails.value,
    )?.label;

    return result;
  }, [options, formFieldDetails.value]);

  const findId = useCallback(
    (value: string) => {
      const selectedOption = options.find(
        (optionDetails) => optionDetails.label === value,
      );

      formFieldDetails.onChange({
        [formFieldDetails.key]: selectedOption?.value || null,
      });
      setOpen(false);
    },
    [options, formFieldDetails],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[250px] justify-between'
        >
          {formFieldDetails.value ? foundOption : formFieldDetails.label}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[250px] p-0'>
        <Command>
          <CommandInput placeholder='Axtarış edin' className='h-9' />
          <CommandList>
            <CommandEmpty>Nəticə tapılmadı</CommandEmpty>
            <CommandGroup>
              {options.map((optionDetails) => (
                <CommandItem
                  key={optionDetails.value}
                  value={optionDetails.value}
                  onSelect={findId}
                >
                  {optionDetails.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      formFieldDetails.value === optionDetails.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
