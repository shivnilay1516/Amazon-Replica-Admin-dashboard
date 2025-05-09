"use client";
import React, { useState, useEffect } from 'react';
import PageBreadcrumb from '../common/PageBreadcrumb';
import ComponentCard from '../common/ComponentCard';
import Label from '../form/Label';
import FileInput from '../form/input/FileInput';
import Button from '../ui/button/Button';
import Select from 'react-select';
import Image from 'next/image';
import axios from 'axios';
import Input from '../form/input/InputField';
import { SingleValue } from 'react-select';

interface OptionType {
  value: string;
  label: React.ReactNode;
  image: string;
  category: string;
}

interface ImageContainer {
  index: number;
  file: File;
}

interface homepagedesigncategory{
  showHomeListAction:()=> void;
}

const getIndex = (name: string): number => {
  let index: number = 0;
  switch(true) {
    case name === "firstrowfirstImage":
      index = 0;
    break;
    case name === "firstrowsecondImage":
      index = 1;
    break;
    case name === "firstrowthirdImage":
      index = 2;
    break;
    case name === "firstrowfourthImage":
      index = 3;
    break;
    case name === "secondrowfirstimage":
      index = 4;
    break;
    case name === "secondrowsecondimage":
      index = 5;
    break;
    case name === "secondrowthirdimage":
      index = 6;
    break;
    case name === "secondrowforthimage":
      index = 7;
    break;
    case name === "thirdrowfirstimage":
      index = 8;
    break;
    case name === "thirdrowSecondimage":
      index = 9;
    break;
    case name === "thirdrowthirdimage":
      index = 10;
    break;
    case name === "thirdrowfourthimage":
      index = 11;
    break;
    case name === "fourthrowfirstimage":
      index = 12;
    break;
    case name === "fourthrowsecondimage":
      index = 13;
    break;
    case name === "fourthrowthirdimage":
      index = 14;
    break;
    case name === "fourthrowfourthimage":
      index = 15;
    break;
    default:
      index = 0;
  }
  return index;
}


