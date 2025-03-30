import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Array of Ghibli images for background columns with correct extensions
const ghibliImages = [
    'https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353373/ghibli_images/memes/pb1tdko2vetpgoz6cf8p.png',
    'https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353377/ghibli_images/memes/lwl5iytgeaumxnocaqt8.png', 
    'https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353375/ghibli_images/memes/vtoueahpxs0abxagibvu.png',
    'https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353375/ghibli_images/memes/neg7ymzqopn8c7bgyoxo.png', 
    'https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353374/ghibli_images/memes/yxoghkprnafo4hoggdlm.png',
    'https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353372/ghibli_images/memes/smarayat7jxpeqnie5tm.png',
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
  const column1Images = [...shuffleArray(ghibliImages), ...shuffleArray(ghibliImages)];
  const column2Images = [...shuffleArray(ghibliImages), ...shuffleArray(ghibliImages)];
  const column3Images = [...shuffleArray(ghibliImages), ...shuffleArray(ghibliImages)];
  
  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
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
    const imageElements = document.querySelectorAll('.ghibli-image');
    let loadedCount = 0;
    const totalImages = imageElements.length;
    
    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        calculateHeights();
      }
    };
    
    imageElements.forEach(img => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
      }
    });
    
    // Fallback in case images don't load
    const timeout = setTimeout(calculateHeights, 2000);
    
    return () => {
      imageElements.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
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
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoaded]);

  // Animation variants for continuous loops
  const slideDownVariants1 = {
    animate: isLoaded && totalHeight1 > 0 ? {
      y: [-10, -totalHeight1 - 10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        }
      }
    } : {}
  };
  
  const slideUpVariants = {
    animate: isLoaded && totalHeight2 > 0 ? {
      y: [-totalHeight2 - 10, -10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        }
      }
    } : {}
  };
  
  const slideDownVariants3 = {
    animate: isLoaded && totalHeight3 > 0 ? {
      y: [-10, -totalHeight3 - 10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        }
      }
    } : {}
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
    <div className="relative min-h-screen overflow-hidden bg-gray-900">
      {/* Background Image Columns */}
      <div className="absolute inset-0 flex justify-between opacity-20">
        {renderBackgroundColumns()}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 md:mb-8 tracking-tight"
          >
            Ghibli Meme Maker
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto"
          >
            Create your own memes inspired by the Studio Ghibli
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/meme-maker')}
            className="px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl"
          >
            Create Your Meme
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;