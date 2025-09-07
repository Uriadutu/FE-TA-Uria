import React, { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import { FiCameraOff } from "react-icons/fi";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import HasilPrediksiModal from "../modals/HasilPrediksiModal";

const Home = () => {
  const [selectedFilters, setSelectedFilters] = useState(["Semua"]); // Default "Semua" aktif
  const [allowedPredictions, setAllowedPredictions] = useState([
    "pala",
    "pala_fuli",
    "pala_busuk",
  ]);
  const [confidence, setConfidence] = useState(80);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(false);

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

  const [preview, setPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  console.log(resultImage, selectedFilters);

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

  const handleSnapshot = async () => {
    const snapshotUrl = "http://192.168.137.194/capture";

    try {
      const response = await fetch(snapshotUrl);
      const blob = await response.blob();

      // ✅ Ubah blob menjadi File dengan ekstensi .jpg
      const file = new File([blob], `image.png`, {
        type: "image/jpeg",
      });

      // ✅ Kirim ke fungsi upload
      handleImageUpload(file);
    } catch (error) {
      console.error("Gagal mengambil gambar:", error);
      // alert("Gagal Mengambil Gambar. Pastikan ESP32-CAM terhubung.");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  };

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
      <AnimatePresence>
        {error && (
          <div className="fixed inset-0 flex items-start pt-20 justify-center bg-black bg-opacity-65 px-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-white dark:bg-[#202329] rounded-lg shadow-lg overflow-hidden"
            >
              {" "}
              <h3 className="text-lg text-center p-10 font-semibold text-gray-700 dark:text-gray-300">
                Gagal Menangkap Gambar, Pastikan ESP Terhubung
              </h3>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
          <div className="bg-white  border border-gray-300 dark:border-none dark:bg-[#202329] col-span-5 rounded-md px-3 py-4 font-bold text-lg md:text-xl">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="bg-red-500 w-2 h-2 rounded-full"
                title="Kamera Tidak Aktif"
              ></div>
              <h1 className="text-gray-700 dark:text-gray-300 md:text-left">
                Monitoring Biji Pala
              </h1>
            </div>
            <div className="border relative  border-gray-300 dark:border-none bg-gray-100 dark:bg-[#2D2D2D] rounded-md w-full h-[70vh] flex justify-center items-center text-gray-500">
              {isCameraOn && (
                <div className="absolute bottom-10">
                  <div className="gap-5 bottom-10 flex justify-center">
                    <button
                      onClick={() => setIsCameraOn(false)}
                      className="rounded-md bg-[#888888] px-3 py-2 mt-4 text-white hover:bg-[#a6a6a6] duration-300"
                    >
                      Matikan Kamera
                    </button>
                    <button
                      onClick={() => handleSnapshot()}
                      className="rounded-md bg-[#007D09] px-3 py-2 mt-4 text-white hover:bg-[#16A34A] duration-300"
                    >
                      Prediksi
                    </button>
                  </div>
                </div>
              )}
              {isCameraOn ? (
                <div className="w-full h-full">
                  <img
                    src="http://192.168.137.194:81/stream"
                    alt="ESP32-CAM Stream"
                    style={{ border: "2px solid #333" }}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <FiCameraOff size={60} className="text-gray-400" />
                  <p className="text-gray-500">Kamera Tidak Aktif</p>
                  <button
                    onClick={() => setIsCameraOn(true)}
                    className="rounded-md bg-[#007D09] px-3 py-2 mt-4 text-white hover:bg-[#16A34A] duration-300"
                  >
                    Aktifkan Kamera
                  </button>
                </div>
              )}
              {/* <ESP32Detection/> */}
            </div>
          </div>
          {/* <div className="grid h-full grid-rows-6 gap-y-3 text-gray-300">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
