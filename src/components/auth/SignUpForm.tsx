
"use client";
import React, { useState, FormEvent } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Link from "next/link";

export default function SignUpForm() {
  const[form, setForm]=useState({
    name:"",
    email:"",
    contact:"",
    businessName:"",
    gstNumber:"",
    password:"",
    address:"",
  })
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  console.log("loading",loading)

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setForm({...form, [e.target.name]:e.target.value});
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!logoFile) return;

    setLoading(true);

    const operations = {
      query: `
        mutation RegisterSeller($input: RegisterSellerInput!) {
          registerSeller(input: $input) {
            id
            name
            email
            contact
            businessName
            gstNumber
            address
            logo
            status
            isVerified
          }
        }
      `,
      variables: {
        input: {
          ...form,
          logo: null,
        },
      },
    };

    const map = {
      "0": ["variables.input.logo"],
    };

    const formData = new FormData();
    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify(map));
    formData.append("0", logoFile);

    try {
      const res = await fetch("https://0737-103-206-131-194.ngrok-free.app/graphql", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Registered Seller:", result);
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-4 max-w-md mx-auto mt-6 border border-gray-300 p-5 rounded-2xl">
    <div className="mb-5 sm:mb-8">
            <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Seller Sign up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
      Please fill in the details below to register as a seller.
            </p>
          </div>
      <form onSubmit={handleSubmit}>
      <div className="space-y-5">
               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                 <div className="sm:col-span-1">
                   <Label>
                     Name<span className="text-error-500">*</span>
                   </Label>
                   <Input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your mail"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Contact<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="contact"
                      placeholder="Enter your contact"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Business Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="businessName"
                      placeholder="Enter your Business Namer"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      G.S.T. Number<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="gstNumber"
                      placeholder="Enter your GST Number"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Password<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your Password"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>
                    Address<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your Address"
                      type="text"
                      name="address"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label>
                    Upload Logo<span className="text-error-500">*</span>
                  </Label>
                   <Input
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <p className="inline-block font-sm text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                    <Link href="/adminlogin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 ml-2 text-sm underline">
                Sign In
                </Link>
                  </p>
                  
                </div>
                
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Register Seller
                  </button>
                </div>
              </div>
    </form>
  </div>
  );
}
