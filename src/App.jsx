import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MemeMaker from "./pages/MemeMaker";

function App() {
  useEffect(() => {
    document.title = "Ghibli Meme Maker - Create Studio Ghibli Inspired Memes | No Login Required";

    const updateOrCreateMetaTag = (name, content, isProperty = false) => {
      let metaTag = document.querySelector(isProperty ? `meta[property='${name}']` : `meta[name='${name}']`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        if (isProperty) {
          metaTag.setAttribute("property", name);
        } else {
          metaTag.name = name;
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    // Standard Meta Tags
    updateOrCreateMetaTag("description", "Make and share Studio Ghibli memes online. Free Ghibli meme generator for Totoro, Spirited Away, and more. No login required!");
    updateOrCreateMetaTag("keywords", "Ghibli meme maker, Studio Ghibli memes, anime meme generator, anime meme maker, create memes online");
    updateOrCreateMetaTag("author", "Altamsh Bairagdar");

    // Open Graph (Facebook, LinkedIn)
    updateOrCreateMetaTag("og:title", "Ghibli Meme Maker - Create Studio Ghibli Inspired Memes", true);
    updateOrCreateMetaTag("og:description", "Easily create and customize Studio Ghibli inspired memes with our free online tool. No sign-up required!", true);
    updateOrCreateMetaTag("og:image", "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743365151/ghibli_images/assets/sqopiavaiukpml9eu2fd.png", true);
    updateOrCreateMetaTag("og:url", "https://www.ghiblimemes.fun", true);
    updateOrCreateMetaTag("og:type", "website", true);

    // Twitter Meta Tags
    updateOrCreateMetaTag("twitter:card", "summary_large_image", true);
    updateOrCreateMetaTag("twitter:title", "Ghibli Meme Maker - Studio Ghibli Inspired Meme Generator", true);
    updateOrCreateMetaTag("twitter:description", "Create and customize your favorite Studio Ghibli memes instantly. No login required!", true);
    updateOrCreateMetaTag("twitter:image", "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743365151/ghibli_images/assets/sqopiavaiukpml9eu2fd.png", true);
  }, []);

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
