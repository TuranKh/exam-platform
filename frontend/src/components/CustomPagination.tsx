import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationDetails } from "@/hooks/usePagination";
import { useMemo } from "react";

interface CustomPaginationProps {
  paginationDetails: PaginationDetails;
  useEllipsis?: boolean;
  selectedRowsCount: number;
}

export default function CustomPagination({
  paginationDetails,
  selectedRowsCount,
}: CustomPaginationProps) {
  const totalPages = useMemo(() => {
    return Math.ceil(
      paginationDetails.totalRowsNumber / paginationDetails.perPage,
    );
  }, [paginationDetails.totalRowsNumber, paginationDetails.perPage]);

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const left = paginationDetails.page - 1;
      const right = paginationDetails.page + 1;

      if (left > 2) {
        pages.push("ellipsis");
      }

      const pageNumbers = [];
      for (
        let i = Math.max(2, left);
        i <= Math.min(right, totalPages - 1);
        i++
      ) {
        pageNumbers.push(i);
      }
      pages.push(...pageNumbers);

      if (right < totalPages - 1) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [paginationDetails.page, totalPages]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            hidden={paginationDetails.page === 1}
            onClick={(e) => {
              e.preventDefault();
              if (paginationDetails.page > 1) {
                paginationDetails.setPage(paginationDetails.page - 1);
              }
            }}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          } else {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href='#'
                  isActive={page - 1 === paginationDetails.page}
                  onClick={(e) => {
                    e.preventDefault();
                    paginationDetails.setPage((page - 1) as number);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
        })}

        <PaginationItem>
          <PaginationNext
            href='#'
            hidden={paginationDetails.page + 1 === totalPages}
            onClick={(e) => {
              e.preventDefault();
              if (paginationDetails.page < totalPages) {
                paginationDetails.setPage(paginationDetails.page + 1);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
