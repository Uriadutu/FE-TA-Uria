import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const HasilPrediksiModal = ({
  setOpenModal,
  resultImage,
  preview,
  Predictions,
  initialMinConfidence = 0.6,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const imgRef = useRef(null);
  const [imgDimensions, setImgDimensions] = useState({ width: 1, height: 1 });
  const [minConfidence, setMinConfidence] = useState(initialMinConfidence);

  const allowedPredictions = Predictions;

  useEffect(() => {
    if (imgRef.current) {
      setImgDimensions({
        width: imgRef.current.clientWidth || 1,
        height: imgRef.current.clientHeight || 1,
      });
    }
  }, [preview]);

  const originalWidth = resultImage?.image_width || 1;
  const originalHeight = resultImage?.image_height || 1;

  const scaleX = imgDimensions.width / originalWidth;
  const scaleY = imgDimensions.height / originalHeight;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsDataLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = async () => {
    setOpenModal(false);
    try {
      await axios.delete("http://localhost:5000/hapus");
    } catch (error) {
      console.log(error);
    }
  };

  const classCount = useMemo(() => {
    const count = { pala: 0, pala_fuli: 0, pala_busuk: 0 };
    resultImage?.predictions?.forEach((prediction) => {
      if (
        allowedPredictions.includes(prediction.class) &&
        prediction.confidence >= minConfidence
      ) {
        count[prediction.class] = (count[prediction.class] || 0) + 1;
      }
    });
    return count;
  }, [resultImage?.predictions, allowedPredictions, minConfidence]);

  return (
    <div className="fixed inset-0 flex items-start pt-20 justify-center bg-black bg-opacity-65 px-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-7xl bg-[#202329] rounded-lg shadow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#1D1F22]">
          <h3 className="text-lg font-semibold text-gray-300">
            Hasil Deteksi Gambar Unggahan
          </h3>
          <button
            onClick={handleCloseModal}
            className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-300 bg-transparent rounded-lg hover:bg-red-500 hover:text-gray-100 transition duration-300"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 text-gray-300 grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-[#343434] rounded-md p-6 flex justify-center items-center min-h-[400px] relative">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">
                  Memproses hasil prediksi...
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  ref={imgRef}
                  src={preview}
                  alt="Deteksi"
                  className="object-contain max-h-[500px] w-full"
                  onLoad={() => {
                    if (imgRef.current) {
                      setImgDimensions({
                        width: imgRef.current.clientWidth,
                        height: imgRef.current.clientHeight,
                      });
                    }
                  }}
                />

                {resultImage?.predictions?.map((prediction, index) => {
                  if (
                    !allowedPredictions.includes(prediction.class) ||
                    prediction.confidence < minConfidence
                  )
                    return null;

                  const left = (prediction.x - prediction.width / 2) * scaleX;
                  const top = (prediction.y - prediction.height / 2) * scaleY;
                  const width = prediction.width * scaleX;
                  const height = prediction.height * scaleY;

                  const colorMap = {
                    pala: "#25008B",
                    pala_fuli: "#007D09",
                    pala_busuk: "#830000",
                  };

                  const borderColor = colorMap[prediction.class] || "#FFFFFF";

                  return (
                    <div
                      key={index}
                      className="absolute border-4 border-solid"
                      style={{
                        left: `${left}px`,
                        top: `${top}px`,
                        width: `${width}px`,
                        height: `${height}px`,
                        borderColor: borderColor,
                      }}
                    >
                      <span
                        className="absolute top-0 left-0 text-white text-xs px-1"
                        style={{
                          transform: "translateY(-100%)",
                          backgroundColor: borderColor,
                        }}
                      >
                        {prediction.class} (
                        {(prediction.confidence * 100).toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-rows-3 gap-3">
            <div className="col-span-1 bg-[#343434] rounded-md p-4">
              <div className="flex justify-between">
                <h1 className="text-lg font-bold">
                  Tingkat Keyakinan Minimum
                </h1>
                <span>{(minConfidence * 100).toFixed(0)}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                className="w-full mt-4"
              />
              <div className="mt-3 flex justify-between text-sm">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="col-span-1 row-span-2 bg-[#343434] rounded-md p-4">
              <h1 className="text-center text-[#D2D5DB] font-bold mb-4">
                Prediksi
              </h1>

              {isDataLoading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-400">
                    Memproses data prediksi...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allowedPredictions.map(
                    (className) =>
                      classCount[className] > 0 && (
                        <div
                          key={className}
                          className="flex justify-between items-center border-b border-gray-600 pb-2"
                        >
                          <p className="text-lg">
                            {className.replace("_", " ")}
                          </p>
                          <p className="text-xl font-semibold">
                            {classCount[className]}{" "}
                            <span className="text-sm">Biji</span>
                          </p>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HasilPrediksiModal;
