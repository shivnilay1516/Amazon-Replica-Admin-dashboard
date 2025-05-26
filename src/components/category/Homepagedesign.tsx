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
import Cookies from 'js-cookie';

interface OptionType {
  value: string;
  label: React.ReactNode;
  image: string;
  category: string;
}
interface CarouselSectionDesign {
  id: string;
  name: string;
  imageUrl: string;
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
type FormValue = string | number | boolean | File | null;

type PresentationFormData = {
  [key: string]: string | undefined;
};
interface AdvertisementCarouselSection {
  id: number;
  title: string;
  heading: string;
  link: string;
}

type Category = {
  id: number;
  categoryname: string;
  categoryimage: string;
  resMessage: string;
  resStatus: string;
};

type GetHomeSectionCategoryResponse = {
  data: {
    getHomeSectionCategory: Category[];
  };
};
interface CrouselFormData {
  [key: `path-${number}`]: string | undefined;
}


const Homepagedesign = ({showHomeListAction}: homepagedesigncategory) => {
  const [selectOptions, setOptions] = useState<OptionType[]>([]);
  const [formData, setFormData] = useState<Record<string, FormValue>>({});
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
  const API_URL = 'https://0737-103-206-131-194.ngrok-free.app';

    const token = Cookies.get('token');
  // const API_URL = 'https://amazonreplica.onrender.com';

  useEffect(() => {
    void setImageLength;
  }, []);
  useEffect(() => {
    void setPresentimageLength;
  }, []);

// Api for Select option

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    if (selectedOption) {
      setSelectedImage(`${API_URL}${selectedOption.image}`);
      setSelectCategory(selectedOption.category);
    }
  };

  // const fetchOptions = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}/graphql`, {
  //       query: `
  //         query Query {
  //           getHomeSectionCategory {
  //             id
  //             categoryname
  //             categoryimage
  //             resMessage
  //             resStatus
  //           }
  //         }
  //       `,
  //     });
  //     const roles = response.data.data.getHomeSectionCategory;
  //     const formattedOptions = roles.map((role: {id: number; categoryname: string; categoryimage: string }) => ({
  //       value: role.id,
  //       label: (
  //         <div className="flex items-center gap-2">
  //           <Image
  //             src={role.categoryimage}
  //             alt={role.categoryimage}
  //             width={20}
  //             height={20}
  //             className="w-5 h-5 rounded-full"
  //           />
  //           {role.categoryname}
  //         </div>
  //       ),
  //       image: role.categoryimage,
  //       category: role.categoryname,
  //     }));

  //     setOptions(formattedOptions);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Failed to fetch roles:', error);
  //     setLoading(false);
  //   }
  // };




const fetchOptions = async () => {
  try {
    const response = await axios.post<GetHomeSectionCategoryResponse>(
      `${API_URL}/graphql`,
      {
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
      }
    );

    const roles = response.data.data.getHomeSectionCategory;

    const formattedOptions = roles.map((role) => ({
      value: role.id.toString(),
      label: (
        <div className="flex items-center gap-2">
          {/* <Image
            src={role.categoryimage}
            alt={role.categoryname}
            width={20}
            height={20}
            className="w-5 h-5 rounded-full"
          /> */}
          {role.categoryname}
        </div>
      ),
      image: role.categoryimage,
      category: role.categoryname,
    }));

    setOptions(formattedOptions);
    setLoading(false);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
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
 
  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    // ✅ Filter only images with actual files
    const uploadedImages = image.filter((img: ImageContainer) => img.file);
  
    // ✅ Validate per-row image rules
    const rowImages: { [key: number]: ImageContainer[] } = {};
    uploadedImages.forEach((img: ImageContainer) => {
      const rowIndex = Math.floor(Number(img.index) / 4);
      if (!rowImages[rowIndex]) rowImages[rowIndex] = [];
      rowImages[rowIndex].push(img);
    });
  
    let fullRowCount = 0;
    let isValid = true;
  
    for (let i = 0; i < 4; i++) {
      const imagesInRow = rowImages[i] || [];
  
      if (![0, 1, 4].includes(imagesInRow.length)) {
        alert(`Row ${i + 1} must have either 1 or 4 images. Currently has ${imagesInRow.length}.`);
        isValid = false;
        break;
      }
  
      if (imagesInRow.length === 4) {
        fullRowCount++;
      }
    }
  
    if (!isValid) {
      setLoading(false);
      return;
    }
  
    // If any row has 4 images, others must have only 1 or 0
    if (fullRowCount > 0) {
      for (let i = 0; i < 4; i++) {
        const imagesInRow = rowImages[i] || [];
        if (![0, 1, 4].includes(imagesInRow.length)) {
          alert(`Since one row has 4 images, Row ${i + 1} must have either 1 or 4 images.`);
          setLoading(false);
          return;
        }
      }
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
      formDataToSubmit.append(img.index.toString(), img.file);
    });
  
    try {
      const response = await axios.post(`${API_URL}/graphql`, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
         },
      });
  
