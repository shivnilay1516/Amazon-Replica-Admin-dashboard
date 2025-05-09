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

const ShowBannerImages = () => {
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

        const result = response.data?.data?.getAllBanner;

        if (Array.isArray(result)) {
          setBanners(result);
        } else {
          alert('Unexpected response format.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch banners.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this banner?');
    if (!confirmDelete) return;

    // Optimistic UI update
    const previousBanners = [...banners];
    setBanners(prev => prev.filter(banner => String(banner.id) !== String(id)));

    try {
      const response = await axiosInstance.post('/graphql', {
        query: `
          mutation DeleteBanner($deleteBannerId: ID!) {
            deleteBanner(id: $deleteBannerId) {
              id
              resStatus
              resMessage
            }
          }
        `,
        variables: {
          deleteBannerId: id,
        },
      });

      const result = response.data?.data?.deleteBanner;

      if (result?.resStatus !== 'SUCCESS') {
        alert(result?.resMessage || 'Failed to delete.');
        setBanners(previousBanners); // rollback
      } else {
        alert('Banner deleted successfully.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error occurred while deleting.');
      setBanners(previousBanners); // rollback
    }
  };

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
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start text-theme-lg">Banner Name</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-center text-theme-lg">Banner Image</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start text-theme-lg">Status</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start text-theme-lg">Action</TableCell>
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
                      <TableRow key={banner.id} className="border-b border-blue-400 dark:border-white/[0.05]">
                        <TableCell className="px-5 py-3">{banner.bannerlink}</TableCell>
                        <TableCell className="px-5 py-3">
                          <Image src={`${API_URL}${banner.bannerimage}`} alt="banner" width={600} height={170} className="w-full h-40 object-cover" />
                        </TableCell>
                        <TableCell className="px-5 py-3">Done</TableCell>
                        <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleDelete(banner.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                                >
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
