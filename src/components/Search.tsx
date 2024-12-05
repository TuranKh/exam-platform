import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import FormBuilder, {
  AvailableValues,
  FormChangeProps,
  FormDetails,
} from "./FormBuilder";

const initialSearchValue = {} as any;

export default function Search<T>({
  onReset,
  onSearch,
  formDetails,
}: {
  onSearch: (params: Record<keyof T, AvailableValues>) => void;
  onReset: () => void;
  formDetails: Pick<FormDetails, "inputs" | "options">;
}) {
  const [searchForm, setSearchForm] =
    useState<Record<keyof T, AvailableValues>>(initialSearchValue);

  const handleResetAll = () => {
    setSearchForm(initialSearchValue);
    onReset();
  };

  const onSearchClick = function () {
    onSearch(searchForm);
  };

  const onFormChange = function (details: FormChangeProps) {
    setSearchForm((current) => {
      return {
        ...current,
        ...details,
      };
    });
  };

  return (
    <>
      <div className='flex items-end flex-wrap gap-2'>
        <FormBuilder
          form={{
            ...formDetails,
            onChange: onFormChange,
            values: searchForm,
          }}
        />

        <Button onClick={onSearchClick}>Axtar</Button>
        <Button variant='secondary' onClick={handleResetAll}>
          Axtarışı sıfırla
          <RotateCcw />
        </Button>
      </div>
    </>
  );
}
