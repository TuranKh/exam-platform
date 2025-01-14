import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationDetails } from "@/hooks/usePagination";
import { Loader } from "lucide-react";
import { ReactNode, useMemo } from "react";
import CustomPagination from "./CustomPagination";
import { Checkbox } from "./ui/checkbox";

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  itemsPerPageOptions?: number[];
  paginationDetails: PaginationDetails;
  isLoading?: boolean;
  addCheckbox?: boolean;
}

export default function CustomTable<T>({
  columns,
  data,
  isLoading = false,
  paginationDetails,
  addCheckbox = false,
}: CustomTableProps<T>) {
  const relativeRowNumber = useMemo(() => {
    return paginationDetails.page * paginationDetails.perPage + 1;
  }, [paginationDetails.page, paginationDetails.perPage]);

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
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                {columns.map((column, colIndex) => {
                  return (
                    <>
                      <TableCell
                        key={colIndex}
                        className={column.className}
                        style={{ textAlign: column.align || "left" }}
                      >
                        {colIndex === 0 && addCheckbox ? (
                          <Checkbox />
                        ) : column.Render ? (
                          column.Render(
                            row,
                            rowIndex,
                            relativeRowNumber + rowIndex,
                          )
                        ) : column.accessor ? (
                          (row as any)[column.accessor]
                        ) : null}
                      </TableCell>
                    </>
                  );
                })}
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
        {!isLoading && paginationDetails && (
          <CustomPagination paginationDetails={paginationDetails} />
        )}
      </div>
    </div>
  );
}

export type Column<T> =
  | {
      header: string;
      align: string;
      className?: string;
    } & (
      | {
          Render: (
            data: T,
            rowIndex: number,
            relativeRowNumber: number,
          ) => ReactNode;
          accessor?: string;
        }
      | {
          accessor: keyof T;
          Render?: never;
        }
    );
