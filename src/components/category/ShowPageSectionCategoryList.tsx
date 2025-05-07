'use client'
import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../common/PageBreadCrumb'
import { toast } from 'react-toastify'
import axiosInstance from '@/lib/config/axiosInstance'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import { View, Trash2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface Order {
  id: number;
  categoryName: string;
  Description: string;
  status: string;
}


const ShowPageSectionCategoryList = ({ showListAction }: any) => {
  const [categoryData, setCategoryData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = 'https://cc4a-103-206-131-194.ngrok-free.app';

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(`${API_URL}${imageUrl}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  // Fetch categories from GraphQL API
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const query = {
          query: `
            query GetHomeSectionCategory {
              getHomeSectionCategory {
                id
                categoryname
                categoryimage
                resMessage
                resStatus
              }
            }
          `,
        };

        const response = await axiosInstance.post('/graphql', query);
        const result = response?.data?.data?.getHomeSectionCategory;

        const formatted: Order[] = result.map((item: any) => ({
          id: item.id,
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

  
  return (
    <div>
      <PageBreadcrumb pageTitle="Category List" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-blue-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[920px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 bg-[#b8bfee] dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-lg dark:text-gray-400">
                        Category Name
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Image
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Status
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {categoryData.map((order) => (
                      <TableRow key={order.id} className='border-blue-400'>
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
                              {/* <Tooltip>
                                 <TooltipTrigger asChild>
                                <button
                                  onClick={() => openImageModal(order.Description)}
                                  className='bg-green-400 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded'
                                >
                                  <View className="w-4 h-4" />
                                </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                <span>View</span>
                                </TooltipContent>
                              </Tooltip> */}
                           <img src={`${API_URL}${order.Description}`} alt="category img" className='w-full h-40' />
                                
                              
                            </div>
                          </TableCell>
                           
                        <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400">
                          <Badge
                       
                          >
                            Done
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-2">
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

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <button
              onClick={closeModal}
              className="absolute top-0.5 right-2 text-gray-700 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Category"
              className="w-full h-auto object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowPageSectionCategoryList;
