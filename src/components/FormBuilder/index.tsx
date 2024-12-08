import { Fragment, useCallback } from "react";
import DatePicker from "../Datepicker";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import "./FormBuilder.scss";

export enum FormFieldType {
  Text = "text",
  Number = "number",
  Password = "password",
  Select = "select",
  DatePicker = "date-picker",
  TextArea = "text-area",
  Switch = "switch",
  Checkbox = "checkbox",
  Radio = "radio",
  Slider = "slider",
  CustomElement = "custom-element",
}

type OptionsValue = string | number | null;
type DateInputValue = Date | null;

export type InputDetails = {
  label: string;
  key: string;
  type: FormFieldType;
};

export type AvailableValues = OptionsValue | DateInputValue | boolean;

export type FormChangeProps = {
  [key: string]: AvailableValues;
};

export type FormDetails = {
  inputs: Array<InputDetails>;
  options?: Record<string, Array<{ label: string; value: OptionsValue }>>;
  onChange: (details: FormChangeProps) => void;
  values: Record<string, AvailableValues>;
};

export default function FormBuilder({ form }: { form: FormDetails }) {
  const renderField = useCallback(
    (inputDetails: InputDetails) => {
      const formFieldDetails = {
        ...inputDetails,
        onChange: form.onChange,
        value: form.values[inputDetails.key],
      };

      switch (formFieldDetails.type) {
        case FormFieldType.Text:
        case FormFieldType.Number:
        case FormFieldType.Password:
          return (
            <Input
              type={
                formFieldDetails.type === FormFieldType.Password
                  ? "password"
                  : "text"
              }
              placeholder={formFieldDetails.label}
              value={formFieldDetails.value as string}
              onChange={(e) =>
                form.onChange({
                  [formFieldDetails.key]: e.target.value,
                })
              }
            />
          );
        case FormFieldType.Select:
          return (
            <>
              {JSON.stringify(!!formFieldDetails.value)}
              <Select
                value={
                  formFieldDetails.value
                    ? String(formFieldDetails.value)
                    : undefined
                }
                onValueChange={(value) => {
                  form.onChange({ [formFieldDetails.key]: value });
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={formFieldDetails.label || "Temporary"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {form.options?.[formFieldDetails.key]?.map((option) => (
                      <SelectItem value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </>
          );
        case FormFieldType.DatePicker:
          return (
            <DatePicker
              setDate={(date) => {
                formFieldDetails.onChange({
                  [formFieldDetails.key]: date,
                });
              }}
              date={formFieldDetails.value as string}
            />
          );
        case FormFieldType.Switch:
          return (
            <Switch
              checked={formFieldDetails.value as boolean}
              onCheckedChange={(checked) => {
                form.onChange({ [formFieldDetails.key]: checked });
              }}
            />
          );
        default:
          return null;
      }
    },
    [form],
  );

  return (
    <div onSubmit={(event) => event.preventDefault()} className='form-builder'>
      {form.inputs.map((details) => (
        <Fragment key={details.key}>
          <div className='form-field'>{renderField(details)}</div>
        </Fragment>
      ))}
    </div>
  );
}
