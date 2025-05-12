// 'use client';
// import React, { useEffect, useState, useCallback } from 'react';
// import PageBreadcrumb from '../common/PageBreadcrumb';
// import axiosInstance from '@/lib/config/axiosInstance';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from '../ui/table';
// import { Trash2, Pencil } from 'lucide-react';
// import { toast } from 'react-toastify';

// interface SectionDesign {
//   id: string;
//   hompagesectioncategory_id: string;
//   advertisement: string;
//   advertisement_link: string;
//   heading: string;
//   imglimit: number;
//   perslideimage: number;
//   content: string;
//   status: string;
//   resMessage: string;
//   resStatus: string;
//   createdIstAt: string;
//   updatedIstAt: string;
// }

// const HomePageCategory = ({ showHomeListAction }: any) => {
//   const [designs, setDesigns] = useState<SectionDesign[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [editingItem, setEditingItem] = useState<SectionDesign | null>(null);
//   const [formData, setFormData] = useState<Partial<SectionDesign>>({});

//   useEffect(() => {
//     const fetchDesigns = async () => {
//       setLoading(true);
//       try {
//         const response = await axiosInstance.post('/graphql', {
//           query: `
//             query {
//               getAllSectionDesign {
//                 id
//                 hompagesectioncategory_id
//                 advertisement
//                 advertisement_link
//                 heading
//                 imglimit
//                 perslideimage
//                 content
//                 status
//                 resMessage
//                 resStatus
//                 createdIstAt
//                 updatedIstAt
//               }
//             }
//           `,
//         });

//         const result = response?.data?.data?.getAllSectionDesign;

//         console.log("result",result)
//         setDesigns(Array.isArray(result) ? result : []);
//       } catch (error) {
//         console.error('Error fetching section designs:', error);
//         toast.error('Failed to fetch designs');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDesigns();
//   }, []);

//   const handleDelete = useCallback(async (id: string) => {
//     setDeletingId(id);
//     try {
//       const response = await axiosInstance.post('/graphql', {
//         query: `
//           mutation DeleteSection($deleteSectionId: ID!) {
//             deleteSection(id: $deleteSectionId) {
//               resMessage
//               resStatus
//             }
//           }
//         `,
//         variables: { deleteSectionId: id },
//       });

//       const result = response?.data?.data?.deleteSection;

//       if (result?.resStatus === 'success') {
//         toast.success(result.resMessage || 'Deleted successfully');
//         setDesigns(prev => prev.filter(item => item.id !== id));
//       } else {
//         toast.error(result?.resMessage || 'Failed to delete');
//       }
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       toast.error('An error occurred while deleting');
//     } finally {
//       setDeletingId(null);
//     }
//   }, []);


//   const handleUpdateClick = (item: SectionDesign) => {
//     setEditingItem(item);
//     setFormData({ ...item });
//   };

//   const handleUpdateSubmit = async () => {
//     if (!editingItem) return;
//     const changedFields: any = {};

//     Object.keys(formData).forEach((key) => {
//       const originalValue = (editingItem as any)[key];
//       const newValue = (formData as any)[key];
//       if (originalValue !== newValue) {
//         changedFields[key] = newValue;
//       }
//     });

//     if (Object.keys(changedFields).length === 0) {
//       toast.info('No changes detected.');
//       return;
//     }

//     try {
//       const response = await axiosInstance.post('/graphql', {
//         query: `
//           mutation UpdateCarousel(
//             $updatecarouselSectionDesignId: ID!
//             $heading: String
//             $imglimit: String
//             $perslideimage: String
//             $status: String
//           ) {
//             updatecarouselSectionDesign(
//               id: $updatecarouselSectionDesignId
//               heading: $heading
//               imglimit: $imglimit
//               perslideimage: $perslideimage
//               status: $status
//             ) {
//               id
//               heading
//               imglimit
//               perslideimage
//               status
//               resMessage
//               resStatus
//             }
//           }
//         `,
//         variables: {
//           updatecarouselSectionDesignId: editingItem.id,
//           ...changedFields,
//         },
//       });

//       const res = response.data?.data?.updatecarouselSectionDesign;

//       if (res?.resStatus === 'success') {
//         toast.success(res.resMessage || 'Updated successfully');

//         setDesigns(prev =>
//           prev.map(d => d.id === editingItem.id ? { ...d, ...changedFields } : d)
//         );

//         setEditingItem(null);
//         setFormData({});

