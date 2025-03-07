const ESP32Detection = () => {
    const videoUrl = "http://localhost:5000/pala-deteksi-video"; // Stream dari Flask
  
    return (
      <div className="relative w-full h-full">
        {/* Ganti iframe dengan img untuk menampilkan stream dari Flask */}
        <img className="w-full h-full" src={videoUrl} alt="ESP32 Stream" />
      </div>
    );
  };
  
  export default ESP32Detection;
  