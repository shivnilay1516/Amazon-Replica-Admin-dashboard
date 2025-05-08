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
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Image from 'next/image';

interface Banner {
  id: string;
  bannerlink: string;
  bannerimage: string;
  resStatus: string;
  resMessage: string;
}

const ShowBannerImages = ({ showListAction }: any) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://cc4a-103-206-131-194.ngrok-free.app';

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/graphql', {
          query: `
            query {
              getAllBanner {
                id
                bannerlink
                bannerimage
                resStatus
                resMessage
              }
            }
          `,
        });

        const responseData = response.data as {
          data?: { getAllBanner: Banner[] };
          errors?: { message: string }[];
        };

        if (responseData.errors && responseData.errors.length > 0) {
          const errorMessages = responseData.errors.map(err => err.message).join('\n');
          alert(`GraphQL Error: ${errorMessages}`);
          setBanners([]);
        } else {
          const result = responseData?.data?.getAllBanner;
          if (Array.isArray(result)) {
            setBanners(result);
          } else {
           alert('Unexpected response format from server.');
            setBanners([]);
          }
        }
      } catch (error) {
        console.error('Network error:', error);
        alert('Network error occurred while fetching banners.');
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Banner List" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-blue-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[920px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 bg-[#ecf3ff] dark:bg-[#101828] dark:border-white/[0.05]">
                    <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-start text-theme-lg">Banner Link</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-center text-theme-lg">Banner Image</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-start text-theme-lg">Status</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] dark:text-[#fff] text-start text-theme-lg">Action</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-blue-500 italic">
                          Loading banners...
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && banners.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-400 italic">
                          No banners found.
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && banners.map((banner) => (
                      <TableRow key={banner.id} className='border-b border-blue-400 dark:border-white/[0.05]'>
                         <TableCell className="px-5 py-3">{banner.bannerlink}</TableCell>
                        <TableCell className="px-5 py-3">
                          {/* <img src={banner.bannerimage} alt="Banner" className="w-32 h-auto rounded-md" /> */}
                           <Image src={`${API_URL}${banner.bannerimage}`} alt="category img" width={600} height={170}  className='w-full h-40 object-cover' />
                        </TableCell>
                       
                        <TableCell className="px-5 py-3">Done</TableCell>
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

export default ShowBannerImages;
