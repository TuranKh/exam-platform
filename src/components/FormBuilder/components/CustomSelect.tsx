import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvailableValues, FormChangeProps, OptionsValue } from "..";

export default function CustomSelect({
  formFieldDetails,
  options,
}: {
  formFieldDetails: {
    onChange: (details: FormChangeProps) => void;
    value: AvailableValues;
    label: string;
    key: string;
  };
  options: { label: string; value: OptionsValue }[];
}) {
  return (
    <Select
      value={formFieldDetails.value ? String(formFieldDetails.value) : ""}
      onValueChange={(value) => {
        formFieldDetails.onChange({ [formFieldDetails.key]: value });
      }}
    >
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={formFieldDetails.label || "Temporary"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem value={String(option.value)}>{option.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
