"use client";
import HomePageCategory from "@/components/category/HomePageCategory";
import HomePageSectionCategory from "@/components/category/Homepagedesign";
import { useState } from "react";

export default function SignUp() {
  const [showList, setShowList] = useState<boolean>(false);

  const showHomeListAction = () => {
    setShowList((prev) => {
      console.log("Toggling showList from", prev, "to", !prev);
      return !prev;
    });
  };
  return (
    <div>
      {showList ? (
        <HomePageCategory showHomeListAction={showHomeListAction} />
      ) : (
        <>
        <HomePageSectionCategory showHomeListAction={showHomeListAction} />
        </>
      )}
    </div>
  );
}
