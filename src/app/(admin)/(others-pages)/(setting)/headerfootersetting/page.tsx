// // import SignUpForm from "@/components/auth/SignUpForm";
// import HomePageSetting from "@/components/setting/headerfootersetting";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
//   // other metadata
// };

// export default function SignUp() {
//   return <HomePageSetting />;
// }


"use client";

import HeaderFooterSetting from "@/components/setting/headerfootersetting";
import { useState } from "react";
import Showheaderfootersetting from "../../../../../components/setting/showheaderfootersetting";

export default function SignUp() {
  const [showList, setShowList] = useState<boolean>(false);

  const showHeaderFooter = () => {
    setShowList((prev) => {
      console.log("Toggling showList from", prev, "to", !prev);
      return !prev;
    });
  };

  return (
    <div>
      {showList ? (
        <Showheaderfootersetting showHeaderFooterAction={showHeaderFooter} />
      ) : (
        <>
        <HeaderFooterSetting showHeaderFooterAction={showHeaderFooter} />
        </>
      )}
    </div>
  );
}
