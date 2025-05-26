// "use client"
// import React, { FormEvent, useState } from 'react'
// import PageBreadcrumb from '../common/PageBreadcrumb'
// import ComponentCard from '../common/ComponentCard'
// import Label from '../form/Label'
// import Input from '../form/input/InputField'
// import FileInput from '../form/input/FileInput'
// import Button from '../ui/button/Button'
// import { toast } from 'react-toastify'
// import axiosInstance from '@/lib/config/axiosInstance'
// import Image from 'next/image'
// import categoryImg from "@/assets/category.jpeg";


// interface sectioncategoryprops{
//   showListAction:()=> void;
// }

// const Banner = ({ showListAction }: sectioncategoryprops) => {
//   const [bannerLink, setBannerLink] = useState("");
//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImage(file);
//       const objectUrl = URL.createObjectURL(file);
//       console.log("objectUrl", objectUrl);
      
//       setPreviewUrl(objectUrl);
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!bannerLink || !image) {
//       toast.info("Please fill in all fields and upload an image.");
//       return;
//     }

//     setLoading(true);

//     const operations = {
//       query: `
//         mutation AddBanner($input: BannerInput) {
//   addBanner(input: $input) {
//             id
//             bannerlink
//           }
//         }
//       `,
//       variables: {
//         input: {
//             bannerlink: bannerLink,
//             bannerimage: null, 
//         },
//       },
//     };

//     const map = {
//       "0": ["variables.input.bannerimage"],
//     };

//     const formData = new FormData();
//     formData.append("operations", JSON.stringify(operations));
//     formData.append("map", JSON.stringify(map));
//     formData.append("0", image);

//     try {
//       const response = await axiosInstance.post("/graphql", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const result = response.data;
//       toast.success("Category added successfully! ✅");
//       console.log(result);
//     } catch (error: unknown) {
//       console.error(error);
//       toast.error("Failed to submit category.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   type DropdownOption = {
//     label: string;
//     action: () => void;
//   };

//   const options: DropdownOption[] = [
//     {
//       label: "View Banner",
//       action: () => {
//         console.log("view more home page");
//         showListAction();
//       },
//     },
//     {
//       label: "Refresh",
//       action: () => {
//         console.log("Refresh clicked");
//       },
//     },
//   ];

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Banner" />
//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
//         <div className="space-y-6">
//         <ComponentCard title="Banner Section" isDropDownIcon={true} options={options}>
//       <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//           <Label>Category Name</Label>
//           <Input 
//             type="text"
//             defaultValue={bannerLink}
//             onChange={(e) => setBannerLink(e.target.value)}
//             />
//         </div>
//         <div>
//         <Label>Category Image</Label>
//         <FileInput
//          className="custom-class"
//          name=""
//          onChange={handleImageChange}
//           />
//       </div>
//         <div className="flex justify-center">
//         <Button size="sm" variant="primary">
//         {loading ? 'Submitting...' : 'Submit'}
//         </Button>
//       </div>
//       </form>
//     </ComponentCard>
//         </div>
//         <div className="space-y-6 h-[">
//         <ComponentCard title={previewUrl ? "Preview Image" : "Default Image"}>
//         <Image
//           width={600}
//           height={300}
//           src={previewUrl || categoryImg}
//           alt="Selected Preview"
//           className='w-full'
//         />
//         </ComponentCard>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Banner


"use client"
import React, { FormEvent, useState } from 'react'
import PageBreadcrumb from '../common/PageBreadcrumb'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import FileInput from '../form/input/FileInput'
import Button from '../ui/button/Button'
import { toast } from 'react-toastify'
import axiosInstance from '@/lib/config/axiosInstance'
import Image from 'next/image'
import categoryImg from "@/assets/carousel.png";
import Cookies from 'js-cookie';
 
 
interface sectioncategoryprops {
  showListAction: () => void;
}
 
const Banner = ({ showListAction }: sectioncategoryprops) => {
  const [bannerLink, setBannerLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const token = Cookies.get('token');
 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      console.log("objectUrl", objectUrl);
 
      setPreviewUrl(objectUrl);
    }
  };
 
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
 
    if (!bannerLink || !image) {
      toast.info("Please fill in all fields and upload an image.");
      return;
    }
 
    setLoading(true);
 
    const operations = {
      query: `
        mutation AddBanner($input: BannerInput) {
  addBanner(input: $input) {
            id
            bannerlink
          }
        }
      `,
      variables: {
        input: {
          bannerlink: bannerLink,
          bannerimage: null,
        },
      },
    };
 
    const map = {
      "0": ["variables.input.bannerimage"],
    };
 
    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify(map));
    formData.append("0", image);
 
    try {
      const response = await axiosInstance.post("/graphql", formData, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
         },
      });
 
      const result = response.data;
      toast.success("Category added successfully! ✅");
      console.log(result);
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to submit category.");
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
      label: "View Banner",
      action: () => {
        console.log("view more home page");
        showListAction();
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
      <PageBreadcrumb pageTitle="Banner" />
     <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
  {/* Left Section */}
  <div className="space-y-6 h-[400px] overflow-auto">
    <ComponentCard title="Banner Section" isDropDownIcon={true} options={options} className="h-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Category Name</Label>
          <Input
            type="text"
            defaultValue={bannerLink}
            onChange={(e) => setBannerLink(e.target.value)}
          />
        </div>
        <div>
          <Label>Category Image</Label>
          <FileInput
            className="custom-class"
            name=""
            onChange={handleImageChange}
          />
        </div>
        <div className="flex justify-center">
          <Button size="sm" variant="primary">
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </ComponentCard>
  </div>
 
  {/* Right Section */}
  <div className="space-y-6 h-[400px] overflow-hidden">
    <ComponentCard title={previewUrl ? "Preview Image" : "Default Image"} className="h-full">
      <div className="h-full w-full flex items-center justify-center overflow-hidden">
        <Image
          width={600}
          height={300}
          src={previewUrl || categoryImg}
          alt="Selected Preview"
          className="max-h-[450px] max-w-full object-contain"
        />
      </div>
    </ComponentCard>
  </div>
</div>
 
    </div>
  )
}
 
export default Banner
 