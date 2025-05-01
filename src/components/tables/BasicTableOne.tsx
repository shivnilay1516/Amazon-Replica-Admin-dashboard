import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";
import Badge from "../ui/badge/Badge";
import Pagination from "./Pagination";
import ActionButtons from "./ActionComponent";

interface Order {
  id: number;
  categoryName: string;
  status: string;
}

const column = ["Category Name", "Status"];

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    categoryName: "Category 1",
    status: "Active",
  },
  {
    id: 1,
    categoryName: "Category 2",
    status: "Active",
  },
  {
    id: 1,
    categoryName: "Category 3",
    status: "Active",
  },
  {
    id: 1,
    categoryName: "Category 4",
    status: "Active",
  },
];

const actions = [
  {
    icon: Eye,
    label: "View",
    onClick: () => alert("View clicked"),
  },
  {
    icon: Edit,
    label: "Edit",
    onClick: () => alert("Edit clicked"),
  },
  {
    icon: Trash2,
    label: "Delete",
    onClick: () => alert("Delete clicked"),
    className: "text-red-500 hover:text-red-700",
  },
]

export default function BasicTableOne() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {column?.map((item) => 
                  (<TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {item}
                </TableCell>))}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.categoryName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        order.status === "Active"
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <ActionButtons actions={actions} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination currentPage = {1} totalPages = {10} onPageChange = {() => {}}/>
    </div>
  );
}
