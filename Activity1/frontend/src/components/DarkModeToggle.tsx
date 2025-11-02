// import React, { useState, useEffect } from "react";
// import { Sun, Moon } from "lucide-react";

// const DarkModeToggle = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [darkMode]);

//   return (
//     <button
//       onClick={() => setDarkMode(!darkMode)}
//       className={`relative w-16 h-8 rounded-full transition-colors duration-300 flex items-center ${
//         darkMode ? "bg-[#1E293B]" : "bg-yellow-400"
//       }`}
//       style={{ boxShadow: darkMode ? "0 0 4px #1E293B" : "0 0 6px #FACC15" }}
//     >
//       <span
//         className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ${
//           darkMode ? "translate-x-8" : "translate-x-0"
//         }`}
//       >
//         {darkMode ? (
//           <Moon size={16} color="#3B82F6" />
//         ) : (
//           <Sun size={16} color="#CA8A04" />
//         )}
//       </span>
//     </button>
//   );
// };

// export default DarkModeToggle;
import React from "react";
import { SunIcon, MoonIcon } from "lucide-react";

interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, setDarkMode }) => {
  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center transition-all duration-300"
    >
      <div
        className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md transform transition-all duration-300 ${
          darkMode ? "translate-x-8" : ""
        }`}
      />
      <div className="absolute left-2 text-yellow-500">
        <SunIcon size={16} />
      </div>
      <div className="absolute right-2 text-blue-400">
        <MoonIcon size={16} />
      </div>
    </button>
  );
};

export default DarkModeToggle;
