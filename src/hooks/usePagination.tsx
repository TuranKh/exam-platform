import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const initialPage = 0;
export const initialPerPage = 10;

export default function usePagination(perPageProp?: number): PaginationDetails {
  const [page, setPage] = useState(initialPage);
  const [totalRowsNumber, setTotalRowsNumber] = useState(0);
  const [perPage, setPerPage] = useState(initialPerPage);

  useEffect(() => {
    setPage(initialPage);
  }, [perPage, totalRowsNumber]);

  useEffect(() => {
    if (perPageProp) {
      setPerPage(perPageProp);
    }
  }, [perPageProp]);

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
  if (!paginationDetails) {
    return [0, 100];
  }
  if (paginationDetails.page == null || paginationDetails.perPage == null) {
    return [
      initialPage * initialPerPage,
      (initialPage + 1) * initialPerPage - 1,
    ];
  }

  return [
    paginationDetails.page * paginationDetails.perPage,
    (paginationDetails.page + 1) * paginationDetails.perPage - 1,
  ];
};
