import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import { BiSolidWebcam } from "react-icons/bi";
const NavbarUser = () => {
  return (
    <div className="flex justify-between items-center py-2 sm:py-4 w-full px-2  sm:px-5">
      <Link
        to={"/"}
        className="uppercase flex items-center gap-5 font-bold text-md sm:text-lg text-white"
      >
        {/* <img src={logo} alt="" className="w-20"/> */}
        <BiSolidWebcam size={40} color="#007D09"/>
        <p className="dark:text-white text-gray-700 text-[12px] md:text-[20px]">
          Sistem Klasifikasi Biji Pala
        </p>
      </Link>
    </div>
  );
};

export default NavbarUser;
