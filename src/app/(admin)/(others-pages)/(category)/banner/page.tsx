"use client";
import Banner from "@/components/category/Banner";
import ShowPageSectionCategoryList from "@/components/category/ShowPageSectionCategoryList";
import { useState } from "react";

export default function SignUp() {
  const [showList, setShowList] = useState<boolean>(false);

  const showListAction = () => {
    setShowList((prev) => {
      console.log("Toggling showList from", prev, "to", !prev);
      return !prev;
    });
  };
  return (
    <div>
      {showList ? (
        <ShowPageSectionCategoryList showListAction={showListAction} />
      ) : (
        <>
        <Banner showListAction={showListAction} />
        </>
      )}
    </div>
  );
}
