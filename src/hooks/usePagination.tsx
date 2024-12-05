import { assert, error } from "console";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const initialPage = 0;
const initialPerPage = 15;

export default function usePagination(): PaginationDetails {
  const [page, setPage] = useState(initialPage);
  const [totalRowsNumber, setTotalRowsNumber] = useState(0);
  const [perPage, setPerPage] = useState(initialPerPage);

  useEffect(() => {
    setPage(initialPage);
  }, [perPage, totalRowsNumber]);

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    totalRowsNumber,
    setTotalRowsNumber,
  };
}

export type PaginationDetails = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  perPage: number;
  setPerPage: Dispatch<SetStateAction<number>>;
  totalRowsNumber: number;
  setTotalRowsNumber: Dispatch<SetStateAction<number>>;
};

export const calculateRange = function (
  paginationDetails?: Partial<PaginationDetails>,
): [number, number] {
  if (paginationDetails.page == null || paginationDetails.perPage == null) {
    return [initialPage * initialPerPage, (initialPage + 1) * initialPerPage];
  }

  return [
    paginationDetails.page * paginationDetails.perPage,
    (paginationDetails.page + 1) * paginationDetails.perPage,
  ];
};
