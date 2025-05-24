import React from "react";
import sp from "../../img/gerak.gif";
import { Link } from "react-router-dom";

const Splash = () => {
  return (
    <div className="flex bg-gradient-to-b from-black via-black via-80% to-[#103300] to-95% min-h-screen w-full px-6 md:px-16 lg:px-32 xl:px-52 items-center justify-center">
      <div className="flex flex-col md:grid md:grid-cols-3 gap-10 items-center text-center md:text-left">
        {/* Bagian Teks */}
        <div className="md:col-span-2 order-1 md:order-none w-[80%]">
          <h1 className="text-2xl md:text-3xl lg:text-5xl text-white mb-5 mt-10">
            Sistem Klasifikasi Biji Buah Pala
          </h1>
          <p className="text-white text-sm md:text-base lg:text-lg mb-10">
            Sistem Klasifikasi Biji Pala Berbasis IoT. <br />
            Deteksi Otomatis Pala Busuk, Pala Tanpa Fuli, <br />
            dan Pala Fuli untuk Kualitas Terbaik!
          </p>
        </div>

        {/* Bagian Gambar */}
        <div className="flex justify-center items-center order-2 md:order-none">
          <img src={sp} className="w-48 md:w-64 lg:w-[600px]" alt="Logo" />
        </div>

        {/* Bagian Tombol */}
        <div className="order-3 md:col-span-3 flex justify-start">
          <Link
            to={"/beranda"}
            className="mb-10 bg-[#5D5D5D] bg-opacity-30 text-white py-2 px-10 md:px-20 border border-white rounded-[2px] hover:bg-gray-100 hover:text-gray-700 transition duration-300 inline-block"
          >
            Mulai
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Splash;
