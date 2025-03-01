import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/userPage/HomePage";
import Splash from "./component/user/Splash";
import PrediksiPage from "./pages/userPage/PrediksiPage";




function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/beranda" element={<HomePage />} />
          <Route path="/prediksi" element={<PrediksiPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
