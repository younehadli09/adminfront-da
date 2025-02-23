/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X } from "lucide-react";
import {
    ColumnDef,
    ColumnFiltersState,
    getFilteredRowModel,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Extend TData to include the _id property
interface DataWithId {
    _id: string;
    [key: string]: any; // Allow dynamic properties for details
}

interface DataTableProps<TData extends DataWithId, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey: string;
    editLinkBase: string; // Base URL for edit link
    onDelete: (id: string) => void; // Handle deletion
}

export function DataTable<TData extends DataWithId, TValue>({
    columns,
    data,
    searchKey,
    editLinkBase,
    onDelete,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [selectedRow, setSelectedRow] = useState<TData | null>(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    });

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            onDelete(id);
            setSelectedRow(null); // Close modal after deletion
        }
    };

    return (
        <div className="py-5">
            {/* Search Input */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search..."
                    value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(searchKey)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => setSelectedRow(row.original)} // Open modal
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                    {/* Edit and delete buttons */}
                                    <TableCell>
                                        <Link href={`${editLinkBase}/${row.original._id}`} onClick={(e) => e.stopPropagation()}>
                                            <Pencil />
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click from triggering
                                                handleDelete(row.original._id);
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>

            {/* Modal (Dialog) for Row Details */}
            {selectedRow && (
                <Dialog open={true} onOpenChange={() => setSelectedRow(null)}>
                    <DialogContent className="bg-white m-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto transform transition-all duration-300 ease-in-out">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">Details</DialogTitle>
                        </DialogHeader>
                        <div className="p-4 space-y-4">
                            {Object.entries(selectedRow).map(([key, value]) => (
                                key !== "_id" && ( // Hide _id in the details
                                    <div key={key} className="flex flex-col sm:flex-row justify-between items-center py-3 border-b border-gray-200">
                                        <span className="text-sm font-semibold text-gray-600">{key}:</span>
                                        <div className="text-sm text-gray-800">
                                            {typeof value === "object" && value !== null ? (
                                                Array.isArray(value) ? (
                                                    value.join(", ")  // If it's an array, join elements
                                                ) : (
                                                    // If it's an image URL, display it
                                                    value?.url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={value.url} alt={key} className="max-w-full h-auto rounded-md" />
                                                    ) : (
                                                        JSON.stringify(value) // Convert objects to readable string
                                                    )
                                                )
                                            ) : (
                                                value as string
                                            )}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Link href={`${editLinkBase}/${selectedRow._id}`}>
                                <Button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200">
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(selectedRow._id)}
                                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200"
                            >
                                Delete
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedRow(null)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
}
