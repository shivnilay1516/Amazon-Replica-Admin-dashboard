'use client';
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../common/PageBreadcrumb';
import axiosInstance from '@/lib/config/axiosInstance';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

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
        if (Array.isArray(result)) {
          setDesigns(result);
        } else {
          setDesigns([]);
        }
      } catch (error) {
        console.error('Error fetching section designs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
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
                  <TableHeader className="border-b border-gray-100 bg-[#ecf3ff] dark:bg-[#101828] dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-start text-theme-lg">Heading</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-start text-theme-lg">Image Limit</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-start text-theme-lg">Per Slide</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-start text-theme-lg">Status</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {designs.map((item) => (
                      <TableRow key={item.id} className='border-b border-blue-400 dark:border-white/[0.05]'>
                        <TableCell className="px-5 py-3">{item.heading || "Not Valid for this category"}</TableCell>
                        <TableCell className="px-5 py-3">{item.imglimit || "Not Valid for this category"}</TableCell>
                        <TableCell className="px-5 py-3">{item.perslideimage || "Not Valid for this category"}</TableCell>
                        <TableCell className="px-5 py-3">{item.status || "Not Valid for this category"}</TableCell>
                      </TableRow>
                    ))}
                    {!loading && designs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-400 italic">
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
