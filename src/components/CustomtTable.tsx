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
import { Loader } from "lucide-react";

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPageOptions?: number[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  initialPage?: number;
  isLoading?: boolean;
}

interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => any);
  render?: (rowData: T, rowIndex: number) => React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

export default function CustomTable<T>({
  columns,
  data,
  isLoading = false,
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <div className='flex justify-center items-center h-24'>
                  <Loader className='animate-spin' />
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={column.className}
                    style={{ textAlign: column.align || "left" }}
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : column.accessor
                      ? (row as any)[column.accessor]
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='text-center py-4 text-gray-500'
              >
                Məlumat yoxdur
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className='mt-4'>
        {paginatedData.length > 0 && !isLoading && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
