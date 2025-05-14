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

interface sectioncategoryprops{
  showHeaderFooterAction:()=> void;
}

const HeaderFooterSetting = ({ showHeaderFooterAction }: sectioncategoryprops) => {
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
  
    try {
      const operations = {
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
            headerlogo: null, // will be injected via multipart
            footerlogo: null, // will be injected via multipart
          },
        },
      };
  
      const map = {
        "0": ["variables.input.headerlogo"],
        "1": ["variables.input.footerlogo"],
      };
  
      const formData = new FormData();
      formData.append("operations", JSON.stringify(operations));
      formData.append("map", JSON.stringify(map));
      formData.append("0", headerLogo);
      formData.append("1", footerLogo);
  
      const response = await fetch("https://0a35-103-206-131-194.ngrok-free.app/graphql", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      const res = result?.data?.addHomePageSetting;
  
      if (res?.resStatus === "SUCCESS") {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(res?.resMessage || "Failed to save settings.");
      }
  
    } catch (error) {
      console.error("❌ Submission Error:", error);
      toast.error("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  
  type DropdownOption = {
    label: string;
    action: () => void;
  };

  const options: DropdownOption[] = [
    {
      label: "Header/Footer Setting",
      action: () => {
        console.log("view Header footer page");
        showHeaderFooterAction();
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
      <PageBreadcrumb pageTitle="Home Page Settings" />
      <div className="grid grid-cols-1 gap-6">
        <ComponentCard title="Header/Footer Setting" isDropDownIcon={true} options={options}>
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
