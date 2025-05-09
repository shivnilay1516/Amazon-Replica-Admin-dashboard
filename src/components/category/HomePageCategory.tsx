'use client';
import React, { useEffect, useState, useCallback } from 'react';
import PageBreadcrumb from '../common/PageBreadcrumb';
import axiosInstance from '@/lib/config/axiosInstance';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface SectionDesign {
  id: string;
  hompagesectioncategory_id: string;
  advertisement: string;
  advertisement_link: string;
  heading: string;
  imglimit: number;
  perslideimage: number;
  content: string;
  status: string;
  resMessage: string;
  resStatus: string;
  createdIstAt: string;
  updatedIstAt: string;
}

const HomePageCategory = ({ showHomeListAction }: any) => {
  const [designs, setDesigns] = useState<SectionDesign[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/graphql', {
          query: `
            query {
              getAllSectionDesign {
                id
                hompagesectioncategory_id
                advertisement
                advertisement_link
                heading
                imglimit
                perslideimage
                content
                status
                resMessage
                resStatus
                createdIstAt
                updatedIstAt
              }
            }
          `,
        });

        const result = response?.data?.data?.getAllSectionDesign;
        setDesigns(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching section designs:', error);
        toast.error('Failed to fetch designs');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);


  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      const response = await axiosInstance.post('/graphql', {
        query: `
          mutation DeleteSection($deleteSectionId: ID!) {
            deleteSection(id: $deleteSectionId) {
              resMessage
              resStatus
            }
          }
        `,
        variables: {
          deleteSectionId: id,
        },
      });
  
      const result = response?.data?.data?.deleteSection;
  
      console.log("Delete", response.data);
  
      if (result?.resStatus === 'success') {
        toast.success(result.resMessage || 'Deleted successfully');
        setDesigns((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(result?.resMessage || 'Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('An error occurred while deleting');
    } finally {
      setDeletingId(null);
    }
  }, []);

  
  return (
    <div>
      <PageBreadcrumb pageTitle="Home Page Section List" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-blue-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[920px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 bg-[#ecf3ff] dark:bg-[#101828] dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Heading</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Image Limit</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Per Slide</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Status</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Delete</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {designs.map((item) => (
                      <TableRow key={item.id} className='border-b text-sm border-blue-400 dark:border-white/[0.05]'>
                        <TableCell className={`px-5 py-3 ${!item.heading ? 'text-red-500' : 'text-black'}`}>
                          {item.heading || "Not Valid for this category"}
                        </TableCell>
                        <TableCell className={`px-5 py-3 ${!item.imglimit ? 'text-red-500' : 'text-black'}`}>
                          {item.imglimit || "Not Valid"}
                        </TableCell>
                        <TableCell className={`px-5 py-3 ${!item.perslideimage ? 'text-red-500' : 'text-black'}`}>
                          {item.perslideimage || "Not Valid"}
                        </TableCell>
                        <TableCell className={`px-5 py-3 ${!item.status ? 'text-red-500' : 'text-black'}`}>
                          {item.status || "Not Valid"}
                        </TableCell>
                        <TableCell className="px-5 py-3">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ${deletingId === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? '...' : <Trash2 className="w-4 h-4" />}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && designs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-400 italic">
                          No designs found.
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
    </div>
  );
};

export default HomePageCategory;
