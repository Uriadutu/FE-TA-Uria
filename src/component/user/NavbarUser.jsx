import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/logo.png";
import logov2 from "../../img/logo1v3.png";
const NavbarUser = () => {
  return (
    <div className="flex justify-between items-center py-2 sm:py-4 w-full px-2  sm:px-5">
      <Link
        to={"/"}
        className="uppercase flex  items-center gap-5 font-bold text-md sm:text-lg text-white"
      >
        <img
          src={logo}
          alt=""
          className="w-8 block dark:hidden drop-shadow-[0_0_1px_black] dark:drop-shadow-[0_0_1px_white]"
        />
        <img
          src={logov2}
          alt=""
          className="w-8 hidden dark:block drop-shadow-[0_0_1px_black] dark:drop-shadow-[0_0_1px_white]"
        />
        <p className="dark:text-white text-gray-700 text-[12px] md:text-[20px] font-bold">
          Gosora
        </p>
      </Link>
    </div>
  );
};

export default NavbarUser;
