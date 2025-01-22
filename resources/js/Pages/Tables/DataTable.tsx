import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    const handleExportExcel = () => {
        const wb = XLSX.utils.book_new();
        const visibleColumns = columns.filter(
            (col) => !columnVisibility[col["accessorKey" as keyof typeof col] as string]
        );
        const exportData = data.map((row) => {
            const rowData: Record<string, any> = {};
            visibleColumns.forEach((col) => {
                const key = col["accessorKey" as keyof typeof col] as string;
                rowData[key] = (row as any)[key];
            });
            return rowData;
        });
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, "table-data.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const visibleColumns = columns.filter(
            (col) => !columnVisibility[col["accessorKey" as keyof typeof col] as string]
        );
        autoTable(doc, {
            head: [visibleColumns.map((col) => col["accessorKey" as keyof typeof col] as string)],
            body: data.map((row) =>
                visibleColumns.map(
                    (col) => (row as any)[col["accessorKey" as keyof typeof col] as string]
                )
            ),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] },
        });
        doc.save("table-data.pdf");
    };

    return (
        <>
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className=" flex items-center py-4">
                    <Input
                        placeholder={`Search Data..`}
                        value={(table.getColumn(table.getAllColumns()[0].id)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(table.getAllColumns()[0].id)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleExportExcel}
                    >
                        <Download className="h-4 w-4" />
                        Excel
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleExportPDF}
                    >
                        <Download className="h-4 w-4" />
                        PDF
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <style>
                {`
                .custom-table td {
                    padding-top: 0.3rem !important;
                    padding-bottom: 0.3rem !important;
                }

                .custom-table tr:nth-child(even) {
                    background-color: #f2f2f2;
                }

                .dark .custom-table tr:nth-child(even) {
                    background-color: rgb(30 41 59); /* Use custom dark color */
                }

                .custom-table tr:hover {
                    background-color: #ddd;
                }

                .dark .custom-table tr:hover {
                    background-color: rgb(51 65 85); /* Use custom dark color */
                }

                .custom-table tr.no-hover:hover {
                    background-color: transparent;
                }

                .dark .custom-table tr.no-hover:hover {
                    background-color: transparent;
                }
                `}
            </style>

            <div className="rounded-md border dark:border-slate-700 my-5 md:my-0">
                <Table className="custom-table">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="no-hover dark:border-slate-700">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="dark:text-slate-200">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="dark:border-slate-700"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="dark:text-slate-300">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center dark:text-slate-300"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between gap-3 px-2 mt-5 flex-col-reverse md:flex-row space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium dark:text-slate-200">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
 table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={table.getState().pagination.pageSize}
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium dark:text-slate-200">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="dark:text-slate-200" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="dark:text-slate-200" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="dark:text-slate-200" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="dark:text-slate-200" />
                    </Button>
                </div>
            </div>
        </>
    );
}
