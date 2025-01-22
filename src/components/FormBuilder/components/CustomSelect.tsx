import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvailableValues, FormChangeProps, OptionsValue } from "..";

export type Option = {
  label: string;
  value: OptionsValue;
};

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
  options: Option[];
}) {
  return (
    <Select
      value={formFieldDetails.value ? String(formFieldDetails.value) : ""}
      onValueChange={(value) => {
        formFieldDetails.onChange({ [formFieldDetails.key]: value });
      }}
    >
      <SelectTrigger className='w-full border' style={inputStyling}>
        <SelectValue placeholder={formFieldDetails.label || "Temporary"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.length ? (
            options?.map((option) => (
              <SelectItem value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value={null}>Seçim yoxdur</SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const inputStyling = {
  border: "1px solid hsl(var(--input))",
  color: "hsl(var(--muted-foreground))",
};
