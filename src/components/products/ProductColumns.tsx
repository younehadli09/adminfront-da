"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <Link
                href={`/products/${row.original._id}`}
                className="hover:text-red-1"
            >
                {row.original.name}
            </Link>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "collections",
        header: "Collections",
        cell: ({ row }) => {
            const categories = row.original.category;
            return Array.isArray(categories)
                ? categories.map((category) => category.title).join(", ")
                : "N/A"; // Fallback for non-array values
        },
    },
    
    {
        accessorKey: "price",
        header: "Price (Dzd)",
    },
    {
        accessorKey: "expense",
        header: "Expense ()",
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete item="product" id={row.original._id} />,
    },
];