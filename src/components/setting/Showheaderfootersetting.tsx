'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import PageBreadcrumb from '../common/PageBreadcrumb';
import axiosInstance from '@/lib/config/axiosInstance';
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from '../ui/table';
import { Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Image from 'next/image';
import { toast } from 'react-toastify';

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

const API_URL = 'https://0a35-103-206-131-194.ngrok-free.app';

const Showheaderfootersetting = () => {
  const [settings, setSettings] = useState<HomeSetting | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<HomeSetting>>({});
  const [settingId, setSettingId] = useState<string | null>(null);
  const [headerLogo, setHeaderLogo] = useState<File | null>(null);
  const [footerLogo, setFooterLogo] = useState<File | null>(null);

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
        if (result) {
          setSettings(result);
          setSettingId(result.id);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file)
    if (!file) return;
    if (e.target.name === 'headerlogo') setHeaderLogo(file);
    if (e.target.name === 'footerlogo') setFooterLogo(file);
  };

  const handleEdit = () => {
    if (!settings) return;
    setFormData(settings);
    setIsOpen(true);
  };

  
  const handleUpdate = async () => {
    if (!settingId) {
      toast.error('Setting ID not available.');
      return;
    }
  
    if (!headerLogo || !footerLogo) {
      toast.error('Please select both header and footer logos.');
      return;
    }
  
    setLoading(true);
  
    try {
      const operations = {
        query: `
          mutation UpdateHomePageSetting(
            $updateHomePageSettingId: ID!
            $headerbgcolor: String
            $headercolor: String
            $footertopbgcolor: String
            $footertopcolor: String
            $footertopstatus: String
            $footercolor: String
            $footerbgcolor: String
            $footerstatus: String
            $headerlogo: Upload
            $footerlogo: Upload
          ) {
            updateHomePageSetting(
              id: $updateHomePageSettingId
              headerbgcolor: $headerbgcolor
              headercolor: $headercolor
              footertopbgcolor: $footertopbgcolor
              footertopcolor: $footertopcolor
              footertopstatus: $footertopstatus
              footercolor: $footercolor
              footerbgcolor: $footerbgcolor
              footerstatus: $footerstatus
              headerlogo: $headerlogo
              footerlogo: $footerlogo
            ) {
              id
              resStatus
              resMessage
            }
          }
        `,
        variables: {
          updateHomePageSettingId: settingId,
          headerbgcolor: formData.headerbgcolor,
          headercolor: formData.headercolor,
          footertopbgcolor: formData.footertopbgcolor,
          footertopcolor: formData.footertopcolor,
          footertopstatus: formData.footertopstatus,
          footercolor: formData.footercolor,
          footerbgcolor: formData.footerbgcolor,
          footerstatus: formData.footerstatus,
          headerlogo: null,
          footerlogo: null,
        }
      };
  
      const map = {
        "0": ["variables.headerlogo"],
        "1": ["variables.footerlogo"]
      };
  
      const formDataToSend = new FormData();
      formDataToSend.append("operations", JSON.stringify(operations));
      formDataToSend.append("map", JSON.stringify(map));
      formDataToSend.append("0", headerLogo); // Make sure this is a File object
      formDataToSend.append("1", footerLogo); // Also a File object
  
      const response = await fetch(`${API_URL}/graphql`, {
        method: 'POST',
        body: formDataToSend,
      });
  
      const result = await response.json();
      const updatedData = result?.data?.updateHomePageSetting;
  
      if (updatedData?.resStatus === 'true') {
        toast.success(updatedData.resMessage || 'Settings updated successfully.');
        setSettings(updatedData);
        setIsOpen(false);
      } else {
        toast.error(updatedData?.resMessage || 'Failed to update settings.');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Header/Footer Setting" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="overflow-hidden rounded-xl border bg-white p-4">
          <div className="overflow-x-auto w-full">
  <Table className="min-w-[800px] w-full border rounded-md">
    <TableHeader>
      <TableRow className="bg-[#ecf3ff] text-[#465fff]">
        <TableCell isHeader className="font-semibold p-4">Section</TableCell>
        <TableCell isHeader className="font-semibold p-4">Logos</TableCell>
        <TableCell isHeader className="font-semibold p-4">Colors</TableCell>
        <TableCell isHeader className="font-semibold p-4">Action</TableCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={4} className="p-4 text-center">
            Loading...
          </TableCell>
        </TableRow>
      ) : settings ? (
        <TableRow className="border-t">
          <TableCell className="p-4">Header/Footer Settings</TableCell>
          <TableCell className="p-4">
            <div className="mb-4">
              <span className="font-medium">Header Logo:</span><br />
              {settings.headerlogo ? (
                <Image
                  src={`${API_URL}${settings.headerlogo}`}
                  alt="Header Logo"
                  width={100}
                  height={50}
                  className="object-contain rounded border"
                />
              ) : (
                <span className="text-sm text-gray-500">No header logo</span>
              )}
            </div>
            <div>
              <span className="font-medium">Footer Logo:</span><br />
              {settings.footerlogo ? (
                <Image
                  src={`${API_URL}${settings.footerlogo}`}
                  alt="Footer Logo"
                  width={100}
                  height={50}
                  className="object-contain rounded border"
                />
              ) : (
                <span className="text-sm text-gray-500">No footer logo</span>
              )}
            </div>
          </TableCell>
          <TableCell className="p-4 space-y-1 text-sm">
            <div><strong>Header BG:</strong> {settings.headerbgcolor}</div>
            <div><strong>Header Color:</strong> {settings.headercolor}</div>
            <div><strong>Footer Top BG:</strong> {settings.footertopbgcolor}</div>
            <div><strong>Footer Top Color:</strong> {settings.footertopcolor}</div>
            <div><strong>Top Status:</strong> {settings.footertopstatus}</div>
            <div><strong>Footer BG:</strong> {settings.footerbgcolor}</div>
            <div><strong>Footer Color:</strong> {settings.footercolor}</div>
            <div><strong>Footer Status:</strong> {settings.footerstatus}</div>
          </TableCell>
          <TableCell className="p-4 text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                >
                  <Pencil size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent><span>Edit</span></TooltipContent>
            </Tooltip>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={4} className="p-4 text-center text-gray-500">
            No settings found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>

        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="p-6 space-y-4 bg-white rounded-xl shadow-lg max-w-xl w-full mx-4 max-h-[600px] overflow-y-auto">
            <h2 className="text-xl font-bold text-center">Update Header/Footer Settings</h2>

            {['headerbgcolor', 'headercolor', 'footertopbgcolor', 'footertopcolor', 'footerbgcolor', 'footercolor'].map((field) => {
              const labels: Record<string, string> = {
                headerbgcolor: 'Header Background Color',
                headercolor: 'Header Text Color',
                footertopbgcolor: 'Footer Top Background Color',
                footertopcolor: 'Footer Top Text Color',
                footerbgcolor: 'Footer Background Color',
                footercolor: 'Footer Text Color',
              };

              return (
                <div key={field}>
                  <label htmlFor={field} className="block mb-1 font-medium">{labels[field]}</label>
                  <input
                    id={field}
                    type="color"
                    name={field}
                    value={formData[field as keyof HomeSetting] || '#000000'}
                    onChange={handleInputChange}
                    className="w-full h-10 border rounded"
                  />
                </div>
              );
            })}

            {['footertopstatus', 'footerstatus'].map((status) => (
              <div key={status}>
                <label className="block mb-1 font-medium" htmlFor={status}>
                  {status === 'footertopstatus' ? 'Footer Top Status' : 'Footer Status'}
                </label>
                <select
                  id={status}
                  name={status}
                  value={formData[status as keyof HomeSetting] || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            ))}

            <div>
              <label htmlFor="headerlogo" className="block mb-1 font-medium">Header Logo</label>
              <input
                type="file"
                name="headerlogo"
                id="headerlogo"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="footerlogo" className="block mb-1 font-medium">Footer Logo</label>
              <input
                type="file"
                name="footerlogo"
                id="footerlogo"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              Update
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Showheaderfootersetting;
