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
import { Trash2, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Image from 'next/image';

interface HomeSetting {
  id: string;
  headerbgcolor: string;
  headercolor: string;
  footertopbgcolor: string;
  footertopcolor: string;
  footertopstatus: string;
  footercolor: string;
  footerbgcolor: string;
  footerstatus: string;
  headerlogo: string;
  footerlogo: string;
}

const Showheaderfootersetting = () => {
  const [settings, setSettings] = useState<HomeSetting | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://0a35-103-206-131-194.ngrok-free.app';

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.post('/graphql', {
          query: `
            query GetHomeSettingDetails {
              getHomeSettingDetails {
                id
                headerbgcolor
                headercolor
                footertopbgcolor
                footertopcolor
                footertopstatus
                footercolor
                footerbgcolor
                footerstatus
                headerlogo
                footerlogo
              }
            }
          `,
        });

        const resultArray = response.data?.data?.getHomeSettingDetails;
       
        const result = Array.isArray(resultArray) ? resultArray[0] : null;

        console.log("result:", resultArray);
        if (result) {
          setSettings(result);
        } else {
          console.warn("Unexpected result:", resultArray);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Header/Footer Setting" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border border-blue-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[920px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 bg-[#ecf3ff] dark:bg-[#101828] dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start text-theme-lg">Section</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-center text-theme-lg">Logos</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start text-theme-lg">Colors</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start text-theme-lg">Action</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-blue-500 italic">
                          Loading settings...
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && !settings && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-400 italic">
                          No settings found.
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && settings && (
                      <TableRow key={settings.id} className="border-b border-blue-400 dark:border-white/[0.05]">
                        <TableCell className="px-5 py-3">Header/Footer Settings</TableCell>
                        <TableCell className="px-5 py-3 space-y-2">
                          <div>
                            <span className="block font-semibold">Header Logo</span>
                            <Image
                              src={`${API_URL}${settings.headerlogo}`}
                              alt="Header Logo"
                              width={150}
                              height={50}
                              className="object-contain bg-gray-100 rounded p-1"
                            />
                          </div>
                          <div>
                            <span className="block font-semibold">Footer Logo</span>
                            <Image
                              src={`${API_URL}${settings.footerlogo}`}
                              alt="Footer Logo"
                              width={150}
                              height={50}
                              className="object-contain bg-gray-100 rounded p-1"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-3 space-y-2 text-sm text-gray-700">
                          {[
                            { label: 'Header BG', value: settings.headerbgcolor },
                            { label: 'Header Text', value: settings.headercolor },
                            { label: 'Footer Top BG', value: settings.footertopbgcolor },
                            { label: 'Footer Top Text', value: settings.footertopcolor },
                            { label: 'Footer BG', value: settings.footerbgcolor },
                            { label: 'Footer Text', value: settings.footercolor },
                            { label: 'Footer Top Status', value: settings.footertopstatus },
                            { label: 'Footer Status', value: settings.footerstatus },
                          ].map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span>{item.label}:</span>
                              <span className="font-medium">{item.value}</span>
                              {item.value?.startsWith('#') && (
                                <span
                                  style={{ backgroundColor: item.value }}
                                  className="w-4 h-4 rounded-full border"
                                />
                              )}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded">
                                  <Pencil className="w-3 h-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>Update</span>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="bg-red-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded">
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

export default Showheaderfootersetting;
