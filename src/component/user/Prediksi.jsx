import React, { useState } from "react";
import Menu from "./Menu";
import axios from "axios";
import HasilPrediksiModal from "../modals/HasilPrediksiModal";

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

  return (
    <div className="px-1 md:px-10 w-full">
      {openModal && (
        <HasilPrediksiModal
          setOpenModal={setOpenModal}
          resultImage={resultImage}
          preview={preview}
          Predictions={allowedPredictions}
        />
      )}

      <div className="px-4 md:px-10 py-2 md:py-10">
        <div className="grid grid-cols-4 mb-3">
          <div className="col-span-2 grid grid-cols-4 gap-3">
            <button
              className={`rounded-full drop-shadow-lg text-gray-300 duration-300 px-3 py-2 ${
                selectedFilters.includes("Semua")
                  ? "bg-[#007D09]"
                  : "bg-[#202329] hover:bg-[#007D09]"
              }`}
              onClick={() => handleFilterClick("Semua")}
            >
              Semua
            </button>
            {allFilters.map((filter) => (
              <button
                key={filter}
                className={`rounded-full drop-shadow-lg text-gray-300 duration-300 px-3 py-2 ${
                  selectedFilters.includes(filter)
                    ? "bg-[#007D09]"
                    : "bg-[#202329] hover:bg-[#007D09]"
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
          <div className="bg-[#202329] rounded-md px-3 drop-shadow-md py-4 font-bold text-lg md:text-xl">
            <div className="flex items-center gap-3 mb-5">
              <h1 className="text-center font-bold text-[#D2D5DB] md:text-left">
                Unggah Gambar Biji Pala
              </h1>
            </div>

            <div className="bg-[#343434] rounded-md w-full px-6 h-[50vh] gap-y-4 flex flex-col justify-center items-center text-gray-300">
              <div
                className={`w-full rounded-xl py-32 text-center bg-gray-400 bg-opacity-10 text-gray-300 border-[4px] border-dashed transition-all duration-300 ${
                  isDragging
                    ? "border-[#007D09] bg-[#3a3a3a]"
                    : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <p className="text-lg">
                  {isDragging
                    ? "Lepaskan Gambar untuk Mengunggah"
                    : "Tarik Gambar Ke Sini"}
                </p>
              </div>
              <p>atau</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="upload"
                onChange={handleImageChange}
              />
              <label
                htmlFor="upload"
                className="rounded-md bg-[#007D09] px-3 py-2 hover:bg-[#2d9934] duration-300 cursor-pointer"
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
