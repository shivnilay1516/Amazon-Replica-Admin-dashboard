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
import {Trash2, Pencil } from 'lucide-react';
import Image from 'next/image';
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
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<SectionDesign | null>(null);
  const [formData, setFormData] = useState<Partial<SectionDesign>>({});
  void showHomeListAction;
  const API_URL = 'https://0a35-103-206-131-194.ngrok-free.app';

  console.log("formData",formData)

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

        console.log("result", result)

        setDesigns(Array.isArray(result) ? result : []);

        if (Array.isArray(result)) {
          const uniqueCategoryIds = [...new Set(result.map(d => d.hompagesectioncategory_id))];
          uniqueCategoryIds.forEach(id => fetchCategoryName(id));
        }

      } catch (error) {
        console.error('Error fetching section designs:', error);
        toast.error('Failed to fetch designs');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const fetchCategoryName = async (categoryId: string) => {
    try {
      const res = await axiosInstance.post('/graphql', {
        query: `
          query Query($getIdHomeSectionCategoryId: ID!) {
            getIDHomeSectionCategory(id: $getIdHomeSectionCategoryId) {
              categoryname
            }
          }
        `,
        variables: {
          getIdHomeSectionCategoryId: categoryId,
        },
      });

      const categoryname = res?.data?.data?.getIDHomeSectionCategory?.categoryname;
      if (categoryname) {
        setCategoryNames((prev) => ({ ...prev, [categoryId]: categoryname }));
      }
    } catch (error) {
      console.error(`Failed to fetch category name for ID ${categoryId}`, error);
    }
  };

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
        variables: { deleteSectionId: id },
      });

      const result = response?.data?.data?.deleteSection;

      if (result?.resStatus === 'success') {
        toast.success(result.resMessage || 'Deleted successfully');
        setDesigns(prev => prev.filter(item => item.id !== id));
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

  const handleUpdateClick = (item: SectionDesign) => {
    setEditingItem(item);
    setFormData({ ...item });
  };
  
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number,
    imgIndex: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const previewUrl = URL.createObjectURL(file);
    const updatedContent = structuredClone(formData.content);
    updatedContent.rows[rowIndex].columns[colIndex].images[imgIndex].url = previewUrl;
    setFormData(prev => ({ ...prev, content: updatedContent }));
  };

  const handleUpdateSubmit = async () => {
    if (!editingItem) return;
  
    const updatedFormData = { ...formData };

    if (updatedFormData.advertisement?.startsWith('blob:')) {
      const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
          const res = await axiosInstance.post('/graphql', formDataUpload);
          updatedFormData.advertisement = res.data.url;
        } catch (err) {
          toast.error('Advertisement image upload failed');
          return;
        }
      }
    }

    if (updatedFormData.content?.rows) {
      for (const row of updatedFormData.content.rows) {
        for (const col of row.columns) {
          for (const img of col.images) {
            if (img.url?.startsWith('blob:') && img.file) {
              const formDataUpload = new FormData();
              formDataUpload.append('file', img.file);
              try {
                const res = await axiosInstance.post('/graphql', formDataUpload);
                img.url = res.data.url;
                delete img.file;
              } catch (err) {
                toast.error('One or more image uploads failed');
                return;
              }
            }
          }
        }
      }
    }

    console.log("222",updatedFormData.content?.rows)
  
    // Detect only changed fields
    const changedFields: any = {};
    Object.keys(updatedFormData).forEach(key => {
      const originalValue = editingItem[key];
      const newValue = updatedFormData[key];
      if (JSON.stringify(originalValue) !== JSON.stringify(newValue)) {
        changedFields[key] = newValue;
      }
    });
  
    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes detected.');
      return;
    }
  
    // Submit update mutation
    try {
      const response = await axiosInstance.post('/graphql', {
        query: `
          mutation UpdateCarousel(
            $updatecarouselSectionDesignId: ID!
            $hompagesectioncategoryId: Int
            $sectionplaceid: String
            $heading: String
            $rows: [RowInput]
            $imglimit: String
            $perslideimage: String
            $status: String
          ) {
            updatecarouselSectionDesign(
              id: $updatecarouselSectionDesignId
              hompagesectioncategory_id: $hompagesectioncategoryId
              sectionplaceid: $sectionplaceid
              heading: $heading
              rows: $rows
              imglimit: $imglimit
              perslideimage: $perslideimage
              status: $status
            ) {
              id
              resMessage
              resStatus
            }
          }
        `,
        variables: {
          updatecarouselSectionDesignId: editingItem.id,
          hompagesectioncategoryId: changedFields.hompagesectioncategory_id,
          sectionplaceid: changedFields.sectionplaceid,
          heading: changedFields.heading,
          rows: changedFields.content?.rows,
          imglimit: changedFields.imglimit,
          perslideimage: changedFields.perslideimage,
          status: changedFields.status,
        }
      });
  
      const res = response.data?.data?.updatecarouselSectionDesign;

      console.log("updatedFormData",updatedFormData)
  
      if (res?.resStatus === 'success') {
        toast.success(res.resMessage || 'Updated successfully');
        setDesigns(prev =>
          prev.map(d => d.id === editingItem.id ? { ...d, ...changedFields } : d)
        );
        setEditingItem(null);
        setFormData({});
      } else {
        toast.error(res?.resMessage || 'Update failed');
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('Something went wrong while updating');
    }
  };
  

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
                    <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Id</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Category Name</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Heading</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Image Limit</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Per Slide</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Status</TableCell>
                      <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Actions</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {designs.map((item, index) => (
                      <TableRow key={item.id} className="border-b text-sm border-blue-400 dark:border-white/[0.05]">
                        <TableCell className="px-5 py-3">
                        {index+1}
                        </TableCell>
                        <TableCell className="px-5 py-3">
                          {categoryNames[item.hompagesectioncategory_id] || 'Loading...'}
                        </TableCell>
                        <TableCell className="px-5 py-3">{item.heading || 'Not Valid for this category'}</TableCell>
                        <TableCell className="px-5 py-3">{item.imglimit || 'Not Valid'}</TableCell>
                        <TableCell className="px-5 py-3">{item.perslideimage || 'Not Valid'}</TableCell>
                        <TableCell className="px-5 py-3">{item.status || 'Not Valid'}</TableCell>
                        <TableCell className="px-5 py-3">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className={`bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-1.5 rounded ml-2 ${deletingId === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? '...' : <Trash2 className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => handleUpdateClick(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-1.5 rounded ml-2"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && designs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-gray-400 italic">
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
{editingItem && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-[500px] h-[600px] overflow-y-auto">
      <div className='flex justify-between mb-4 text-center'>
        <h2 className="text-lg font-bold">Edit Section</h2>
        <button onClick={() => setEditingItem(null)} className='cursor-pointer p-[3px] rounded border'>X</button>
      </div>

      {Object.entries(formData).map(([field, value]) => (
        <div key={field} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
            {field}
          </label>

          {field === 'advertisement' ? (
            <>
              {value ? (
                <Image
                  src={value.startsWith('blob:') ? value : `${API_URL}${value}`}
                  width={200}
                  height={200}
                  alt="Advertisement"
                  className="w-full h-40 object-cover rounded mb-2"
                />
              ) : (
                <p className="text-gray-400 mb-2">No image available</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const preview = URL.createObjectURL(file);
                  setFormData(prev => ({ ...prev, advertisement: preview }));
                }}
              />
            </>
          ) : field === 'content' && typeof value === 'object' && value !== null ? (
            <div className="space-y-4">
              {value.rows.map((row: any, rowIndex: number) => (
                <div key={rowIndex} className="space-y-2">
                  {row.columns.map((column: any, colIndex: number) => (
                    <div key={colIndex} className="p-3 border rounded bg-gray-50">
                      <p className="font-semibold mb-2">{column.heading}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {column.images.map((img: any, imgIndex: number) => (
                          <div key={imgIndex} className="text-xs text-center w-full flex flex-col">
                            <Image
                              src={
                                img.url?.startsWith('blob:')
                                  ? img.url
                                  : img.url
                                  ? `${API_URL}${img.url}`
                                  : ''
                              }
                              alt={`img-${imgIndex}`}
                              width={200}
                              height={200}
                              className="w-full h-24 object-cover rounded mb-1"
                            />
                          <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, rowIndex, colIndex, imgIndex)}
                              className="mt-1 text-xs"
                            />
                            <input
                              type="text"
                              value={img.link || ''}
                              placeholder="Enter link"
                              onChange={(e) => {
                                const updatedContent = { ...formData.content };
                                updatedContent.rows[rowIndex].columns[colIndex].images[imgIndex].link = e.target.value;
                                setFormData(prev => ({ ...prev, content: updatedContent }));
                              }}
                              className="mt-2 w-full border px-2 py-1 rounded text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : value ?? ''}
              onChange={(e) => {
                let newValue: any = e.target.value;
                if (typeof value === 'number') {
                  newValue = Number(newValue);
                } else if (typeof value === 'object' && value !== null) {
                  try {
                    newValue = JSON.parse(newValue);
                  } catch {
                    // leave as is
                  }
                }
                setFormData(prev => ({ ...prev, [field]: newValue }));
              }}
            />
          )}
        </div>
      ))}

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setEditingItem(null)}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default HomePageCategory;
