import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import LandingPage from "./pages/LandingPage";
import MemeMaker from "./pages/MemeMaker";

function App() {
  return (
    <HelmetProvider>
    <BrowserRouter>
      <Helmet>
        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.ghiblimemes.fun" />
      </Helmet>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/meme-maker" element={<MemeMaker />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;