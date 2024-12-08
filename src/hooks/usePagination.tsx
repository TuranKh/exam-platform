import { Dispatch, SetStateAction, useEffect, useState } from "react";

const initialPage = 0;
const initialPerPage = 10;

export default function usePagination(perPageProp?: number): PaginationDetails {
  const [page, setPage] = useState(initialPage);
  const [totalRowsNumber, setTotalRowsNumber] = useState(0);
  const [perPage, setPerPage] = useState(perPageProp || initialPerPage);

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
