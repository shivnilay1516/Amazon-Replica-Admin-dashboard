"use client";
import Banner from "@/components/category/Banner";
import ShowBanner from "@/components/category/ShowBanner";
import { useState } from "react";

export default function SignUp() {
  const [showList, setShowList] = useState<boolean>(false);

  const showBannerListAction = () => {
    setShowList((prev) => {
      // console.log("Toggling showList from", prev, "to", !prev);
      return !prev;
    });
  };
  return (
    <div>
      {showList ? (
        <ShowBanner showListAction={showBannerListAction} />
      ) : (
        <>
        <Banner showListAction={showBannerListAction} />
        </>
      )}
    </div>
  );
}
