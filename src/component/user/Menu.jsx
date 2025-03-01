import React from "react";
import { GoHome } from "react-icons/go";
import { HiOutlineUpload } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate()

  return (
    <div className="absolute top-0 left-[-55px] grid grid-rows-2 gap-10">
      {/* Tombol Beranda */}
      <button
      onClick={() => navigate("/beranda")}
        className={`duration-300 ${
          location.pathname === "/beranda" ? "text-[#007D09]" : "text-white hover:text-[#007D09]"
        }`}
      >
        <GoHome size={30} />
      </button>

      {/* Tombol Prediksi */}
      <button
      onClick={() => navigate("/prediksi")}
        className={`duration-300 ${
          location.pathname === "/prediksi" ? "text-[#007D09]" : "text-white hover:text-[#007D09]"
        }`}
      >
        <HiOutlineUpload size={30} />
      </button>
    </div>
  );
};

export default Menu;
