"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

// Filtered the properties in the way it fits with the data table
export type CountryColumn = {
  code: string;
  name: string;
  continent: string;
  language: string;
  currency: string;
};

export const columns: ColumnDef<CountryColumn>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        className="border-slate-200"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableGrouping: false,
    enableSorting: false,
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "name",
    header: "Country",
  },
  {
    accessorKey: "continent",
    header: "Continent",
  },
  {
    accessorKey: "language",
    header: "Language",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
];
