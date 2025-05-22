// "use client"

// import { MoreDotIcon } from "@/icons";
// import React, { useState } from "react";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";

// interface Option {
//   value: string | number;
//   action: () => void;
// }

// interface ComponentCardProps {
//   title: string;
//   children: React.ReactNode;
//   className?: string; // Additional custom classes for styling
//   desc?: string; // Description text
//   isDropDownIcon?: boolean,
//   options?: any;
// }

// const ComponentCard: React.FC<ComponentCardProps> = ({
//   title,
//   children,
//   className = "",
//   desc = "",
//   isDropDownIcon = false,
//   options
// }) => {

//   const [isOpen, setIsOpen] = useState(false);
  
//     function toggleDropdown() {
//       setIsOpen(!isOpen);
//     }
  
//     function closeDropdown() {
//       setIsOpen(false);
//     }

//   return (
//     <div
//       className={`rounded-2xl overflow-hidden border border-blue-400 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
//     >
//       {/* Card Header */}
//       <div className="px-6 py-5 bg-[#ecf3ff] dark:bg-white/[0.03]">
//   <div className="flex items-center justify-between">
//     <h3 className="text-base font-medium text-[#465fff] dark:text-white/90">
//       {title}
//     </h3>
//     {isDropDownIcon && <div className="relative inline-block">
//             <button onClick={toggleDropdown} className="dropdown-toggle">
//               <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
//             </button>
//             <Dropdown
//               isOpen={isOpen}
//               onClose={closeDropdown}
//               className="w-44 p-2"
//             >
//               {options.map((item: any, index: number) => (
//               <DropdownItem
//                 key={index} // 🔑 Unique key added
//                 tag="a"
//                 onItemClick={item.action}
//                 className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//               >
//                 {item.label}
//               </DropdownItem>
//             ))}
//             </Dropdown>
//           </div>}
//   </div>
  
//   {desc && (
//     <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//       {desc}
//     </p>
//   )}
// </div>


//       {/* Card Body */}
//       <div className="border-t border-gray-100 dark:border-gray-800 p-4">
//         <div className="space-y-6">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default ComponentCard;



"use client";

import { MoreDotIcon } from "@/icons";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Define the structure of each option
interface DropdownOption {
  label: string;
  action: () => void;
}

// Define the props for the ComponentCard component
interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  isDropDownIcon?: boolean;
  options?: DropdownOption[]; // Use the DropdownOption type here
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  isDropDownIcon = false,
  options = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div
      className={`rounded-2xl border border-blue-400 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-5 bg-[#ecf3ff] dark:bg-white/[0.03] rounded-t-[16px]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-[#465fff] dark:text-white/90">
            {title}
          </h3>
          {isDropDownIcon && (
            <div className="relative inline-block">
              <button onClick={toggleDropdown} className="dropdown-toggle">
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
              <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-44 p-2">
                {options.map((item, index) => (
                  <DropdownItem
                    key={index}
                    tag="a"
                    onItemClick={item.action}
                    className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    {item.label}
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          )}
        </div>

        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        )}
      </div>

      {/* Card Body */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
