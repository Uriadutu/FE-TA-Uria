import React, { useEffect, useState } from "react";
import { BiSolidWebcam } from "react-icons/bi";
import { GoHome } from "react-icons/go";
import { HiOutlineUpload } from "react-icons/hi";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ambil dari localStorage agar tetap tersimpan setelah refresh
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    // Simpan mode ke localStorage
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="absolute h-full top-0 left-[-55px] flex flex-col justify-between">
      {/* Bagian Atas: Tombol Navigasi */}
      <div className="grid grid-rows-2 gap-10">
        <button
          onClick={() => navigate("/beranda")}
          className={`${
            location.pathname === "/beranda"
              ? "text-[#007D09]"
              : "dark:text-white text-gray-500 hover:text-[#007D09]"
          }`}
        >
          <BiSolidWebcam size={30} />
        </button>

        {/* Tombol Prediksi */}
        <button
          onClick={() => navigate("/prediksi")}
          className={`${
            location.pathname === "/prediksi"
              ? "text-[#007D09]"
              : "dark:text-white text-gray-500 hover:text-[#007D09]"}`
          }
        >
          <HiOutlineUpload size={30} />
        </button>
      </div>

      {/* Bagian Bawah: Tombol Dark Mode */}
      <div className="flex justify-center items-center pb-4">
        <button
          onClick={toggleDarkMode}
          className="flex bg-white dark:bg-gray-800 drop-shadow-md rounded-full p-2 transition-all  ease-in-out"
        >
          {darkMode ? (
            <MdDarkMode size={25} className="text-white" />
          ) : (
            <MdOutlineDarkMode size={25} className="text-black" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Menu;