//       } else {
//         toast.error(res?.resMessage || 'Update failed');
//       }

//     } catch (error) {
//       console.error('Update Error:', error);
//       toast.error('Something went wrong while updating');
//     }
//   };

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Home Page Section List" />
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
//         <div className="space-y-6">
//           <div className="overflow-hidden rounded-xl border border-blue-400 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//             <div className="max-w-full overflow-x-auto">
//               <div className="min-w-[920px]">
//                 <Table>
//                   <TableHeader className="border-b border-gray-100 bg-[#ecf3ff] dark:bg-[#101828] dark:border-white/[0.05]">
//                     <TableRow>
//                       <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Heading</TableCell>
//                       <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Category Name</TableCell>
//                       <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Image Limit</TableCell>
//                       <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Per Slide</TableCell>
//                       <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Status</TableCell>
//                       <TableCell isHeader className="px-5 py-3 text-[#465fff] text-start">Actions</TableCell>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {designs.map((item) => (
//                       <TableRow key={item.id} className="border-b text-sm border-blue-400 dark:border-white/[0.05]">
//                         <TableCell className="px-5 py-3">{item.heading || 'Not Valid for this category'}</TableCell>
//                         <TableCell className="px-5 py-3"> Nothing</TableCell>
//                         <TableCell className="px-5 py-3">{item.imglimit || 'Not Valid'}</TableCell>
//                         <TableCell className="px-5 py-3">{item.perslideimage || 'Not Valid'}</TableCell>
//                         <TableCell className="px-5 py-3">{item.status || 'Not Valid'}</TableCell>
//                         <TableCell className="px-5 py-3">
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-2 rounded ${deletingId === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
//                             disabled={deletingId === item.id}
//                           >
//                             {deletingId === item.id ? '...' : <Trash2 className="w-4 h-4" />}
//                           </button>
//                           <button
//                             onClick={() => handleUpdateClick(item)}
//                             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded ml-2"
//                           >
//                             <Pencil className="w-4 h-4" />
//                           </button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {!loading && designs.length === 0 && (
//                       <TableRow>
//                         <TableCell colSpan={5} className="text-center py-4 text-gray-400 italic">
//                           No designs found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {editingItem && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-[400px]">
//             <h2 className="text-lg font-bold mb-4">Edit Section</h2>
//             {['heading', 'imglimit', 'perslideimage', 'status'].map((field) => (
//               <div key={field} className="mb-3">
//                 <label className="block text-sm font-medium text-gray-700 capitalize mb-1">{field}</label>
//                 <input
//                   type="text"
//                   className="w-full border px-3 py-2 rounded"
//                   value={(formData as any)[field] || ''}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, [field]: e.target.value }))
//                   }
//                 />
//               </div>
//             ))}
//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={() => setEditingItem(null)}
//                 className="bg-gray-300 text-black px-4 py-2 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateSubmit}
//                 className="bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePageCategory;



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
import {View, Trash2, Pencil } from 'lucide-react';
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

  const API_URL = 'https://cc4a-103-206-131-194.ngrok-free.app';

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

  const handleUpdateSubmit = async () => {
    if (!editingItem) return;
    const changedFields: any = {};

    Object.keys(formData).forEach((key) => {
      const originalValue = (editingItem as any)[key];
      const newValue = (formData as any)[key];
      if (originalValue !== newValue) {
        changedFields[key] = newValue;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.info('No changes detected.');
      return;
    }

    try {
      const response = await axiosInstance.post('/graphql', {
        query: `
          mutation UpdateCarousel(
            $updatecarouselSectionDesignId: ID!
            $heading: String
            $imglimit: String
            $perslideimage: String
            $status: String
          ) {
            updatecarouselSectionDesign(
              id: $updatecarouselSectionDesignId
              heading: $heading
              imglimit: $imglimit
              perslideimage: $perslideimage
              status: $status
            ) {
              id
              heading
              imglimit
              perslideimage
              status
              resMessage
              resStatus
            }
          }
        `,
        variables: {
          updatecarouselSectionDesignId: editingItem.id,
          ...changedFields,
        },
      });

      const res = response.data?.data?.updatecarouselSectionDesign;

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
                    {designs.map((item) => (
                      <TableRow key={item.id} className="border-b text-sm border-blue-400 dark:border-white/[0.05]">
                        <TableCell className="px-5 py-3">
                        {item.id || 'Not Valid for this category'}
                        </TableCell>
                        <TableCell className="px-5 py-3">
                          {categoryNames[item.hompagesectioncategory_id] || 'Loading...'}
                        </TableCell>
                        <TableCell className="px-5 py-3">{item.heading || 'Not Valid for this category'}</TableCell>
                        <TableCell className="px-5 py-3">{item.imglimit || 'Not Valid'}</TableCell>
                        <TableCell className="px-5 py-3">{item.perslideimage || 'Not Valid'}</TableCell>
                        <TableCell className="px-5 py-3">{item.status || 'Not Valid'}</TableCell>
                        <TableCell className="px-5 py-3">
                           {/* <button
                            onClick={() => handleView(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-1.5 rounded"
                          >
                            <View className="w-3 h-3" />
                          </button> */}
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
    <div className="bg-white p-6 rounded-lg w-[400px] h-[600px] overflow-y-auto">
     <div className='flex justify-between mb-4 text-center'>
     <h2 className="text-lg font-bold">Edit Section</h2>
     <button onClick={() => setEditingItem(null)} className='cursor-pointer p-[3px] rounded border'>X</button>
     </div>
      {Object.entries(formData).map(([field, value]) => (
        <div key={field} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
            {field}
          </label>

          {field === 'advertisement' && (
  <div className="mb-6">
    {value ? (
      <div className="space-y-2">
        <img
          src={`${API_URL}${value}`}
          alt="Advertisement"
          className="w-full h-40 object-cover rounded mb-2"
        />
      </div>
    ) : (
      <p className="text-gray-400">No image available</p>
    )}
  </div>
)}


          {/* {field === 'content' && typeof value === 'object' && value !== null ? (
            <div className="space-y-4">
              {value.rows.map((row: any, rowIndex: number) => (
                <div key={rowIndex} className="space-y-2">
                  {row.columns.map((column: any, colIndex: number) => (
                    <div key={colIndex} className="p-3 border rounded bg-gray-50">
                      <p className="font-semibold mb-2">{column.heading}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {column.images.map((img: any, imgIndex: number) =>
                          img.url ? (
                            <div key={imgIndex} className="text-xs text-center">
                              <img
                                src={`${API_URL}${img.url}`}
                                alt={`img-${imgIndex}`}
                                className="w-full h-24 object-cover rounded mb-1"
                              />
                              <p className="break-all text-gray-600 text-xs">{`${API_URL}${img.url}`}</p>
                            </div>
                          ) : null
                        )}
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
                  newValue = Number(e.target.value);
                } else if (typeof value === 'object' && value !== null) {
                  try {
                    newValue = JSON.parse(e.target.value);
                  } catch {
                    // keep as string if JSON is invalid
                  }
                }
                setFormData((prev) => ({ ...prev, [field]: newValue }));
              }}
            />
          )} */}

{field === 'content' && typeof value === 'object' && value !== null ? (
  <div className="space-y-4">
    {value.rows.map((row: any, rowIndex: number) => (
      <div key={rowIndex} className="space-y-2">
        {row.columns.map((column: any, colIndex: number) => (
          <div key={colIndex} className="p-3 border rounded bg-gray-50">
            <p className="font-semibold mb-2">{column.heading}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {column.images.map((img: any, imgIndex: number) =>
                img.url ? (
                  <div key={imgIndex} className="text-xs text-center w-full">
                    {/* If link is present, wrap the image in an anchor tag */}
                    {img.link ? (
                      // <a href={img.link} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={`${API_URL}${img.url}`}
                          alt={`img-${imgIndex}`}
                          height={200}
                          width={200}
                          className="w-full h-24 object-cover rounded mb-1"
                        />
                      // </a>
                    ) : (
                      <Image
                        src={`${API_URL}${img.url}`}
                        alt={`img-${imgIndex}`}
                        width={200}
                        height={200}
                        className="w-full h-24 object-cover rounded mb-1"
                      />
                    )}

                    {img.link && (
                      <p className="text-blue-600 text-xs mt-1">
                        <a href={img.link} target="_blank" rel="noopener noreferrer">
                          {img.link}
                        </a>
                      </p>
                    )}
                  </div>
                ) : null
              )}
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
        newValue = Number(e.target.value);
      } else if (typeof value === 'object' && value !== null) {
        try {
          newValue = JSON.parse(e.target.value);
        } catch {
          // keep as string if JSON is invalid
        }
      }
      setFormData((prev) => ({ ...prev, [field]: newValue }));
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