const Homepagedesign = ({showHomeListAction}: homepagedesigncategory) => {
  const [selectOptions, setOptions] = useState<OptionType[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [crouselformData, setCrouselFormData] = useState({
    crouselheading: '',
    crouselimagelength: '',
    imageLength: '',
  });
  const [presentationformData, setPresentationformData] = useState({
    presentationheading:'',
    presentationimagelength:'',
    presentimageLength:'',
    advertisementdata:'',
    advertisementpath:'',
  });
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [selectCategory, setSelectCategory] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<ImageContainer[]>([]);
  const [crouselimage, setCrouselImage] = useState<ImageContainer[]>([]);
  const [presentationimage, setPresentationImage] = useState<ImageContainer[]>([]);
  const [imageLength, setImageLength]=useState('');
  const [presentimageLength, setPresentimageLength]=useState('');
  const[error, setError]=useState('');
  const[validCount, setValidCount]=useState(0);

  const dummy_img = '/images/carousel/carousel-02.png';
  const API_URL = 'https://cc4a-103-206-131-194.ngrok-free.app';
  // const API_URL = 'https://amazonreplica.onrender.com';

  useEffect(() => {
    // This prevents "unused variable" warning
    void setImageLength;
  }, []);
  useEffect(() => {
    // This prevents "unused variable" warning
    void setPresentimageLength;
  }, []);

// Api for Select option

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      setSelectedImage(`${API_URL}${selectedOption.image}`);
      setSelectCategory(selectedOption.category);
    }
  };

  const fetchOptions = async () => {
    try {
      const response = await axios.post(`${API_URL}/graphql`, {
        query: `
          query Query {
            getHomeSectionCategory {
              id
              categoryname
              categoryimage
              resMessage
              resStatus
            }
          }
        `,
      });

      const roles = response.data.data.getHomeSectionCategory;
      const formattedOptions = roles.map((role: any) => ({
        value: role.id,
        label: (
          <div className="flex items-center gap-2">
            <Image
              src={role.categoryimage}
              alt={role.categoryimage}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full"
            />
            {role.categoryname}
          </div>
        ),
        image: role.categoryimage,
        category: role.categoryname,
      }));

      setOptions(formattedOptions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);


// API for Four Column Data Feteching

  const handleChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSubmitData = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const formDataToSubmit = new FormData();
  //   const payload = {
  //     query: `
  //       mutation Column4addSectionDesign($hompagesectioncategoryId: Int, $heading: String, $rows: [RowInput]) {
  //         column4addSectionDesign(
  //           hompagesectioncategory_id: $hompagesectioncategoryId,
  //           heading: $heading,
  //           rows: $rows
  //         ) {
  //           id
  //           hompagesectioncategory_id
  //           advertisement
  //           advertisement_link
  //           heading
  //           imglimit
  //           perslideimage
  //           content
  //           status
  //           resMessage
  //           resStatus
  //           createdIstAt
  //           updatedIstAt
  //         }
  //       }
  //     `,
  //     variables: {
  //       hompagesectioncategoryId: 1,
  //       heading: formData['catgoryName'],
  //       rows: [
  //         {
  //           columns: [
  //             {
  //               heading: formData['firstRowName'],
  //               images: [
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 }
  //               ]
  //             },
  //             {
  //               heading: formData['secondrowname'],
  //               images: [
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 }
  //               ]
  //             },
  //             {
  //               heading: formData['thirdrowname'],
  //               images: [
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 }
  //               ]
  //             },
  //             {
  //               heading: formData['fourthrowname'],
  //               images: [
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 },
  //                 {
  //                   link: null,
  //                   file: null
  //                 }
  //               ]
  //             }
  //           ],
  //         },
  //       ],
  //     },
  //   };

  //   formDataToSubmit.append('operations', JSON.stringify(payload));
  //   formDataToSubmit.append("map", "{\"0\":[\"variables.rows.0.columns.0.images.0.file\"],\"1\":[\"variables.rows.0.columns.0.images.1.file\"],\"2\":[\"variables.rows.0.columns.0.images.2.file\"],\"3\": [\"variables.rows.0.columns.0.images.3.file\"],\"4\": [\"variables.rows.0.columns.1.images.0.file\"],\"5\": [\"variables.rows.0.columns.1.images.1.file\"],\"6\": [\"variables.rows.0.columns.1.images.2.file\"],\"7\": [\"variables.rows.0.columns.1.images.3.file\"],\"8\": [\"variables.rows.0.columns.2.images.0.file\"],\"9\": [\"variables.rows.0.columns.2.images.1.file\"],\"10\": [\"variables.rows.0.columns.2.images.2.file\"],\"11\": [\"variables.rows.0.columns.2.images.3.file\"],\"12\": [\"variables.rows.0.columns.3.images.0.file\"],\"13\": [\"variables.rows.0.columns.3.images.1.file\"],\"14\": [\"variables.rows.0.columns.3.images.2.file\"],\"15\": [\"variables.rows.0.columns.3.images.3.file\"]}");
  //   formDataToSubmit.append("map", "{\"link0\":[\"variables.rows.0.columns.0.images.0.link\"],\"link1\":[\"variables.rows.0.columns.0.images.1.link\"],\"link2\":[\"variables.rows.0.columns.0.images.2.link\"],\"link3\": [\"variables.rows.0.columns.0.images.3.link\"],\"link4\": [\"variables.rows.0.columns.1.images.0.link\"],\"link5\": [\"variables.rows.0.columns.1.images.1.link\"],\"link6\": [\"variables.rows.0.columns.1.images.2.link\"],\"link7\": [\"variables.rows.0.columns.1.images.3.link\"],\"link8\": [\"variables.rows.0.columns.2.images.0.link\"],\"link9\": [\"variables.rows.0.columns.2.images.1.link\"],\"link10\": [\"variables.rows.0.columns.2.images.2.link\"],\"link11\": [\"variables.rows.0.columns.2.images.3.link\"],\"link12\": [\"variables.rows.0.columns.3.images.0.link\"],\"link13\": [\"variables.rows.0.columns.3.images.1.link\"],\"link14\": [\"variables.rows.0.columns.3.images.2.link\"],\"link15\": [\"variables.rows.0.columns.3.images.3.link\"]}");
  //   image.forEach((i: ImageContainer) => {
  //     formDataToSubmit.append(`${i.index}`, i.file);
  //     formDataToSubmit.append(`link${i.index}`, URL.createObjectURL(i.file));
  //   })
  //   console.log("dsds", payload.variables);
    
  //   console.log("formDataToSubmit__",formDataToSubmit);
  //   // try {
  //   //   const response = await axios.post(`${API_URL}/graphql`, formDataToSubmit, {
  //   //     headers: { 'Content-Type': 'multipart/form-data' },
  //   //   });
  //   //   console.log('GraphQL Response:', response.data);
  //   //   alert('Data submitted successfully!');
  //   // } catch (error: any) {
  //   //   console.error('Error:', error.response?.data || error.message);
  //   //   alert('There was an error submitting the form.');
  //   try {
  //     const response = await axios.post(`${API_URL}/graphql`, formDataToSubmit, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
    
  //     const responseData = response.data as {
  //       data?: { column4addSectionDesign: any };
  //       errors?: { message: string }[];
  //     };
    
  //     if (responseData.errors && responseData.errors.length > 0) {
  //       const errorMessage = responseData.errors.map((err: any) => err.message).join('\n');
  //       // alert(`GraphQL Error:\n${errorMessage}`);
  //       alert(`Somthing wrong:\n${errorMessage}`);
  //     } else if (!responseData.data || !responseData.data.column4addSectionDesign) {
  //       alert('Submission failed: No data returned.');
  //     } else {
  //       alert('Data submitted successfully!');
  //       console.log('GraphQL Response:', responseData);
  //     }
  //   } catch (error: any) {
  //     console.error('Request Error:', error.response?.data || error.message);
  //     alert('There was a network or server error submitting the form.');
    
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    // ✅ Filter only images with actual files
    const uploadedImages = image.filter((img: ImageContainer) => img.file);
  
    // ✅ Validate image count
    if (uploadedImages.length !== 4 && uploadedImages.length !== 15) {
      alert("You must upload either exactly 4 images or all 16 images.");
      setLoading(false);
      return;
    }
  
    const formDataToSubmit = new FormData();
  
    const payload = {
      query: `
        mutation Column4addSectionDesign($hompagesectioncategoryId: Int, $heading: String, $rows: [RowInput]) {
          column4addSectionDesign(
            hompagesectioncategory_id: $hompagesectioncategoryId,
            heading: $heading,
            rows: $rows
          ) {
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
      variables: {
        hompagesectioncategoryId: 1,
        heading: formData['catgoryName'],
        rows: [
          {
            columns: [
              {
                heading: formData['firstRowName'],
                images: Array(4).fill({ link: null, file: null }),
              },
              {
                heading: formData['secondrowname'],
                images: Array(4).fill({ link: null, file: null }),
              },
              {
                heading: formData['thirdrowname'],
                images: Array(4).fill({ link: null, file: null }),
              },
              {
                heading: formData['fourthrowname'],
                images: Array(4).fill({ link: null, file: null }),
              },
            ],
          },
        ],
      },
    };
  
    formDataToSubmit.append('operations', JSON.stringify(payload));
  
    // ✅ Build a single map for file uploads
    const fileMap: Record<string, string[]> = {};
    uploadedImages.forEach((img: ImageContainer) => {
      const colIndex = Math.floor(Number(img.index) / 4);
      const imgIndex = Number(img.index) % 4;
      fileMap[img.index] = [`variables.rows.0.columns.${colIndex}.images.${imgIndex}.file`];
    });
  
    formDataToSubmit.append('map', JSON.stringify(fileMap));
  
    // ✅ Append the actual image files
    uploadedImages.forEach((img: ImageContainer) => {
      formDataToSubmit.append(img.index, img.file);
    });
  
    try {
      const response = await axios.post(`${API_URL}/graphql`, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const responseData = response.data as {
        data?: { column4addSectionDesign: any };
        errors?: { message: string }[];
      };
  
      if (responseData.errors?.length) {
        const errorMessage = responseData.errors.map(err => err.message).join('\n');
        alert(`Something went wrong:\n${errorMessage}`);
      } else if (!responseData.data?.column4addSectionDesign) {
        alert('Submission failed: No data returned.');
      } else {
        alert('Data submitted successfully!');
        console.log('GraphQL Response:', responseData);
      }
    } catch (error: any) {
      console.error('Request Error:', error.response?.data || error.message);
      alert('There was a network or server error submitting the form.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;
    if (file && name) {
      const index = getIndex(name);
      setImage((prev) => {
        return [...prev.filter((f) => f.index !== index), { index: index, file: file }]
      });
    }
    console.log("file", file);
  };


// API for Crousel Data fetching


  const handleImageLengthChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const value=parseInt(e.target.value, 10);
    // setCrouselImage(e.target.value);
    setCrouselFormData(prev => ({
      ...prev,
      imageLength: e.target.value,
    }));

    if(value>=6 && value<=20){
      setValidCount(value);
      setError("");
    }
    else{
      setValidCount(0);
      setError("Please Enter length of image between 6 to 20")
    }
  }

  const handleCrouselChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCrouselFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log("all data", name, value)
  };

  const handleCrouselImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name;
    const index = getCrouselIndex(name); 

    if (file && index >= 0) {
      setCrouselImage((prev) => [
        ...prev.filter((f) => f.index !== index),
        { index, file },
      ]);
    }
    console.log("Uploaded file for index", index, file);
  };

  const getCrouselIndex = (name: string): number => {
    const match = name.match(/\d+$/);
    return match ? parseInt(match[0], 10) : -1;
  };

  const handleCrouselSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSubmit = new FormData();
    const imageLength = parseInt(crouselformData['imageLength'], 10);

    // Build images array with link only, files handled via map+FormData
    const imagesArray = Array.from({ length: imageLength }, (_, i) => {
      const path = (crouselformData as any)[`path-${i}`] || "";
      return {
        link: path,
        file: null,
      };
    });

    const payload = {
      query: `
        mutation CarouseladdSectionDesign($hompagesectioncategoryId: Int, $heading: String, $imglimit: String, $rows: [RowInput], $perslideimage: String) {
          carouseladdSectionDesign(
            hompagesectioncategory_id: $hompagesectioncategoryId, 
            heading: $heading, 
            imglimit: $imglimit, 
            rows: $rows, 
            perslideimage: $perslideimage
          ) {
            id
            heading
            content
            resStatus
            resMessage
          }
        }
      `,
      variables: {
        hompagesectioncategoryId: 1,
        heading: crouselformData['crouselheading'],
        imglimit: crouselformData['imageLength'],
        perslideimage: crouselformData['crouselimagelength'],
        rows: [
          {
            columns: [
              {
                images: imagesArray
              }
            ]
          }
        ]
      }
    };

    // Build GraphQL multipart map
    const mapObj: Record<string, string[]> = {};
    crouselimage.forEach((img: ImageContainer) => {
      mapObj[`${img.index}`] = [`variables.rows.0.columns.0.images.${img.index}.file`];
    });

    formDataToSubmit.append("operations", JSON.stringify(payload));
    formDataToSubmit.append("map", JSON.stringify(mapObj));

    // Append actual files
    crouselimage.forEach((img: ImageContainer) => {
      formDataToSubmit.append(`${img.index}`, img.file);
    });

    console.log("Payload", payload.variables)

    try {
      const response = await axios.post(`${API_URL}/graphql`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("GraphQL Response:", response.data);
      alert("Data submitted successfully!");
    } catch (error: any) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert("There was an error submitting the form.");
    } finally {
      setLoading(false);
    }
  };


// Presentation(advertisement) API data


  const handlePresentationImageLengthChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    const value=parseInt(e.target.value, 10);
    // setCrouselImage(e.target.value);
    setPresentationformData(prev => ({
      ...prev,
      presentimageLength: e.target.value,
    }));

    if(value>=6 && value<=20){
      setValidCount(value);
      setError("");
    }
    else{
      setValidCount(0);
      setError("Please Enter length of image between 6 to 20")
    }
  }

  const handlePresentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
      const name = e.target.name;
      const index = getPresentationIndex(name); 

      if (file && index >= 0) {
        setPresentationImage((prev) => [
          ...prev.filter((f) => f.index !== index),
          { index, file },
        ]);
      }
      console.log("Images", index, file);
  };

  const handlePresentationData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPresentationformData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log("all data", name, value)
  };

  const handlePresentationAdvertisement=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setPresentationformData(prev => ({
        ...prev,
        [name]: file, // ✅ dynamically set the file under the correct field name
      }));
      console.log("File input received:", name, file);
    }
  };

  const getPresentationIndex = (name: string): number => {
        const match = name.match(/\d+$/);
        return match ? parseInt(match[0], 10) : -1;
  };

const handlePresentationSubmitData = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const presentationformDataToSubmit = new FormData();
  const presentimageLength = parseInt(presentationformData['presentimageLength'], 10);


  // Build images array with link only, files handled via map+FormData
  const imagesArray = Array.from({ length: presentimageLength }, (_, i) => {
    const path = (presentationformData as any)[`path-${i}`] || "";
    const heading=(presentationformData as any)[`heading-${i}`]||"";
    const title=(presentationformData as any)[`title-${i}`]||"";

    return {
      link: path,
      file: null,
      heading: heading,
      title: title
    };
  });
  let advLink: any = ""
  const advertisementFile: any = presentationformData['advertisementdata'];
  if (advertisementFile instanceof File) {
    advLink = URL.createObjectURL(advertisementFile);
  } else {
    advLink = "";
    console.error("advertisementdata is not a File:", advertisementFile);
  }

  const payload = {
    query: `
     mutation AddSection($heading: String,$advertisement: Upload, $advertisementLink: String,$imglimit:String,$perslideimage:String, $rows: [RowInput], $hompagesectioncategoryId: Int) {
      advertisementcarouseladdSectionDesign(heading: $heading,advertisement:$advertisement,advertisement_link:$advertisementLink,imglimit: $imglimit,perslideimage: $perslideimage, rows: $rows,hompagesectioncategory_id: $hompagesectioncategoryId) {
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
    }`
    ,
    variables: {
      heading: presentationformData['presentationheading'],
      hompagesectioncategoryId: 2,
      imglimit: presentationformData['presentimageLength'],
      advertisement: null,
      advertisementLink: advLink,
      perslideimage: presentationformData['presentationimagelength'],
      rows: [
        {
          columns: [
            {
              images: imagesArray
            }
          ]
        }
      ]
    }
  };

  // Build GraphQL multipart map
  const mapObj: Record<string, string[]> = {};
  const mapLinkObj: Record<string, string[]> = {};

  presentationimage.forEach((img: ImageContainer, idx:number) => {
    mapObj[`${img.index}`] = [`variables.rows.0.columns.0.images.${img.index}.file`];
    mapLinkObj[`link${img.index}`] = [`variables.rows.0.columns.0.images.${img.index}.link`];
  });
  mapObj[presentationimage.length] = [`variables.advertisement`];

  presentationformDataToSubmit.append("operations", JSON.stringify(payload));
  presentationformDataToSubmit.append("map", JSON.stringify(mapObj));
  presentationformDataToSubmit.append("map", JSON.stringify(mapLinkObj));

  presentationimage.forEach((img: ImageContainer) => {
    presentationformDataToSubmit.append(`${img.index}`, img.file);
    presentationformDataToSubmit.append(`link${img.index}`, URL.createObjectURL(img.file));
  });

  presentationformDataToSubmit.append(`${presentationimage.length}`, presentationformData['advertisementdata']);

  console.log("`Payload`", payload.variables, presentationformData['advertisementdata'])
  console.log("submit",presentationformDataToSubmit)

  try {
    const response = await axios.post(`${API_URL}/graphql`, presentationformDataToSubmit, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("GraphQL Response:", response.data);
    alert("Data submitted successfully!");
  } catch (error: any) {
    console.error("Submission Error:", error.response?.data || error.message);
    alert("There was an error submitting the form.");
  } finally {
    setLoading(false);
  }
};



type DropdownOption = {
    label: string;
    action: () => void;
  };

  const options: DropdownOption[] = [
    {
      label: "View Home Category",
      action: () => {
        console.log("view more home page");
        showHomeListAction();
      },
    },
    {
      label: "Refresh",
      action: () => {
        console.log("Refresh clicked");
      },
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Home Page Section" />  
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 items-start">
        <div className="border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] py-4 px-5 rounded-2xl">
        <div className="space-y-6">
        <ComponentCard title="Section Category Section" isDropDownIcon={true} options={options}>
          <form className="space-y-6 mb-6">
            <Label>Select Category</Label>
            <Select
              options={selectOptions}
              onChange={handleChange}
              placeholder="Select role"
              classNames={{
                control: ({ isFocused }) =>
                  `h-11 w-full rounded-lg border bg-white dark:bg-gray-800  ${isFocused ? 'border-ring-brand-300' : 'border-gray-300'} text-sm text-gray-500 shadow-theme-xs transition-colors focus:outline-none`,
                placeholder: () => 'text-gray-400',
                singleValue: () => 'text-gray-500',
                menu: () => 'z-20',
              }}
            />
          </form>
          </ComponentCard>
          </div>

          <form onSubmit={handleSubmitData} action=" " className='space-y-6 mt-4' style={{ display: selectCategory=== "4 columns" ? 'block' : 'none' }} >
              <Label>Category Name</Label>
              <Input
                type="text" 
                name='catgoryName'
                placeholder='Enter main category name'
                onChange={handleChangeData}
              />
              <div className='flex flex-wrap'>
                <div className='w-full mb-4 border border-blue-400 p-2 rounded'>
                  <div className='px-1.5'>
                  <Label>First Row Name</Label>
                  <Input
                    type="text"
                  placeholder='Enter first row name'
                    name='firstRowName'
                    onChange={handleChangeData}
                  />
                  <div className=''>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='firstrowfirstImagePath'
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name="firstrowfirstImage"
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='firstrowsecondImagePath'
                    
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name="firstrowsecondImage"
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='firstrowthirdImagePath'
                    
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name="firstrowthirdImage"
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='firstrowfourthImagePath'
                    
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='firstrowfourthImage'
                      />
                    </div>
                  </div>
                  </div>
                </div>
                <div className='w-full mb-4 border border-blue-400 p-2 rounded'>
                  <div className='px-1.5'>
                  <Label>Second Row Name</Label>
                  <Input
                    type="text"
                    placeholder='Enter second row name'
                    name="secondrowname"
                    onChange={handleChangeData}
                  />
                  <div className=''>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    
                    name='secondrowfirstimagename'
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='secondrowfirstimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    
                    name='secondrowsecondimagename'
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='secondrowsecondimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    
                    name="secondrowthirdimagename"
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='secondrowthirdimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    
                    name="secondrowforthimagename"
                    onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='secondrowforthimage'
                      />
                    </div>
                  </div>
                  </div>
                </div>
                <div className='w-full mb-4 border border-blue-400 p-2 rounded'>
                  <div className='px-1.5'>
                  <Label>Third Row Name</Label>
                  <Input
                    type="text"
                    name="thirdrowname"
                    placeholder='Enter third row name'
                  onChange={handleChangeData}
                  />
                  <div className=''>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name="thirdrowfirstimagename"
                    
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='thirdrowfirstimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='thirdrowSecondimagename'
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='thirdrowSecondimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='thirdrowthirdimagename'
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='thirdrowthirdimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name="thirdrowfourthimagename"
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='thirdrowfourthimage'
                      />
                    </div>
                  </div>
                  </div>
                </div>
                <div className='w-full mb-4 border border-blue-400 p-2 rounded'>
                  <div className='px-1.5'>
                  <Label>Fourth Row Name</Label>
                  <Input
                    type="text"
                    name="fourthrowname"
                    placeholder='Enter fourth row name'
                  onChange={handleChangeData}
                  />
                  <div className=''>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='fourthrowfirstimagename'
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='fourthrowfirstimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='fourthrowsecondimagename'
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='fourthrowsecondimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='fourthrowthirdimagename'
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='fourthrowthirdimage'
                      />
                    </div>
                    <div className='my-2 flex items-center gap-2'>
                    <Input
                    type="text"
                    placeholder='Enter the path'
                    name='fourthrowfourthimagename'
                  onChange={handleChangeData}
                  />
                      <FileInput
                        className="custom-class"
                        onChange={handleImageChange}
                        name='fourthrowfourthimage'
                      />
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                  <Button size="sm" variant="primary">
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
              </div>
          </form>

          <form onSubmit={handleCrouselSubmitData} action=" " className='space-y-6 mt-4' style={{ display: selectCategory=== "carousel" ? 'block' : 'none' }} >
                 <div className='flex flex-col border border-blue-400 p-2 rounded'>
                        <Input
                          type="text"
                          placeholder='Enter section heading'
                          name='crouselheading'
                          onChange={handleCrouselChangeData}
                        />
                        <Input type="number" placeholder='Enter number of image to show'
                         name="crouselimagelength"
                         onChange={handleCrouselChangeData}/>

                        <Input type="number"
                        placeholder='Enter the image length' 
                        name="imageLength"
                        value={imageLength}
                        onChange={handleImageLengthChange}/>

                      {error && <p className='text-red-500 text-sm'>{error}</p>}
                        <div>
                            {Array.from({ length: validCount }).map((_, index) => (
                              <div key={index} className='my-1.5'>
                                <Input
                                  type="text"
                                  placeholder={`Enter the path for image ${index + 1}`}
                                  name={`path-${index}`}
                                  onChange={handleCrouselChangeData}
                                />
                                <FileInput
                                  className="custom-class"
                                  name={`file-${index}`}
                                  onChange={handleCrouselImageChange}
                                />
                              </div>
                            ))}
                          </div>
                 </div>
              <div className="flex justify-center">
                  <Button size="sm" variant="primary">
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
              </div>
          </form>

          <form onSubmit={handlePresentationSubmitData} action=" " className='space-y-6 mt-4' style={{ display: selectCategory=== "advertisement with carousel" ? 'block' : 'none' }} >
              <div className='flex flex-col border border-blue-400 p-2 rounded'>
                        <Input
                          type="text"
                          placeholder='Enter section heading'
                          name='presentationheading'
                          onChange={handlePresentationData}
                        />
                        <Input type="number" placeholder='Enter number of image to show'
                         name="presentationimagelength"
                         onChange={handlePresentationData}/>

                          <FileInput
                                  className="custom-class"
                                  name="advertisementdata"
                                  onChange={handlePresentationAdvertisement}
                                />
                                 <Input type="text" placeholder='Enter advertisement path'
                         name="advertisementpath"
                         onChange={handlePresentationData}/>

                        <Input type="number"
                        placeholder='Enter the image length' 
                        name="presentimageLength"
                        value={presentimageLength}
                        onChange={handlePresentationImageLengthChange}/>

                      {error && <p className='text-red-500 text-sm'>{error}</p>}
                        <div>
                            {Array.from({ length: validCount }).map((_, index) => (
                              <div key={index} className='my-1.5'>
                                <Input
                                  type="text"
                                  placeholder={`Enter the path for image ${index + 1}`}
                                  name={`path-${index}`}
                                  onChange={handlePresentationData}
                                />
                                <FileInput
                                  className="custom-class"
                                  name={`file-${index}`}
                                  onChange={handlePresentImageChange}
                                />
                                <Input type="text" placeholder={`Enter the heading ${index+1}`}
                                name={`heading-${index}`}
                                onChange={handlePresentationData}
                                />
                                <Input type="text" placeholder={`Enter the title ${index+1}`}
                                name={`title-${index}`}
                                onChange={handlePresentationData}
                                />
                              </div>
                            ))}
                          </div>
                 </div>
              <div className="flex justify-center">
                  <Button size="sm" variant="primary">
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
              </div>
          </form>

          </div>
          <div className='border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] py-4 px-5 rounded-2xl'>
            <Image src={selectedImage ? selectedImage : dummy_img} alt="Selected Image" width={500} height={400} className='py-3 w-full' />
          </div>
        </div>
      </div>
    )
  }

  export default Homepagedesign
