import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Array of Ghibli images for background columns with correct extensions
const ghibliImages = [
  "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353373/ghibli_images/memes/pb1tdko2vetpgoz6cf8p.png",
  "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353377/ghibli_images/memes/lwl5iytgeaumxnocaqt8.png",
  "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353375/ghibli_images/memes/vtoueahpxs0abxagibvu.png",
  "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353375/ghibli_images/memes/neg7ymzqopn8c7bgyoxo.png",
  "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353374/ghibli_images/memes/yxoghkprnafo4hoggdlm.png",
  "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353372/ghibli_images/memes/smarayat7jxpeqnie5tm.png",
];

// Featured popular memes data
const popularMemes = [
  {
    id: 1,
    title: "Woman yelling at a cat",
    image:
      "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353373/ghibli_images/memes/pb1tdko2vetpgoz6cf8p.png",
    likes: 22453,
  },
  {
    id: 2,
    title: "Disaster Girl",
    image:
      "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353377/ghibli_images/memes/lwl5iytgeaumxnocaqt8.png",
    likes: 81092,
  },
  {
    id: 3,
    title: "Two Buttons",
    image:
      "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353375/ghibli_images/memes/vtoueahpxs0abxagibvu.png",
    likes: 39211,
  },
  {
    id: 4,
    title: "Drake No/Yes",
    image:
      "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353375/ghibli_images/memes/neg7ymzqopn8c7bgyoxo.png",
    likes: 56789,
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [totalHeight1, setTotalHeight1] = useState(0);
  const [totalHeight2, setTotalHeight2] = useState(0);
  const [totalHeight3, setTotalHeight3] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const column1Ref = useRef(null);
  const column2Ref = useRef(null);
  const column3Ref = useRef(null);

  // Shuffle arrays for random initial load
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Create duplicate arrays for seamless looping with random initial order
  const column1Images = [
    ...shuffleArray(ghibliImages),
    ...shuffleArray(ghibliImages),
  ];
  const column2Images = [
    ...shuffleArray(ghibliImages),
    ...shuffleArray(ghibliImages),
  ];
  const column3Images = [
    ...shuffleArray(ghibliImages),
    ...shuffleArray(ghibliImages),
  ];

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Calculate real height after images are loaded
  useEffect(() => {
    const calculateHeights = () => {
      if (column1Ref.current) {
        setTotalHeight1(column1Ref.current.offsetHeight / 2); // Divide by 2 because we duplicated the images
      }
      if (column2Ref.current) {
        setTotalHeight2(column2Ref.current.offsetHeight / 2);
      }
      if (column3Ref.current) {
        setTotalHeight3(column3Ref.current.offsetHeight / 2);
      }
      setIsLoaded(true);
    };

    // Add event listeners to all images
    const imageElements = document.querySelectorAll(".ghibli-image");
    let loadedCount = 0;
    const totalImages = imageElements.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        calculateHeights();
      }
    };

    imageElements.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
      }
    });

    // Fallback in case images don't load
    const timeout = setTimeout(calculateHeights, 2000);

    return () => {
      imageElements.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
      });
      clearTimeout(timeout);
    };
  }, []);

  // Recalculate heights on window resize
  useEffect(() => {
    const handleResize = () => {
      if (column1Ref.current) {
        setTotalHeight1(column1Ref.current.offsetHeight / 2);
      }
      if (column2Ref.current) {
        setTotalHeight2(column2Ref.current.offsetHeight / 2);
      }
      if (column3Ref.current) {
        setTotalHeight3(column3Ref.current.offsetHeight / 2);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoaded]);

  // Animation variants for continuous loops
  const slideDownVariants1 = {
    animate:
      isLoaded && totalHeight1 > 0
        ? {
            y: [-10, -totalHeight1 - 10],
            transition: {
              y: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            },
          }
        : {},
  };

  const slideUpVariants = {
    animate:
      isLoaded && totalHeight2 > 0
        ? {
            y: [-totalHeight2 - 10, -10],
            transition: {
              y: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            },
          }
        : {},
  };

  const slideDownVariants3 = {
    animate:
      isLoaded && totalHeight3 > 0
        ? {
            y: [-10, -totalHeight3 - 10],
            transition: {
              y: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            },
          }
        : {},
  };

  // Adjust the number of columns based on viewport width
  const renderBackgroundColumns = () => {
    if (isMobile) {
      // Single column for mobile
      return (
        <div className="w-full flex flex-col overflow-hidden px-2">
          <motion.div
            ref={column1Ref}
            className="flex flex-col gap-4"
            variants={slideDownVariants1}
            animate={isLoaded ? "animate" : ""}
          >
            {column1Images.map((img, i) => (
              <img
                key={`col1-${i}`}
                src={img}
                alt=""
                className="w-full rounded-lg transform hover:scale-105 transition-transform ghibli-image"
              />
            ))}
          </motion.div>
        </div>
      );
    } else {
      // Three columns for tablet and desktop
      return (
        <>
          <div className="w-1/3 flex flex-col overflow-hidden px-2">
            <motion.div
              ref={column1Ref}
              className="flex flex-col gap-4"
              variants={slideDownVariants1}
              animate={isLoaded ? "animate" : ""}
            >
              {column1Images.map((img, i) => (
                <img
                  key={`col1-${i}`}
                  src={img}
                  alt=""
                  className="w-full rounded-lg transform hover:scale-105 transition-transform ghibli-image"
                />
              ))}
            </motion.div>
          </div>

          <div className="w-1/3 flex flex-col overflow-hidden px-2">
            <motion.div
              ref={column2Ref}
              className="flex flex-col gap-4"
              variants={slideUpVariants}
              animate={isLoaded ? "animate" : ""}
            >
              {column2Images.map((img, i) => (
                <img
                  key={`col2-${i}`}
                  src={img}
                  alt=""
                  className="w-full rounded-lg transform hover:scale-105 transition-transform ghibli-image"
                />
              ))}
            </motion.div>
          </div>

          <div className="w-1/3 flex flex-col overflow-hidden px-2">
            <motion.div
              ref={column3Ref}
              className="flex flex-col gap-4"
              variants={slideDownVariants3}
              animate={isLoaded ? "animate" : ""}
            >
              {column3Images.map((img, i) => (
                <img
                  key={`col3-${i}`}
                  src={img}
                  alt=""
                  className="w-full rounded-lg transform hover:scale-105 transition-transform ghibli-image"
                />
              ))}
            </motion.div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="bg-gray-900">
      <Helmet>
        <title>Ghibli Meme Maker - Create Studio Ghibli Inspired Memes</title>
        <meta name="description" content="Create and customize your own Studio Ghibli inspired memes with our easy-to-use meme maker. No login required!" />
        <meta name="keywords" content="ghibli, meme maker, studio ghibli, memes, anime memes" />
        <meta property="og:title" content="Ghibli Meme Maker" />
        <meta property="og:description" content="Create and customize your own Studio Ghibli inspired memes" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ghibli Meme Maker" />
        <meta name="twitter:description" content="Create and customize your own Studio Ghibli inspired memes" />
      </Helmet>

      {/* Background and Hero Container */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image Columns */}
        <div className="absolute inset-0 flex justify-between opacity-20">
          {renderBackgroundColumns()}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight font-serif"
            >
              Create Your Own Ghibli Memes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              Transform your favorite Studio Ghibli moments into hilarious memes with our easy-to-use meme creator
            </motion.p>
            <div className="flex flex-col items-center gap-4">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/meme-maker")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl cursor-pointer"
              >
                Start Creating Now
              </motion.button>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-gray-400 text-base"
              >
                No login required 🙅❌
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Ghibli Memes Section - Completely Separate Container */}
      <section className="bg-gray-800 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
            Popular Ghibli Memes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {popularMemes.map((meme) => (
              <motion.div
                key={meme.id}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="relative pb-[75%]">
                  <img
                    src={meme.image}
                    alt={meme.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-1">
                    {meme.title}
                  </h3>
                  <div className="flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span>{meme.likes.toLocaleString()}</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer"
                    onClick={() => navigate(`/meme-maker`)}
                  >
                    Customize This Meme
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
