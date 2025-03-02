import React, { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import { FiCameraOff } from "react-icons/fi";

const Home = () => {
  const [selectedFilters, setSelectedFilters] = useState(["Semua"]); // Default "Semua" aktif
  const allFilters = ["Pala", "Pala Busuk", "Pala Fuli"];
  const [confidence, setConfidence] = useState(80);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isDragging.current) return;
      const slider = sliderRef.current;
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      let newConfidence = ((event.clientX - rect.left) / rect.width) * 100;
      newConfidence = Math.max(0, Math.min(100, newConfidence));
      setConfidence(newConfidence);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleFilterClick = (filter) => {
    let updatedFilters = [...selectedFilters];

    if (filter === "Semua") {
      updatedFilters = ["Semua"]; // Jika "Semua" dipilih, reset ke hanya "Semua"
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
    }

    if (updatedFilters.length === 0) {
      updatedFilters = ["Semua"];
    }

    setSelectedFilters(updatedFilters);
  };

  return (
    <div className="px-1 md:px-10 w-full">
      <div className="px-4 md:px-10 py-2 md:py-10">
        <div className="grid grid-cols-4 mb-3">
          <div className="col-span-2 grid grid-cols-4 gap-3">
            {/* Tombol Semua */}
            <button
              className={`rounded-full dark:text-gray-300  drop-shadow-lg duration-300 px-3 py-2 ${
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

        <div className="relative grid grid-cols-5 gap-3">
          <Menu />
          <div className="bg-white  border border-gray-300 dark:border-none dark:bg-[#202329] col-span-4 rounded-md px-3 py-4 font-bold text-lg md:text-xl">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="bg-red-500 w-2 h-2 rounded-full"
                title="Kamera Tidak Aktif"
              ></div>
              <h1 className="text-gray-700 dark:text-gray-300 md:text-left">
                Monitoring Biji Pala
              </h1>
            </div>
            <div className=" border border-gray-300 dark:border-none bg-gray-100 dark:bg-[#2D2D2D] rounded-md w-full h-[70vh] flex justify-center items-center text-gray-500">
              <div className="flex flex-col items-center text-center">
                <FiCameraOff size={60} className="text-gray-400" />
                <p className="text-gray-500">Kamera Tidak Aktif</p>
                <button className="rounded-md bg-[#007D09] px-3 py-2 mt-4 text-white hover:bg-[#16A34A] duration-300">
                  Aktifkan Kamera
                </button>
              </div>
            </div>
          </div>
          <div className="grid h-full grid-rows-6 gap-y-3 text-gray-300">
            <div className="bg-white  border border-gray-300 dark:border-none dark:bg-[#202329] p-4 rounded-md text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <h1 className="text-lg font-bold">
                  Tingkat Keyakinan Prediksi
                </h1>
                <span>{Math.round(confidence)}%</span>
              </div>
              <div
                ref={sliderRef}
                className="relative w-full h-1 bg-gray-400 rounded-md mt-4"
              >
                <div
                  className="absolute h-full bg-[#007D09] rounded-md"
                  style={{ width: `${confidence}%` }}
                ></div>
                <div
                  className="absolute w-5 h-5 bg-white border border-[#007D09] rounded-full cursor-pointer"
                  style={{ left: `calc(${confidence}% - 10px)`, top: "-7px" }}
                  onMouseDown={handleMouseDown}
                ></div>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="bg-white  border border-gray-300 dark:border-none dark:bg-[#202329] row-span-3 rounded-md px-3 py-4 text-lg md:text-xl">
              <h1 className="text-center text-gray-700 dark:text-gray-300 md:text-left font-bold">
                Prediksi
              </h1>
              <div className="mt-6 text-gray-700 dark:text-gray-300 grid grid-rows-3 gap-0 h-full">
                {["Pala Busuk", "Pala Tanpa Fuli", "Pala Fuli"].map(
                  (item, idx) => (
                    <span key={idx}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl">{item}</p>
                          <p className="text-sm">
                            {idx === 0
                              ? "Tidak Menguntungkan"
                              : idx === 1
                              ? "Menguntungkan"
                              : "Sangat Menguntungkan"}
                          </p>
                        </div>
                        <div>
                          <p className="text-3xl">
                            0 <span className="text-sm">Biji</span>
                          </p>
                        </div>
                      </div>
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
