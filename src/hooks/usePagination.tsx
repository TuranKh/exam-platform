import { useEffect, useState } from "react";

const initialPage = 0;
const initialPerPage = 15;

export default function usePagination() {
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
