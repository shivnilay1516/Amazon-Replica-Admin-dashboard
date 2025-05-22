'use client'
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../common/PageBreadcrumb';
import { toast } from 'react-toastify';
import axiosInstance from '@/lib/config/axiosInstance';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Badge from '../ui/badge/Badge';
import { Trash2, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Image from 'next/image';

interface Order {
  id: number;
  categoryName: string;
  Description: string;
  status: string;
  categoryimage?: string;
}
type Props = {
  showListAction: () => void; 
};

interface UpdateHomeSectionCategoryResponse {
  data: {
    updateHomeSectionCategory: {
      id: string;
      categoryname: string;
      categoryimage: string;
      resMessage: string;
      resStatus: 'Success' | 'Failure'; // or string, depending on your API
    };
  };
}

interface GetHomeSectionCategoryItem {
  id: string;
  categoryname: string;
  categoryimage: string;
  resMessage?: string;
  resStatus: string;
}

interface GetHomeSectionCategoryResponse {
  data: {
    getHomeSectionCategory: GetHomeSectionCategoryItem[];
  };
}


const ShowPageSectionCategoryList = ({ showListAction }: Props) => {
  const [categoryData, setCategoryData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<Order | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // Add loading state for update
  const [isDeleting, setIsDeleting] = useState(false); // Add loading state for delete
  void showListAction;
  const API_URL = 'https://0a35-103-206-131-194.ngrok-free.app';

  // useEffect(() => {
  //   const fetchCategoryData = async () => {
  //     setLoading(true);
  //     try {
  //       const query = {
  //         query: `query GetHomeSectionCategory {
  //           getHomeSectionCategory {
  //             id
  //             categoryname
  //             categoryimage
  //             resMessage
  //             resStatus
  //           }
  //         }`,
  //       };

  //       const response = await axiosInstance.post('/graphql', query);
  //       const result = response?.data?.data?.getHomeSectionCategory;

  //       const formatted: Order[] = result.map((item: {
  //         id: string;
  //         categoryname: string;
  //         categoryimage: string;
  //         resStatus: string
  //       }) => ({
  //         id: item.id,
  //         categoryName: item.categoryname,
  //         Description: item.categoryimage,
  //         status: item.resStatus,
  //       }));

  //       setCategoryData(formatted);
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Failed to fetch category data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCategoryData();
  // }, []);

  useEffect(() => {
  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const query = {
        query: `query GetHomeSectionCategory {
          getHomeSectionCategory {
            id
            categoryname
            categoryimage
            resMessage
            resStatus
          }
        }`,
      };

      const response = await axiosInstance.post<GetHomeSectionCategoryResponse>('/graphql', query);
      const result = response.data.data.getHomeSectionCategory;

      const formatted: Order[] = result.map((item) => ({
        id: Number(item.id),
        categoryName: item.categoryname,
        Description: item.categoryimage,
        status: item.resStatus,
      }));

      setCategoryData(formatted);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch category data.");
    } finally {
      setLoading(false);
    }
  };

  fetchCategoryData();
}, []);


  // const handleDelete = async (id: number) => {
  //   setIsDeleting(true); // Start deleting state
  //   const mutation = {
  //     query: `
  //       mutation DeleteHomeSectionCategory($deleteHomeSectionCategoryId: ID!) {
  //         deleteHomeSectionCategory(id: $deleteHomeSectionCategoryId) {
  //           resStatus
  //           resMessage
  //         }
  //       }
  //     `,
  //     variables: {
  //       deleteHomeSectionCategoryId: id,
  //     },
  //   };

  //   try {
  //     const response = await axiosInstance.post('/graphql', mutation);
  //     const result = response.data?.data?.deleteHomeSectionCategory;

  //     if (result?.resStatus === 'Success') {
  //       toast.success(result.resMessage || 'Category deleted successfully');
  //       setCategoryData((prev) => prev.filter((item) => item.id !== id));
  //     } else {
  //       toast.error(result?.resMessage || 'Failed to delete category');
  //     }
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     toast.error('An error occurred while deleting the category.');
  //   } finally {
  //     setIsDeleting(false); // Stop deleting state
  //   }
  // };

  const handleDelete = async (id: number) => {
  setIsDeleting(true);

  const mutation = {
    query: `
      mutation DeleteHomeSectionCategory($deleteHomeSectionCategoryId: ID!) {
        deleteHomeSectionCategory(id: $deleteHomeSectionCategoryId) {
          resStatus
          resMessage
        }
      }
    `,
    variables: { deleteHomeSectionCategoryId: id },
  };

  try {
    const response = await axiosInstance.post<{
      data: {
        deleteHomeSectionCategory: {
          resStatus: string;
          resMessage?: string;
        };
      };
    }>('/graphql', mutation);

    const result = response.data?.data?.deleteHomeSectionCategory;

    if (result?.resStatus === 'Success') {
      toast.success(result.resMessage || 'Category deleted successfully');
      setCategoryData((prev) => prev.filter((item) => item.id !== id));
    } else {
      toast.error(result?.resMessage || 'Failed to delete category');
    }
  } catch (error) {
    console.error('Delete error:', error);
    toast.error('An error occurred while deleting the category.');
  } finally {
    setIsDeleting(false);
  }
};

  console.log("isDeleting",isDeleting)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
  
    if (!newCategoryName && !newImage) {
      toast.error("Please update at least one field.");
      return;
    }
  
    const formData = new FormData();
  
    // Build the variables object dynamically
    const variables:{
      updateHomeSectionCategoryId: number;
      categoryname?: string;
      categoryimage?: string | null;
    } = {
      updateHomeSectionCategoryId: editingItem.id,
    };
  
    if (newCategoryName && newCategoryName !== editingItem.categoryName) {
      variables.categoryname = newCategoryName;
    }
  
    if (newImage) {
      variables.categoryimage = null; // Placeholder for file mapping
    }
  
    formData.append('operations', JSON.stringify({
      query: `
        mutation UpdateHomeSectionCategory(
          $updateHomeSectionCategoryId: ID!,
          $categoryname: String,
          $categoryimage: Upload
        ) {
          updateHomeSectionCategory(
            id: $updateHomeSectionCategoryId,
            categoryname: $categoryname,
            categoryimage: $categoryimage
          ) {
            id
            categoryname
            categoryimage
            resMessage
            resStatus
          }
        }
      `,
      variables,
    }));
  
    if (newImage) {
      formData.append('map', JSON.stringify({ "0": ["variables.categoryimage"] }));
      formData.append('0', newImage);
    }
  
    setIsUpdating(true);
  
    try {
      const response = await axiosInstance.post<UpdateHomeSectionCategoryResponse>('/graphql', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = response?.data?.data?.updateHomeSectionCategory;
  
      if (result?.resStatus === 'Success') {
        toast.success(result.resMessage || 'Category updated successfully');
  
        setCategoryData((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  categoryName: result.categoryname || item.categoryName,
                  Description: result.categoryimage || item.Description,
                }
              : item
          )
        );
        setEditingItem(null);
      } else {
        toast.error(result?.resMessage || 'Failed to update category');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An error occurred while updating the category.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  


  return (
    <div>
      <PageBreadcrumb pageTitle="Section Category List" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-blue-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[920px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 bg-[#ecf3ff] dark:bg-[#101828] dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-[#465fff] dark:text-[#fff] text-start text-theme-lg dark:text-gray-400">
                        Category Name
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-[#465fff] dark:text-[#fff] text-center text-theme-lg dark:text-gray-400">
                        Image
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-[#465fff] dark:text-[#fff] text-start text-theme-lg dark:text-gray-400">
                        Status
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-[#465fff] dark:text-[#fff] text-start text-theme-lg dark:text-gray-400">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {categoryData.map((order) => (
                      <TableRow key={order.id} className="border-blue-400 dark:border-white/[0.05]">
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm text-wrap dark:text-white/90">
                                {order.categoryName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Image src={`${API_URL}${order.Description}`} alt="category img" width={600} height={170} className="w-full h-40 object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                          <Badge>Done</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => {
                                    setEditingItem(order);
                                    setNewCategoryName(order.categoryName);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-1.5 rounded ml-2"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>Update</span>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDelete(order.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-1.5 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
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
                    {categoryData.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-400 italic">
                          No categories found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingItem && (
  <div className="p-4 border border-blue-400 rounded-2xl mt-4">
    <h2 className="mb-3 font-semibold text-lg">Update Category</h2>

    <div className="flex flex-wrap gap-4 items-start">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Category Name</label>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Category Name"
          className="border border-blue-300 p-2 rounded min-w-[200px]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border border-blue-300 p-2 rounded"
        />
      </div>

      {editingItem.categoryimage && !newImage && (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Current Image</label>
          <Image
            src={editingItem.categoryimage}
            alt="Current"
            width={200}
            height={200}
            className="w-24 h-24 object-cover border rounded"
          />
        </div>
      )}

      {newImage && (
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">New Preview</label>
          <Image
            src={URL.createObjectURL(newImage)}
            alt="Preview"
            width={200}
            height={200}
            className="w-24 h-24 object-cover border rounded"
          />
        </div>
      )}

      <div className="mt-auto">
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ShowPageSectionCategoryList;
