import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { PaginationDetails } from "@/hooks/usePagination";
import { Loader } from "lucide-react";
import { ReactElement, ReactNode, useMemo, useState } from "react";
import CustomPagination from "./CustomPagination";
import { Checkbox } from "./ui/checkbox";
import BulkActions from "./BulkActions";

interface CustomTableProps<T extends { id: number }> {
  columns: Column<T>[];
  data: T[];
  itemsPerPageOptions?: number[];
  paginationDetails: PaginationDetails;
  isLoading?: boolean;
  addCheckbox?: boolean;
  bulkActions?: (rowIds: Set<number>) => ReactElement;
}

export default function CustomTable<T extends { id: number }>({
  columns,
  data,
  isLoading = false,
  paginationDetails,
  addCheckbox = false,
  bulkActions,
}: CustomTableProps<T>) {
  const relativeRowNumber = useMemo(() => {
    return paginationDetails.page * paginationDetails.perPage + 1;
  }, [paginationDetails.page, paginationDetails.perPage]);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());

  const toggleSelectAll = function (checkboxValue: boolean) {
    if (allSelected === "indeterminate") {
      setSelectedRowIds(new Set());
      return;
    }

    if (checkboxValue) {
      setSelectedRowIds((current) => {
        const arr = [...current, ...data.map((details) => details.id)];
        return new Set(arr);
      });
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const allSelected = useMemo(() => {
    const rowsNumber = paginationDetails.totalRowsNumber || data.length;
    if (rowsNumber === 0) {
      return false;
    }
    const allSelected = selectedRowIds.size === rowsNumber;
    if (allSelected) {
      return true;
    }

    if (selectedRowIds.size) {
      return "indeterminate";
    }

    return false;
  }, [paginationDetails.totalRowsNumber, selectedRowIds, data]);

  const toggleColumnCheck = function (checked: boolean, rowId: number) {
    setSelectedRowIds((current) => {
      const currentValues = new Set(current);
      if (checked) {
        currentValues.add(rowId);
      } else {
        currentValues.delete(rowId);
      }
      return currentValues;
    });
  };

  const clearSelection = function () {
    setSelectedRowIds(new Set());
  };

  return (
    <div className='custom-table'>
      <Table>
        <TableHeader>
          <TableRow>
            {addCheckbox && (
              <TableHead>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
            )}
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
                {addCheckbox && (
                  <TableCell>
                    <Checkbox
                      onCheckedChange={(checked) =>
                        toggleColumnCheck(checked as boolean, row.id)
                      }
                      checked={selectedRowIds.has(row.id)}
                      // checked={"indeterminate"}
                    />
                  </TableCell>
                )}
                {columns.map((column, colIndex) => {
                  return (
                    <TableCell
                      key={colIndex}
                      className={column.className}
                      style={{
                        textAlign: column.align || "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          textAlign: column.align || "left",
                          justifyContent: column.align || "left",
                        }}
                      >
                        {column.Render
                          ? column.Render(
                              row,
                              rowIndex,
                              relativeRowNumber + rowIndex,
                            )
                          : column.accessor
                          ? (row as any)[column.accessor]
                          : null}
                      </div>
                    </TableCell>
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
          <CustomPagination
            selectedRowsCount={selectedRowIds.size}
            paginationDetails={paginationDetails}
          />
        )}
      </div>
      <motion.div
        initial={{ display: "none", opacity: 0, height: 0 }}
        animate={
          selectedRowIds.size
            ? { opacity: 1, height: "auto", display: "block" }
            : { opacity: 0, height: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        <BulkActions
          additionalBulkActions={bulkActions}
          clearSelection={clearSelection}
          rowIds={selectedRowIds}
        />
      </motion.div>
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
