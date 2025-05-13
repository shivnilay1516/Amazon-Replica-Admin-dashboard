"use client";
import React, { FormEvent, useState } from "react";
import PageBreadcrumb from "../common/PageBreadcrumb";
import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";
import Select from "../form/Select";


const HeaderFooterSetting = () => {
  const [headerbgcolor, setHeaderBgColor] = useState("#ffffff");
  const [headercolor, setHeaderColor] = useState("#000000");
  const [footertopbgcolor, setFooterTopBgColor] = useState("#ffffff");
  const [footertopcolor, setFooterTopColor] = useState("#000000");
  const [footerbgcolor, setFooterBgColor] = useState("#ffffff");
  const [footercolor, setFooterColor] = useState("#ffffff");
  const [footerstatus, setFooterStatus] = useState("Active");
  const [footertopstatus, setFooterTopStatus] = useState("Active");
  const [resStatus, setResStatus] = useState("#000000");
  const [resMessage, setResMessage] = useState("#000000");
  const [headerLogo, setHeaderLogo] = useState<File | null>(null);
  const [footerLogo, setFooterLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!headerLogo || !footerLogo) {
      toast.info("Please upload both logos.");
      return;
    }
  
    setLoading(true);
  
    const createOperations = {
      query: `
        mutation AddHomePageSetting($input: HomePageSettingInput!) {
          addHomePageSetting(input: $input) {
            id
            headerbgcolor
            headercolor
            footertopbgcolor
            footertopcolor
            footertopstatus
            footerbgcolor
            footercolor
            footerstatus
            headerlogo
            footerlogo
            resStatus
            resMessage
          }
        }
      `,
      variables: {
        input: {
          headerbgcolor,
          headercolor,
          footertopbgcolor,
          footertopcolor,
          footertopstatus,
          footerbgcolor: footerbgcolor ?? "#ffffff",
          footercolor,
          footerstatus,
          headerlogo: null,
          footerlogo: null,
        },
      },
    };
  
    const map = {
      "0": ["variables.input.headerlogo"],
      "1": ["variables.input.footerlogo"],
    };
  
    const formData = new FormData();
    formData.append("operations", JSON.stringify(createOperations));
    formData.append("map", JSON.stringify(map));
    formData.append("0", headerLogo);
    formData.append("1", footerLogo);
  
    try {
      const response = await fetch("https://0a35-103-206-131-194.ngrok-free.app/graphql", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      const res = result?.data?.addHomePageSetting;
  
      if (res?.resMessage === "Settings already exist" && res?.id) {
        await handleUpdate(res.id); // Run update logic
      } else {
        toast.success("Home page settings saved! ✅");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    const updateOperations = {
      query: `
        mutation UpdateHomePageSetting(
          $updateHomePageSettingId: ID!,
          $headerbgcolor: String,
          $headercolor: String,
          $footertopbgcolor: String,
          $footertopcolor: String,
          $footertopstatus: String,
          $footercolor: String,
          $footerstatus: String,
          $headerlogo: Upload,
          $footerlogo: Upload
        ) {
          updateHomePageSetting(
            id: $updateHomePageSettingId,
            headerbgcolor: $headerbgcolor,
            headercolor: $headercolor,
            footertopbgcolor: $footertopbgcolor,
            footertopcolor: $footertopcolor,
            footertopstatus: $footertopstatus,
            footercolor: $footercolor,
            footerstatus: $footerstatus,
            headerlogo: $headerlogo,
            footerlogo: $footerlogo
          ) {
            id
            resMessage
          }
        }
      `,
      variables: {
        updateHomePageSettingId: id,
        headerbgcolor,
        headercolor,
        footertopbgcolor,
        footertopcolor,
        footertopstatus,
        footercolor,
        footerstatus,
        headerlogo: null,
        footerlogo: null,
      },
    };
  
    const updateMap = {
      "0": ["variables.headerlogo"],
      "1": ["variables.footerlogo"],
    };
  
    const updateFormData = new FormData();
    updateFormData.append("operations", JSON.stringify(updateOperations));
    updateFormData.append("map", JSON.stringify(updateMap));
    updateFormData.append("0", headerLogo!);
    updateFormData.append("1", footerLogo!);
  
    try {
      const response = await fetch("https://0a35-103-206-131-194.ngrok-free.app/graphql", {
        method: "POST",
        body: updateFormData,
      });
      const result = await response.json();
      const updated = result?.data?.updateHomePageSetting;
  
      if (updated?.resMessage) {
        toast.success(updated.resMessage);
      } else {
        toast.success("Home page settings updated! ✅");
      }
    } catch (error) {
      console.error("❌ Update Error:", error);
      toast.error("Update failed");
    }
  };
  
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  
  // type DropdownOption = {
  //   label: string;
  //   action: () => void;
  // };

  // const options: DropdownOption[] = [
  //   {
  //     label: "Setting Page",
  //     action: () => {
  //       console.log("view more home page");
  //       showListAction();
  //     },
  //   },
  //   {
  //     label: "Refresh",
  //     action: () => {
  //       console.log("Refresh clicked");
  //     },
  //   },
  // ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Home Page Settings" />
      <div className="grid grid-cols-1 gap-6">
        <ComponentCard title="Home Page Setting">
        {/* <div className="space-y-6"> */}
        {/* <ComponentCard title="Header/Footer Setting" isDropDownIcon={true} options={options}> */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap justify-between">
              {/* Header and Footer Color Pickers */}
              <InputGroup label="Header Background Color" value={headerbgcolor} onChange={setHeaderBgColor} />
              <InputGroup label="Header Text Color" value={headercolor} onChange={setHeaderColor} />
              <InputGroup label="Footer Top Background Color" value={footertopbgcolor} onChange={setFooterTopBgColor} />
              <InputGroup label="Footer Top Text Color" value={footertopcolor} onChange={setFooterTopColor} />
              <InputGroup label="Footer Background Color" value={footerbgcolor} onChange={setFooterBgColor} />
              <InputGroup label="Footer  Color" value={footercolor} onChange={setFooterColor} />
              <InputGroup label="Response Status Color" value={resStatus} onChange={setResStatus} />
              <InputGroup label="Response Message Color" value={resMessage} onChange={setResMessage} />

              {/* Logo Uploads */}
              <FileGroup label="Header Logo" onChange={setHeaderLogo} />
              <FileGroup label="Footer Logo" onChange={setFooterLogo} />

              {/* Status Selects */}
              <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
                <Label>Footer Status</Label>
                <Select options={statusOptions} value={footerstatus} onChange={(value) => setFooterStatus(value)} />
              </div>
              <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
                <Label>Footer Top Status</Label>
                <Select options={statusOptions} value={footertopstatus} onChange={(value) => setFooterTopStatus(value)} />
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button size="sm" variant="primary">
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
    <Label>{label}</Label>
    <Input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const FileGroup = ({ label, onChange }: { label: string; onChange: (file: File) => void }) => (
  <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
    <Label>{label}</Label>
    <FileInput
      className="custom-class" name=""
      onChange={(e) => e.target.files && onChange(e.target.files[0])}
    />
  </div>
);

export default HeaderFooterSetting;
