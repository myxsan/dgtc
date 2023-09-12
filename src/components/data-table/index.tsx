"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  GroupingState,
  getGroupedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FC, useEffect, useRef, useState } from "react";

import { columns, CountryColumn } from "./columns";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import { cn, parseFilterInput } from "@/lib/utils";
import toast from "react-hot-toast";

interface DataTableProps {
  data: CountryColumn[];
}

const DataTable: FC<DataTableProps> = ({ data }) => {
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [globalFilters, setGlobalFilters] = useState();
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [filterInput, setFilterInput] = useState<string>("");

  const pageParent = useRef<HTMLTableSectionElement | null>(null);

  //I rendered 10 rows per page so every row has different bg colors when it is selected
  const colors = [
    "rgba(43, 58, 103, 40%)",
    "rgba(255, 196, 130, 40%)",
    "rgba(57, 48, 74, 40%)",
    "rgba(125, 116, 97, 40%)",
    "rgba(158, 120, 143, 40%)",
    "rgba(4, 231, 98, 40%)",
    "rgba(245, 183, 0, 40%)",
    "rgba(220, 0, 115, 40%)",
    "rgba(0, 139, 248, 40%)",
    "rgba(137, 252, 0, 40%)",
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    onGlobalFilterChange: setGlobalFilters,
    enableMultiRowSelection: false,
    state: {
      rowSelection,
      globalFilter: globalFilters,
      grouping,
    },
    globalFilterFn: (row, id, value) => {
      return (row.getValue(id) as string)
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  });

  //Added left bottom corner a text which shows the selected country this useEffect gets the selected row and shows the name of the country
  useEffect(() => {
    const indices = Object.keys(rowSelection);
    if (!indices.length) setSelectedCountry("Nothing");
    else
      setSelectedCountry(
        table.getFilteredSelectedRowModel().rows[0].original["name"]
      );
  }, [rowSelection, table]);

  //To automatically select the last item after filter operations used useRef to get parent element and toggled its selected state.
  //(does not run when the rows are grouped)
  useEffect(() => {
    if (globalFilters) {
      if (!grouping.length && pageParent.current) {
        const children = Array.from(pageParent.current?.children);
        const lastRowId = children[children.length - 1].id;
        table.getRow(lastRowId).toggleSelected();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilters]);

  const handleFilter = () => {
    //Created parseFilterInput function to handle input value it transforms "a:b c:d" to {a:b, c:d}
    const args = parseFilterInput(filterInput);
    const keys = Object.keys(args);
    //Checking keys to filter or group
    if (keys.includes("filter")) table.setGlobalFilter(args["filter"]);
    if (keys.includes("group")) {
      //Checking is the group value in the input is valid
      if (
        columns.find(
          (item) => item?.header?.toString().toLowerCase() === args["group"]
        )
      ) {
        table.getColumn("select")?.toggleVisibility(false);
        table.setGrouping([args["group"]]);
      } else {
        toast.error("Invalid group value");
      }
    }
  };

  return (
    <div className="w-full h-full min-h-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center w-full">
          <Input
            placeholder="filter:tt group:continent"
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            className="max-w-sm"
          />
          <Button
            variant={"default"}
            onClick={() => handleFilter()}
            className="bg-slate-600 ml-3"
            disabled={!filterInput.length}
          >
            Filter
          </Button>
        </div>
        <div className="flex justify-end items-center w-full">
          <Button
            onClick={() => {
              table.setGlobalFilter("");
              table.resetGrouping();
              table.getColumn("select")?.toggleVisibility(true);
            }}
            variant={"destructive"}
            disabled={!grouping.length && !globalFilters}
          >
            Reset filter
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-slate-200 text-center"
                      key={header.id}
                    >
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
          <TableBody className="min-h-full" ref={pageParent}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  id={row.id}
                  key={row.id}
                  className={cn(
                    "hover:bg-opacity-5 hover:bg-slate-400 data-[state=selected]:bg-opacity-0"
                  )}
                  //tailwind css does not accept the color when it is predefined.
                  //That's why I used style attribute to apply background colors
                  style={
                    row.getIsSelected() && "selected"
                      ? {
                          backgroundColor: `${colors[Number(row.id) % 10]}`,
                        }
                      : { backgroundColor: "transparent" }
                  }
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center text-slate-300"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                      {row.getIsGrouped() && !cell.getIsAggregated() && (
                        <p className="font-thin ml-2 inline-block text-center text-slate-200">
                          ({row.subRows.length})
                        </p>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-start">
        <div className="flex-1 text-sm text-muted-foreground text-slate-400 m-3">
          <p className="inline-block">{selectedCountry} selected</p>
          <Button
            className="text-slate-500"
            variant={"link"}
            onClick={() => table.resetRowSelection()}
          >
            Unselect
          </Button>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="custom"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="custom"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
