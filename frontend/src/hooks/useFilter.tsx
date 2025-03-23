import { AvailableValues } from "@/components/FormBuilder";
import { useEffect, useRef } from "react";

export type Filter<T> = Record<keyof T, AvailableValues>;

export default function useFilter<T>(initialState) {
  const filter = useRef<Filter<T>>(initialState || ({} as Filter<T>));

  useEffect(() => {
    return () => {
      filter.current = {} as Filter<T>;
    };
  }, []);

  const resetFilters = function () {
    filter.current = {} as Filter<T>;
  };

  const setFilters = function (newFilter: Filter<T>) {
    filter.current = newFilter;
  };

  return {
    filters: filter.current,
    resetFilters,
    setFilters,
  };
}
