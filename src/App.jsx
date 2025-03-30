import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MemeMaker from "./pages/MemeMaker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/meme-maker" element={<MemeMaker />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;