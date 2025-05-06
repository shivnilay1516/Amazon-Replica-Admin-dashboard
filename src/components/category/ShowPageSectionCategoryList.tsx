"use client"
import React, { FormEvent, useState } from 'react'
import PageBreadcrumb from '../common/PageBreadCrumb'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import FileInput from '../form/input/FileInput'
import { toast } from 'react-toastify'
import axiosInstance from '@/lib/config/axiosInstance'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import { Edit, Eye, Trash2, View } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import Button from '../ui/button/Button'

interface Order {
  id: number;
  categoryName: string;
  Description: string;
  status: string;
}

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

// Define the table data using the interface
const tableData: Order[] = [
  {
    id: 1,
    categoryName: "Category 1",
    Description: "Agency Website",
    status: "Active",
  },
  {
    id: 2,
    categoryName: "Category 2",
    Description: "Agency Website",
    status: "Active",
  },
  {
    id: 3,
    categoryName: "Category 3",
    Description: "Agency Website",
    status: "Active",
  },
  {
    id: 4,
    categoryName: "Category 4",
    Description: "Agency Website",
    status: "Active",
  },
];

const ShowPageSectionCategoryList = ({ showListAction }: any) => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const [isOpen, setIsOpen] = useState(false);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setImage(file);
  //     const objectUrl = URL.createObjectURL(file);
  //     setPreviewUrl(objectUrl);
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryName || !image) {
      toast.info("Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    const operations = {
      query: `
        mutation AddHomeSectionCategory($input: HomePageSectionCategoryInput!) {
          addHomeSectionCategory(input: $input) {
            id
            categoryname
          }
        }
      `,
      variables: {
        input: {
          categoryname: categoryName,
          categoryimage: null, // Important: set null in variables
        },
      },
    };

    const map = {
      "0": ["variables.input.categoryimage"],
    };

    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify(map));
    formData.append("0", image);

    try {
      const response = await axiosInstance.post("/graphql", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;
      toast.success("Category added successfully! ✅");
      console.log(result);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to submit category.");
    } finally {
      setLoading(false);
    }
  };

  type DropdownOption = {
    label: string;
    action: () => void;
  };

  const options: DropdownOption[] = [
    {
      label: "View More",
      action: () => {
        showListAction();
      },
    },
    {
      label: "Refresh",
      action: () => {
        console.log("Refresh clicked");
      },
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Category List" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[920px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Category Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
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
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {order.categoryName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.Description}
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
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <button className='bg-green-400 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded'>
            <View className="w-4 h-4" />
            </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>View</span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
        <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded'>
            <Trash2 className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Delete</span>
        </TooltipContent>
      </Tooltip>
    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ShowPageSectionCategoryList