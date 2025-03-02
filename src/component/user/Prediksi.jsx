import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import axios from "axios";
import HasilPrediksiModal from "../modals/HasilPrediksiModal";
import { AnimatePresence } from "framer-motion";

const Prediksi = () => {
  const [selectedFilters, setSelectedFilters] = useState(["Semua"]);
  const [allowedPredictions, setAllowedPredictions] = useState([
    "pala",
    "pala_fuli",
    "pala_busuk",
  ]);
  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const filterMap = {
    Pala: "pala",
    "Pala Busuk": "pala_busuk",
    "Pala Fuli": "pala_fuli",
  };

  const allFilters = Object.keys(filterMap);

  const updateAllowedPredictions = (filters) => {
    if (filters.includes("Semua")) {
      setAllowedPredictions(Object.values(filterMap));
    } else {
      setAllowedPredictions(filters.map((filter) => filterMap[filter]));
    }
  };

  const handleFilterClick = (filter) => {
    let updatedFilters = [...selectedFilters];

    if (filter === "Semua") {
      updatedFilters = ["Semua"];
    } else {
      if (updatedFilters.includes("Semua")) {
        updatedFilters = [];
      }

      if (updatedFilters.includes(filter)) {
        updatedFilters = updatedFilters.filter((item) => item !== filter);
      } else {
        updatedFilters.push(filter);
      }

      if (updatedFilters.length === allFilters.length) {
        updatedFilters = ["Semua"];
      }

      if (updatedFilters.length === 0) {
        updatedFilters = ["Semua"];
      }
    }

    setSelectedFilters(updatedFilters);
    updateAllowedPredictions(updatedFilters);
  };

  const handleImageUpload = async (file) => {
    setPreview(URL.createObjectURL(file));
    setResultImage(null);
    setOpenModal(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/pala-deteksi",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data) {
        setResultImage(response.data || null);
      } else {
        console.error(
          "Response tidak memiliki data yang sesuai:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error mengunggah gambar:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handlePaste = (e) => {
    const clipboardItems = e.clipboardData.items;
    for (const item of clipboardItems) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleImageUpload(file);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className="px-1 md:px-10 w-full">
        <AnimatePresence>

      {openModal && (
          <HasilPrediksiModal
          setOpenModal={setOpenModal}
          resultImage={resultImage}
          preview={preview}
          Predictions={allowedPredictions}
          />
        )}
        </AnimatePresence>

      <div className="px-4 md:px-10 py-2 md:py-10">
        <div className="grid grid-cols-4 mb-3">
           <div className="col-span-2 grid grid-cols-4 gap-3">
            {/* Tombol Semua */}
            <button
              className={`rounded-full dark:text-gray-300 drop-shadow-lg duration-300 px-3 py-2 ${
                selectedFilters.includes("Semua")
                  ? "bg-[#007D09] dark:text-gray-300 text-white"
                  : "dark:bg-[#202329] bg-white dark:hover:bg-[#007D09] hover:text-white hover:bg-[#007D09] dark:hover:text-gray-300"
              }`}
              onClick={() => handleFilterClick("Semua")}
            >
              Semua
            </button>

            {/* Tombol Pala, Pala Busuk, Pala Fuli */}
            {allFilters.map((filter) => (
              <button
                key={filter}
                className={`rounded-full drop-shadow-lg dark:text-gray-300 duration-300 px-3 py-2 ${
                  selectedFilters.includes(filter)
                    ? "bg-[#007D09] dark:text-gray-300 text-white"
                    : "dark:bg-[#202329] bg-white dark:hover:bg-[#007D09] hover:text-white hover:bg-[#007D09] dark:hover:text-gray-300"
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="relative grid w-full">
          <Menu />
          <div className="bg-white border border-gray-300 dark:border-none dark:bg-[#202329] rounded-md px-3 py-4 font-bold text-lg md:text-xl">
            <div className="flex items-center gap-3 mb-5">
              <h1 className="text-gray-700 dark:text-gray-300 md:text-left">
                Unggah Gambar Biji Pala
              </h1>
            </div>

            <div
              className={`bg-gray-100 dark:bg-[#0d0e0f] dark:bg-opacity-20 border rounded-md w-full px-6 h-[70vh] flex flex-col justify-center items-center gap-4 text-gray-700 dark:text-gray-300 border-dashed transition-all duration-300 ${
                isDragging
                  ? "border-[#007D09] bg-[#3a3a3a]"
                  : "dark:border-gray-500 border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="text-lg font-semibold">
                {isDragging
                  ? "Lepaskan Gambar untuk Mengunggah"
                  : "Tarik Gambar Ke Sini, Tempel Gambar"}
              </p>

              <p className="text-gray-600 dark:text-gray-400">atau</p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="upload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="upload"
                className="rounded-md bg-[#007D09] px-3 py-2 hover:bg-[#2d9934] text-gray-100 duration-300 cursor-pointer"
              >
                Pilih Gambar
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediksi;
