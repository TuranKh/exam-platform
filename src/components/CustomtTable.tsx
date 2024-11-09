// DataTable.tsx
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import CustomPagination from "./CustomPagination";

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPageOptions?: number[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  initialPage?: number;
}

interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => any);
  render?: (rowData: T) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export default function CustomTable<T>({
  columns,
  data,
  itemsPerPageOptions = [5, 10, 20],
  initialPage = 1,
}: CustomTableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    itemsPerPageOptions[0],
  );

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, colIndex) => (
              <TableHead
                key={colIndex}
                className={column.className}
                style={{ textAlign: column.align || "left" }}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={column.className}
                  style={{ textAlign: column.align || "left" }}
                >
                  {column.render
                    ? column.render(row)
                    : column.accessor
                    ? (row as any)[column.accessor]
                    : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
