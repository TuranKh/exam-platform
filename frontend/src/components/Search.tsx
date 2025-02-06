import { Button } from "@/components/ui/button";
import { Loader, RotateCcw } from "lucide-react";
import { useState } from "react";
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
  isLoading = false,
}: {
  onSearch: (params: Record<keyof T, AvailableValues>) => void;
  onReset: () => void;
  formDetails: Pick<FormDetails, "inputs" | "options">;
  isLoading?: boolean;
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearchClick();
      }}
      className='flex items-end flex-wrap gap-2'
    >
      <FormBuilder
        form={{
          ...formDetails,
          onChange: onFormChange,
          values: searchForm,
        }}
      />

      <Button
        className='hover:shadow-lg duration-200'
        disabled={isLoading}
        type='submit'
      >
        Axtar
        {isLoading && <Loader className='animate-spin' />}
      </Button>
      <Button
        className='hover:shadow-lg duration-200'
        variant='secondary'
        onClick={handleResetAll}
      >
        Axtarışı sıfırla
        <RotateCcw />
      </Button>
    </form>
  );
}
