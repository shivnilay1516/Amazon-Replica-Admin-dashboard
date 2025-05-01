"use client"
import React, { FormEvent, useState } from 'react'
import PageBreadcrumb from '../common/PageBreadCrumb'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import FileInput from '../form/input/FileInput'
import Button from '../ui/button/Button'
import { toast } from 'react-toastify'
import axiosInstance from '@/lib/config/axiosInstance'
import Image from 'next/image'
import categoryImg from "@/assets/category.jpeg";


interface sectioncategoryprops{
  showListAction:()=> void;
}

const Sectioncategory = ({ showListAction }: sectioncategoryprops) => {
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file", file);
    
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!categoryName || !image) {
      toast.info("Please fill in all fields and upload an image.");
      return;
    }

    setLoading(true);

    const operations = {
      query: `
        mutation AddHomeSectionCategory($input: HomePageSectionCategoryInput!) {
          addHomeSectionCategory(input: $input) {
            id
            categoryname
          }
        }
      `,
      variables: {
        input: {
          categoryname: categoryName,
          categoryimage: null, // Important: set null in variables
        },
      },
    };

    const map = {
      "0": ["variables.input.categoryimage"],
    };

    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify(map));
    formData.append("0", image);

    try {
      const response = await axiosInstance.post("/graphql", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
      label: "View More",
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
      <PageBreadcrumb pageTitle="Section Category" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
        <ComponentCard title="Section Category Section" isDropDownIcon={true} options={options}>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
          <Label>Category Name</Label>
          <Input 
            type="text"
            defaultValue={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            />
        </div>
        <div>
        <Label>Category Image</Label>
        <FileInput
         className="custom-class"
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
        <div className="space-y-6">
        <ComponentCard title={previewUrl ? "Preview Image" : "Default Image"}>
        <Image
          width={500}
          height={800}
          src={previewUrl || categoryImg}
          alt="Selected Preview"
        />
        </ComponentCard>
        </div>
      </div>
    </div>
  )
}

export default Sectioncategory