      const responseData = response.data as {
        data?: { column4addSectionDesign: unknown };
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
    } catch (error: unknown) {
      if(error instanceof Error){
        console.error('Request Error:',error.message);
      }
      else{
        console.error("An unknown error occur")
      }
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
  
    const heading = crouselformData['crouselheading']?.trim();
    const imageLengthStr = crouselformData['imageLength']?.trim();
    const perSlideImage = crouselformData['crouselimagelength']?.trim();
    const imageLength = parseInt(imageLengthStr, 10);
  
    // ✅ Basic Field Validation
    if (!heading || !imageLengthStr || isNaN(imageLength) || !perSlideImage) {
      alert("Please fill in all required fields: Heading, Image Length, and Images Per Slide.");
      setLoading(false);
      return;
    }
  
    // ✅ Validate each image path or file


    const formDataTyped =crouselformData as CrouselFormData
    const missingImages: string[] = [];
    const imagesArray = Array.from({ length: imageLength }, (_, i) => {
      const path = formDataTyped[`path-${i}`]?.trim();
      // const path = (crouselformData as any)[`path-${i}`]?.trim();
      const file = crouselimage.find(img => Number(img.index) === i)?.file;
  
      if (!path && !file) {
        missingImages.push(`Image ${i + 1}`);
      }
  
      return {
        link: path || null,
        file: null, // files are attached in formData, not here
      };
    });
  
    if (missingImages.length > 0) {
      alert(`Please provide a file or link for the following images:\n${missingImages.join(", ")}`);
      setLoading(false);
      return;
    }
  
    // ✅ Build GraphQL Payload
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
        heading,
        imglimit: imageLengthStr,
        perslideimage: perSlideImage,
        rows: [
          {
            columns: [
              {
                images: imagesArray,
              },
            ],
          },
        ],
      },
    };
  
    // ✅ Build FormData with map
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("operations", JSON.stringify(payload));
  
    const fileMap: Record<string, string[]> = {};
    crouselimage.forEach((img: ImageContainer) => {
      fileMap[`${img.index}`] = [`variables.rows.0.columns.0.images.${img.index}.file`];
    });
    formDataToSubmit.append("map", JSON.stringify(fileMap));
  
    crouselimage.forEach((img: ImageContainer) => {
      formDataToSubmit.append(`${img.index}`, img.file);
    });
  
    try {
      const response = await axios.post(`${API_URL}/graphql`, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
         },
      });
  
      const resData = response.data as {
        data?: { carouseladdSectionDesign: CarouselSectionDesign };
        errors?: { message: string }[];
      };
  
      if (resData.errors?.length) {
        const errMsg = resData.errors.map(err => err.message).join("\n");
        alert(`GraphQL Error(s):\n${errMsg}`);
      } else if (!resData.data?.carouseladdSectionDesign) {
        alert("Submission failed. No data returned.");
      } else {
        alert("Data submitted successfully!");
        console.log("GraphQL Response:", resData);
      }
    } catch (error: unknown) {
      
      if(error instanceof Error){
        console.error("Submission Error:", error.message);
      }
      else{
        console.log("Unknown error")
      }
      alert("Network/server error occurred while submitting the form.");
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
  
    const heading = presentationformData['presentationheading']?.trim();
    const imageLengthStr = presentationformData['presentimageLength']?.trim();
    const perSlideImage = presentationformData['presentationimagelength']?.trim();
    const advertisementFile = presentationformData['advertisementdata'];
    const presentimageLength = parseInt(imageLengthStr, 10);
  
    if (!heading || !imageLengthStr || isNaN(presentimageLength) || !perSlideImage || !advertisementFile) {
      alert("Please fill in all required fields: heading, image length, images per slide, and advertisement image.");
      setLoading(false);
      return;
    }
  
    const presentationformdata= presentationformData as PresentationFormData

    const missingFields: string[] = [];
    const imagesArray = Array.from({ length: presentimageLength }, (_, i) => {
      const path = presentationformdata[`path-${i}`]?.trim() || null;
      const imgHeading = presentationformdata[`heading-${i}`]?.trim();
      const title = presentationformdata[`title-${i}`]?.trim();
      // const path = (presentationformData as any)[`path-${i}`]?.trim() || null;
      // const imgHeading = (presentationformData as any)[`heading-${i}`]?.trim();
      // const title = (presentationformData as any)[`title-${i}`]?.trim();
      const file = presentationimage.find(img => Number(img.index) === i)?.file;
  
      if (!path && !file) missingFields.push(`Image ${i + 1}: File or link`);
      if (!imgHeading) missingFields.push(`Image ${i + 1}: Heading`);
      if (!title) missingFields.push(`Image ${i + 1}: Title`);
  
      return {
        link: path,
        file: null, // actual file is uploaded separately
        heading: imgHeading,
        title: title
      };
    });
  
    if (missingFields.length > 0) {
      alert("Please complete the following fields:\n" + missingFields.join("\n"));
      setLoading(false);
      return;
    }
  
    const advLink = advertisementFile;
    // const advLink = URL.createObjectURL(advertisementFile);
  
    const payload = {
      query: `
        mutation AddSection($heading: String, $advertisement: Upload, $advertisementLink: String, $imglimit: String, $perslideimage: String, $rows: [RowInput], $hompagesectioncategoryId: Int) {
          advertisementcarouseladdSectionDesign(
            heading: $heading,
            advertisement: $advertisement,
            advertisement_link: $advertisementLink,
            imglimit: $imglimit,
            perslideimage: $perslideimage,
            rows: $rows,
            hompagesectioncategory_id: $hompagesectioncategoryId
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
        heading,
        hompagesectioncategoryId: 2,
        imglimit: imageLengthStr,
        advertisement: null,
        advertisementLink: advLink,
        perslideimage: perSlideImage,
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
  
    // ✅ Construct FormData and map
    const presentationformDataToSubmit = new FormData();
    const mapObj: Record<string, string[]> = {};
  
    presentationimage.forEach((img: ImageContainer) => {
      mapObj[`${img.index}`] = [`variables.rows.0.columns.0.images.${img.index}.file`];
    });
  
    mapObj[`${presentationimage.length}`] = [`variables.advertisement`];
  
    presentationformDataToSubmit.append("operations", JSON.stringify(payload));
    presentationformDataToSubmit.append("map", JSON.stringify(mapObj));
  
    presentationimage.forEach((img: ImageContainer) => {
      presentationformDataToSubmit.append(`${img.index}`, img.file);
    });
  
    presentationformDataToSubmit.append(`${presentationimage.length}`, advertisementFile);
  
    try {
      const response = await axios.post(`${API_URL}/graphql`, presentationformDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
         }
      });
  
      const resData = response.data as {
        data?: { advertisementcarouseladdSectionDesign: AdvertisementCarouselSection };
        errors?: { message: string }[];
      };
  
      if (resData.errors?.length) {
        const errMsg = resData.errors.map(err => err.message).join("\n");
        alert(`GraphQL Error(s):\n${errMsg}`);
      } else if (!resData.data?.advertisementcarouseladdSectionDesign) {
        alert("Submission failedsle. No data returned.");
      } else {
        alert("Data submitted successfully!");
        console.log("GraphQL Response:", resData);
      }
    } catch (error: unknown) {
      if(error instanceof Error){
        console.error("Submission Error:", error.message);
      }
      else{
        console.log("Unknown Error", error)
      }
      alert("Network/server error occurred while submitting the form.");
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
        <div className="bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-2xl">
        <div className="space-y-6">
        <ComponentCard title="Section Category Section" isDropDownIcon={true} options={options}>
          <form className="space-y-6 mb-6 z-10">
            <Label>Select Category</Label>
            {/* <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 "text-gray-400 dark:text-gray-400"`}
      value={`Hi`}
    >
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        Hii
      </option>
      {options.map((option) => (
        <option
          key="key1"
          value="key1"
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400 flex"
        >
          {option.label}
        </option>
      ))}
    </select> */}
            <Select
              options={selectOptions}
              onChange={handleChange}
              placeholder="Select role"
              classNames={{
                control: ({ isFocused }) =>
                  `w-full rounded-lg border bg-white dark:bg-gray-800  ${isFocused ? 'border-ring-brand-300' : 'border-gray-300'} text-sm text-gray-500 shadow-theme-xs transition-colors focus:outline-none`,
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

          <form onSubmit={()=>{""}} action=" " className='space-y-6 mt-4' style={{ display: selectCategory=== "product wise 4 columns " ? 'block' : 'none' }} >
              <div className='flex flex-col border border-blue-400 p-2 rounded'>
                      <div>
                        <h2>First Col</h2>
                        <Input type="text" placeholder='Enter first col heading'
                         name=""
                         onChange={()=>{}}/>

                          <FileInput
                                  className="custom-class"
                                  name=""
                                  onChange={()=>{}}
                                />
                                 <Input type="text" placeholder='Enter first col subheading'
                         name=""
                         onChange={()=>{}}/>
                      </div>
                 </div>
              <div className="flex justify-center">
                  <Button size="sm" variant="primary">
                    {loading ? 'Submitting...' : 'Submit'}
                  </Button>
              </div>
          </form>

          </div>
                  <ComponentCard title={selectedImage ? "Preview Image" : "Default Image"}>
          <div className='flex'>
            <Image src={selectedImage ? selectedImage : dummy_img} alt="Selected Image" width={500} height={400} className='w-full' />
          </div>
          </ComponentCard>
        </div>
      </div>
    )
  }

  export default Homepagedesign
