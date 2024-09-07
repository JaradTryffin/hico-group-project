"use client"
import { ColumnDef } from "@tanstack/table-core";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type EmployeeColumns = {
  id: number;
  employeeNumber: number;
  firstName: string;
  lastName: string;
  salutation: string;
  profileColor: string;
};

export const EmployeeColumns: ColumnDef<EmployeeColumns>[] = [
  {
    accessorKey: "employeeNumber",
    header: "Employee Number",
  },
  {
    accessorKey: "firstName",
    // header: "First Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "salutation",
    header: "Salutation",
  },
  {
    accessorKey: "profileColor",
    header: "Profile Color",
  },
];
