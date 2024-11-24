import { Fragment, memo, useCallback } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import DatePicker from "./Datepicker";

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

type InputDetails = {
  label: string;
  key: string;
  type: FormFieldType;
};

type FormChangeProps = {
  value: OptionsValue | DateInputValue;
  key: string;
};

type FormDetails = {
  inputs: Array<InputDetails>;
  options: Record<string, Array<{ label: string; value: OptionsValue }>>;
  onChange: (details: FormChangeProps) => void;
  values: Record<string, OptionsValue | DateInputValue>;
};

const FormVisualizer = memo(({ form }: { form: FormDetails }) => {
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
              value={formFieldDetails.value}
              onChange={(e) =>
                form.onChange({
                  [formFieldDetails.key]: e.target.value,
                } as Record<string, unknown>)
              }
            />
          );
        case FormFieldType.Select:
          return (
            <Select
              value={formFieldDetails.value}
              onChange={(value) =>
                form.onChange({ [formFieldDetails.key]: value } as Record<
                  string,
                  unknown
                >)
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {formFieldDetails.options?.map((option) => (
                    <SelectItem value={option.value}></SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        case FormFieldType.DatePicker:
          return <DatePicker />;
        case FormFieldType.Switch:
          return (
            <Switch
              checked={formFieldDetails.value}
              onChange={(checked) =>
                form.onChange({ [formFieldDetails.key]: checked })
              }
            />
          );
        default:
          return null;
      }
    },
    [form],
  );

  return (
    <form className='form-visualizer'>
      {form.inputs.map((details) => (
        <Fragment key={details.key}>
          <div className='form-field'>
            {details.label && (
              <label className='form-label'>{details.label}</label>
            )}
            {renderField(details)}
          </div>
        </Fragment>
      ))}
    </form>
  );
});

export default FormVisualizer;
