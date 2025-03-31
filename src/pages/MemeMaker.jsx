"use client";

import {
  ArrowDown,
  Download,
  Image as ImageIcon,
  LayoutTemplate,
  Move,
  Plus,
  Trash,
  Type,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

const MemeMaker = () => {
  const [image, setImage] = useState(null);
  const [texts, setTexts] = useState([]);
  const [selectedTextIds, setSelectedTextIds] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  // Ghibli template images
  const ghibliImages = [
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353231/ghibli_images/templates/uytoqk7wxvv44er31wwc.jpg",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353305/ghibli_images/templates/otrkkxjk3cay689wueuj.png",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353233/ghibli_images/templates/ociohdatnrns5tefyen5.jpg",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353231/ghibli_images/templates/oqsnxirijk9tppsreo68.jpg",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743364493/ghibli_images/templates/rofwdozeggylcmvbrubj.png",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743364477/ghibli_images/templates/zfaswigltr9p2xgxwimc.png",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353230/ghibli_images/templates/zlykacsajtbkufkiay8m.avif",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353232/ghibli_images/templates/zq5fenlhzba5zmnhuyld.jpg",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353336/ghibli_images/templates/kdfji1mdlezbi4widaa8.png",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353329/ghibli_images/templates/mwwg7axbieog1ss2jejs.png",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353244/ghibli_images/templates/akuijlfkfqb8pxdeyntx.webp",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353327/ghibli_images/templates/mtybmjie7j5sslonbzqo.png",
    "https://res.cloudinary.com/dzbgzkwim/image/upload/v1743353235/ghibli_images/templates/erqsrptjl6cieqdavol4.jpg",
  ];

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match("image.*")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          // Set default canvas size
          if (canvasRef.current) {
            // Reduce image size to 500x500
            canvasRef.current.width = 500;
            canvasRef.current.height = 500;
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle template image selection
  const handleTemplateSelect = (templatePath) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      setImage(img);
      if (canvasRef.current) {
        canvasRef.current.width = 500;
        canvasRef.current.height = 500;
      }
      setShowTemplates(false);
    };
    img.onerror = () => {
      console.error("Error loading template image:", templatePath);
      // Create a placeholder image with the filename as text
      const canvas = document.createElement("canvas");
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, 500, 500);
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Template: " + templatePath.split("/").pop(), 250, 250);

      const placeholderImg = new Image();
      placeholderImg.src = canvas.toDataURL();
      placeholderImg.onload = () => {
        setImage(placeholderImg);
        setShowTemplates(false);
      };
    };
    img.src = templatePath;
  };

  // Toggle templates container
  const toggleTemplates = () => {
    setShowTemplates(!showTemplates);
  };

  // Add new text element
  const addText = () => {
    const containerWidth = containerRef.current?.offsetWidth || 400;
    const containerHeight = containerRef.current?.offsetHeight || 400;

    const newText = {
      id: Date.now(),
      content: "Text Here",
      x: containerWidth / 2 - 180,
      y: containerHeight / 2,
      fontSize: 24,
      fontFamily: "Arial",
      color: "#ffffff",
      fontWeight: "normal",
      isDragging: false,
      // Text effect properties
      shadowColor: "#000000",
      shadowBlur: 3, // Add some shadow blur for better visibility
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      strokeColor: "#000000",
      strokeWidth: 2, // Add stroke for better visibility on all backgrounds
      opacity: 1,
      rotation: 0,
      textAlign: "center", // Center-align the text
      backgroundColor: "transparent",
      backgroundOpacity: 1,
      padding: 0,
    };

    setTexts([...texts, newText]);
    setSelectedTextIds([newText.id]);
  };

  // Handle text selection and movement for both mouse and touch events
  const handleStart = (e, id) => {
    const isTouchEvent = e.type === "touchstart";
    const event = isTouchEvent ? e.touches[0] : e;

    if ((e.ctrlKey || e.metaKey) && !isTouchEvent) {
      setSelectedTextIds((prev) =>
        prev.includes(id)
          ? prev.filter((textId) => textId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedTextIds([id]);
    }

    const text = texts.find((t) => t.id === id);
    if (!text) return;

    const updatedTexts = texts.map((t) =>
      t.id === id ? { ...t, isDragging: true } : t
    );
    setTexts(updatedTexts);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;
    const startTextX = text.x;
    const startTextY = text.y;

    const handleMove = (moveEvent) => {
      const moveTouch =
        moveEvent.type === "touchmove" ? moveEvent.touches[0] : moveEvent;
      const dx = moveTouch.clientX - rect.left - startX;
      const dy = moveTouch.clientY - rect.top - startY;

      setTexts((prevTexts) =>
        prevTexts.map((t) =>
          t.id === id
            ? {
                ...t,
                x: Math.min(Math.max(startTextX + dx, 0), canvas.width - 100),
                y: Math.min(
                  Math.max(startTextY + dy, t.fontSize),
                  canvas.height
                ),
              }
            : t
        )
      );
    };

    const handleEnd = () => {
      setTexts((prevTexts) =>
        prevTexts.map((t) => (t.id === id ? { ...t, isDragging: false } : t))
      );

      if (isTouchEvent) {
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
      } else {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
      }
    };

    if (isTouchEvent) {
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
    } else {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
    }
  };

  // Update canvas when state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      // Calculate dimensions to maintain aspect ratio and center the image
      const scale = Math.min(
        canvas.width / image.width,
        canvas.height / image.height
      );
      const x = (canvas.width - image.width * scale) / 2;
      const y = (canvas.height - image.height * scale) / 2;

      ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
    }

    texts.forEach((text) => {
      ctx.save();

      // Apply text rotation
      ctx.translate(text.x, text.y);
      ctx.rotate((text.rotation * Math.PI) / 180);

      // Set text properties
      ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
      ctx.globalAlpha = text.opacity;

      // Set text alignment
      ctx.textAlign = text.textAlign;

      // Calculate max width for text wrapping (adjust as needed)
      const maxWidth = 300; // Maximum width in pixels for wrapped text

      // Split text into lines (handle both manual line breaks and automatic wrapping)
      const textLines = [];
      const manualLines = text.content.split("\n");

      manualLines.forEach((line) => {
        if (ctx.measureText(line).width <= maxWidth) {
          textLines.push(line);
        } else {
          // Words that need to be wrapped
          const words = line.split(" ");
          let currentLine = "";

          words.forEach((word) => {
            const testLine = currentLine + (currentLine ? " " : "") + word;
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth) {
              textLines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });

          if (currentLine) {
            textLines.push(currentLine);
          }
        }
      });

      // Calculate total height of the text block for proper positioning
      const lineHeight = text.fontSize * 1.2; // 1.2 is the line height multiplier
      const totalTextHeight = lineHeight * textLines.length;

      // Draw each line of text
      textLines.forEach((line, index) => {
        const yPos = index * lineHeight - totalTextHeight + text.fontSize;
        const xPos =
          text.textAlign === "center"
            ? 0
            : text.textAlign === "right"
            ? -ctx.measureText(line).width
            : 0;

        // Apply drop shadow if set
        if (text.shadowBlur > 0) {
          ctx.shadowColor = text.shadowColor;
          ctx.shadowBlur = text.shadowBlur;
          ctx.shadowOffsetX = text.shadowOffsetX;
          ctx.shadowOffsetY = text.shadowOffsetY;
        }

        // Draw text stroke if set
        if (text.strokeWidth > 0) {
          ctx.strokeStyle = text.strokeColor;
          ctx.lineWidth = text.strokeWidth;
          ctx.strokeText(line, xPos, yPos);
        }

        // Draw text fill
        ctx.fillStyle = text.color;
        ctx.fillText(line, xPos, yPos);
      });

      ctx.restore();

      // Highlight selected texts (keep this part as it was)
      // Inside your useEffect where you draw text highlights
      if (selectedTextIds.includes(text.id)) {
        ctx.save();

        // Calculate text bounding box similar to findClickedText function
        ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;

        // Calculate max width for wrapped text
        const maxWidth = 300;

        // Split text into lines
        const textLines = [];
        const manualLines = text.content.split("\n");

        manualLines.forEach((line) => {
          if (ctx.measureText(line).width <= maxWidth) {
            textLines.push(line);
          } else {
            // Words that need to be wrapped
            const words = line.split(" ");
            let currentLine = "";

            words.forEach((word) => {
              const testLine = currentLine + (currentLine ? " " : "") + word;
              const testWidth = ctx.measureText(testLine).width;

              if (testWidth > maxWidth) {
                textLines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            });

            if (currentLine) {
              textLines.push(currentLine);
            }
          }
        });

        // Calculate total height of text block
        const lineHeight = text.fontSize * 1.2;
        const totalTextHeight = lineHeight * textLines.length;

        // Calculate widest line for bounding box
        const maxLineWidth = Math.max(
          ...textLines.map((line) => ctx.measureText(line).width),
          1 // Prevent errors with empty text
        );

        // Calculate bounding box based on text alignment
        let minX, maxX;
        if (text.textAlign === "center") {
          minX = -maxLineWidth / 2;
          maxX = maxLineWidth / 2;
        } else if (text.textAlign === "right") {
          minX = -maxLineWidth;
          maxX = 0;
        } else {
          // left alignment
          minX = 0;
          maxX = maxLineWidth;
        }

        // Add padding to highlight
        const padding = 4;

        // Calculate position in canvas space
        ctx.translate(text.x, text.y);
        ctx.rotate((text.rotation * Math.PI) / 180);

        // Draw highlight box
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          minX - padding,
          -totalTextHeight - padding,
          maxLineWidth + padding * 2,
          totalTextHeight + padding * 2
        );

        ctx.restore();
      }
    });
  }, [image, texts, selectedTextIds]);

  // Download the meme
  const downloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempSelectedIds = [...selectedTextIds];
    setSelectedTextIds([]);

    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      setSelectedTextIds(tempSelectedIds);
    }, 0);
  };

  // Delete selected texts
  const deleteSelectedTexts = () => {
    if (selectedTextIds.length > 0) {
      setTexts(texts.filter((t) => !selectedTextIds.includes(t.id)));
      setSelectedTextIds([]);
    }
  };

  // Update text properties for all selected texts
  const updateSelectedTexts = (updates) => {
    if (selectedTextIds.length === 0) return;

    setTexts(
      texts.map((text) =>
        selectedTextIds.includes(text.id) ? { ...text, ...updates } : text
      )
    );
  };

  // Helper function to find clicked/touched text
  const findClickedText = (x, y, textArray, canvas) => {
    const ctx = canvas.getContext("2d");

    return textArray.find((text) => {
      // Save context state
      ctx.save();

      // Apply text rotation to context
      ctx.translate(text.x, text.y);
      ctx.rotate((text.rotation * Math.PI) / 180);

      // Set font to measure text properly
      ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;

      // Calculate max width for wrapped text
      const maxWidth = 300;

      // Split text into lines (both manual and auto-wrapped)
      const textLines = [];
      const manualLines = text.content.split("\n");

      manualLines.forEach((line) => {
        if (ctx.measureText(line).width <= maxWidth) {
          textLines.push(line);
        } else {
          // Words that need to be wrapped
          const words = line.split(" ");
          let currentLine = "";

          words.forEach((word) => {
            const testLine = currentLine + (currentLine ? " " : "") + word;
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth) {
              textLines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });

          if (currentLine) {
            textLines.push(currentLine);
          }
        }
      });

      // Calculate total height of text block
      const lineHeight = text.fontSize * 1.2;
      const totalTextHeight = lineHeight * textLines.length;

      // Calculate widest line for bounding box
      const maxLineWidth = Math.max(
        ...textLines.map((line) => ctx.measureText(line).width),
        1 // Prevent errors with empty text
      );

      // Calculate bounding box based on text alignment
      let minX, maxX;
      if (text.textAlign === "center") {
        minX = -maxLineWidth / 2;
        maxX = maxLineWidth / 2;
      } else if (text.textAlign === "right") {
        minX = -maxLineWidth;
        maxX = 0;
      } else {
        // left alignment
        minX = 0;
        maxX = maxLineWidth;
      }

      // Add some padding to make it easier to select
      const padding = 10; // px
      minX -= padding;
      maxX += padding;

      // Transform point coordinates to account for text rotation and position
      const relativeX = x - text.x;
      const relativeY = y - text.y;

      // Calculate rotated coordinates
      const angle = (text.rotation * Math.PI) / 180;
      const rotatedX =
        relativeX * Math.cos(-angle) - relativeY * Math.sin(-angle);
      const rotatedY =
        relativeX * Math.sin(-angle) + relativeY * Math.cos(-angle);

      // Check if point is within text bounding box
      const isInside =
        rotatedX >= minX &&
        rotatedX <= maxX &&
        rotatedY >= -totalTextHeight - padding &&
        rotatedY <= padding;

      // Restore context
      ctx.restore();

      return isInside;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Ghibli Meme Maker - Create Studio Ghibli Inspired Memes</title>
        <meta
          name="description"
          content="Create and customize your own Studio Ghibli inspired memes with our easy-to-use meme maker. No login required!"
        />
        <meta
          name="keywords"
          content="ghibli, meme maker, studio ghibli, memes, anime memes"
        />
        <meta property="og:title" content="Ghibli Meme Maker" />
      </Helmet>
      <meta
        property="og:description"
        content="Create and customize your own Studio Ghibli inspired memes"
      />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8 tracking-tight font-['Pacifico', cursive]">
          Ghibli Meme Maker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls - Appears second on mobile */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-6 h-[calc(100vh-8rem)] lg:sticky lg:top-8 flex flex-col order-2 lg:order-1">
            <h2 className="text-xl font-semibold text-white mb-6">Controls</h2>

            {/* Fixed buttons section */}
            <div className="space-y-4">
              {/* Image upload button */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md cursor-pointer"
              >
                <ImageIcon size={20} className="mr-2" />
                Import Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Use template button */}
              <button
                onClick={toggleTemplates}
                className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md cursor-pointer"
              >
                <LayoutTemplate size={20} className="mr-2" />
                Use Ghibli Template
              </button>

              {/* Add text button */}
              <button
                onClick={addText}
                className={`flex items-center justify-center w-full p-3 rounded-lg transition-all duration-200 shadow-md cursor-pointer ${
                  image
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!image}
              >
                <Plus size={20} className="mr-2" />
                Add Text
              </button>
            </div>

            {/* Scrollable text properties section */}
            <div
              className="flex-1 overflow-y-auto mt-8"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#4B5563 #1F2937",
              }}
            >
              {selectedTextIds.length > 0 && (
                <div className="space-y-5 divide-y divide-gray-700">
                  <div className="pb-4">
                    <h3 className="text-lg font-medium text-white mb-4">
                      Text Properties
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Text Content
                        </label>
                        <textarea
                          value={
                            texts.find((t) => t.id === selectedTextIds[0])
                              ?.content || ""
                          }
                          onChange={(e) => {
                            const text = e.target.value;
                            const rows = text.split("\n").length;
                            e.target.rows = Math.max(3, rows);

                            // Get the selected text
                            const selectedText = texts.find(
                              (t) => t.id === selectedTextIds[0]
                            );
                            if (!selectedText) return;

                            // Calculate appropriate font size based on text length
                            // This is a simple approach - reduce font size as text gets longer
                            let newFontSize = selectedText.fontSize;

                            // If text is longer than a certain threshold, start reducing font size
                            const baseLength = 30;
                            const textLength = text.length;

                            if (textLength > baseLength) {
                              // Calculate a scaling factor (adjust these values as needed)
                              const reductionFactor = 0.9; // Less aggressive reduction
                              const excessChars = textLength - baseLength;
                              const reductionSteps = Math.floor(
                                excessChars / 10
                              ); // Reduce size every 10 extra chars

                              // Apply reduction (but don't go below 12px)
                              newFontSize = Math.max(
                                12,
                                selectedText.fontSize *
                                  Math.pow(reductionFactor, reductionSteps)
                              );
                            }

                            // Update text content and font size
                            updateSelectedTexts({
                              content: text,
                              fontSize: Math.round(newFontSize), // Round to nearest integer
                            });
                          }}
                          rows={3}
                          className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white resize-none"
                          placeholder="Enter your text here..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Font Size
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="12"
                            max="72"
                            value={
                              texts.find((t) => t.id === selectedTextIds[0])
                                ?.fontSize || 24
                            }
                            onChange={(e) =>
                              updateSelectedTexts({
                                fontSize: parseInt(e.target.value),
                              })
                            }
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-sm text-gray-300 min-w-[3rem]">
                            {texts.find((t) => t.id === selectedTextIds[0])
                              ?.fontSize || 24}
                            px
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Font Family
                        </label>
                        <select
                          value={
                            texts.find((t) => t.id === selectedTextIds[0])
                              ?.fontFamily || "Arial"
                          }
                          onChange={(e) =>
                            updateSelectedTexts({ fontFamily: e.target.value })
                          }
                          className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">
                            Times New Roman
                          </option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Verdana">Verdana</option>
                          <option value="Impact">Impact</option>
                          <option value="Comic Sans MS">Comic Sans MS</option>
                          <option value="Trebuchet MS">Trebuchet MS</option>
                          <option value="Arial Black">Arial Black</option>
                          <option value="Palatino">Palatino</option>
                          <option value="Garamond">Garamond</option>
                          <option value="Bookman">Bookman</option>
                          <option value="Helvetica">Helvetica</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Font Weight
                        </label>
                        <select
                          value={
                            texts.find((t) => t.id === selectedTextIds[0])
                              ?.fontWeight || "normal"
                          }
                          onChange={(e) =>
                            updateSelectedTexts({ fontWeight: e.target.value })
                          }
                          className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                        >
                          <option value="normal">Normal</option>
                          <option value="bold">Bold</option>
                          <option value="lighter">Light</option>
                          <option value="bolder">Bolder</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Font Color
                        </label>
                        <input
                          type="color"
                          value={
                            texts.find((t) => t.id === selectedTextIds[0])
                              ?.color || "#ffffff"
                          }
                          onChange={(e) =>
                            updateSelectedTexts({ color: e.target.value })
                          }
                          className="w-full h-10 rounded-lg cursor-pointer bg-gray-700"
                        />
                      </div>

                      {/* Text effect controls */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Text Alignment
                        </label>
                        <select
                          value={
                            texts.find((t) => t.id === selectedTextIds[0])
                              ?.textAlign || "left"
                          }
                          onChange={(e) =>
                            updateSelectedTexts({ textAlign: e.target.value })
                          }
                          className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Rotation (degrees)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={
                            texts.find((t) => t.id === selectedTextIds[0])
                              ?.rotation || 0
                          }
                          onChange={(e) =>
                            updateSelectedTexts({
                              rotation: parseInt(e.target.value),
                            })
                          }
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Opacity
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={
                            (texts.find((t) => t.id === selectedTextIds[0])
                              ?.opacity || 1) * 100
                          }
                          onChange={(e) =>
                            updateSelectedTexts({
                              opacity: parseInt(e.target.value) / 100,
                            })
                          }
                          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Shadow
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="color"
                            value={
                              texts.find((t) => t.id === selectedTextIds[0])
                                ?.shadowColor || "#000000"
                            }
                            onChange={(e) =>
                              updateSelectedTexts({
                                shadowColor: e.target.value,
                              })
                            }
                            className="h-10 rounded-lg cursor-pointer bg-gray-700"
                          />
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={
                              texts.find((t) => t.id === selectedTextIds[0])
                                ?.shadowBlur || 0
                            }
                            onChange={(e) =>
                              updateSelectedTexts({
                                shadowBlur: parseInt(e.target.value),
                              })
                            }
                            className="h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer mt-4"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Stroke
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="color"
                            value={
                              texts.find((t) => t.id === selectedTextIds[0])
                                ?.strokeColor || "#000000"
                            }
                            onChange={(e) =>
                              updateSelectedTexts({
                                strokeColor: e.target.value,
                              })
                            }
                            className="h-10 rounded-lg cursor-pointer bg-gray-700"
                          />
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={
                              texts.find((t) => t.id === selectedTextIds[0])
                                ?.strokeWidth || 0
                            }
                            onChange={(e) =>
                              updateSelectedTexts({
                                strokeWidth: parseInt(e.target.value),
                              })
                            }
                            className="h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer mt-4"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Background
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="color"
                            value={
                              texts.find((t) => t.id === selectedTextIds[0])
                                ?.backgroundColor || "#000000"
                            }
                            onChange={(e) =>
                              updateSelectedTexts({
                                backgroundColor: e.target.value,
                              })
                            }
                            className="h-10 rounded-lg cursor-pointer bg-gray-700"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={
                              (texts.find((t) => t.id === selectedTextIds[0])
                                ?.backgroundOpacity || 1) * 100
                            }
                            onChange={(e) =>
                              updateSelectedTexts({
                                backgroundOpacity:
                                  parseInt(e.target.value) / 100,
                              })
                            }
                            className="h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer mt-4"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={deleteSelectedTexts}
                      className="flex items-center justify-center w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md cursor-pointer"
                    >
                      <Trash size={20} className="mr-2" />
                      Delete Selected Text
                      {selectedTextIds.length > 1 ? "s" : ""}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fixed download button at bottom */}
            <div className="mt-4">
              <button
                onClick={downloadMeme}
                className={`flex items-center justify-center w-full p-3 rounded-lg transition-all duration-200 shadow-md cursor-pointer
                  ${
                    image
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                disabled={!image}
              >
                <Download size={20} className="mr-2" />
                Download Meme
              </button>
            </div>
          </div>

          {/* Center and right columns - Preview */}
          <div className="lg:col-span-2">
            <div
              className="bg-gray-800 rounded-2xl shadow-xl p-6 min-h-[600px]"
              ref={containerRef}
            >
              <div className="flex items-center justify-center min-h-[500px] relative">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto min-h-[500px] rounded-lg border border-gray-700"
                  // Mouse handler
                  onMouseDown={(e) => {
                    const canvas = canvasRef.current;
                    const rect = canvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    const clickedText = findClickedText(
                      mouseX,
                      mouseY,
                      texts,
                      canvas
                    );

                    if (clickedText) {
                      handleStart(e, clickedText.id);
                    }
                  }}
                  // Touch handler
                  onTouchStart={(e) => {
                    const canvas = canvasRef.current;
                    const rect = canvas.getBoundingClientRect();
                    const touch = e.touches[0];
                    const touchX = touch.clientX - rect.left;
                    const touchY = touch.clientY - rect.top;

                    const clickedText = findClickedText(
                      touchX,
                      touchY,
                      texts,
                      canvas
                    );

                    if (clickedText) {
                      handleStart(e, clickedText.id);
                    }
                  }}
                />

                {/* Template Gallery Overlay */}
                {showTemplates && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-90 rounded-lg flex flex-col overflow-hidden z-10">
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                      <h3 className="text-lg font-medium text-white">
                        Select a Template
                      </h3>
                      <button
                        onClick={() => setShowTemplates(false)}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {ghibliImages.map((imgPath, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
                            onClick={() => handleTemplateSelect(imgPath)}
                          >
                            <img
                              src={imgPath}
                              alt={`Template ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "placeholder.png";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!image && (
                <div className="text-center mt-6 text-gray-400">
                  <p className="text-lg">
                    Import an image or select a template to get started
                  </p>
                  <ArrowDown className="mx-auto mt-3 animate-bounce" />
                </div>
              )}

              {image && texts.length === 0 && (
                <div className="text-center mt-6 text-gray-400">
                  <p className="text-lg">Add text to your meme</p>
                  <Type className="mx-auto mt-3 animate-pulse" />
                </div>
              )}
              {image && texts.length > 0 && (
                <div className="text-center mt-6 text-gray-400">
                  <p className="text-lg">
                    Click and drag to move text. Hold Ctrl/Cmd to select
                    multiple texts.
                  </p>
                  <Move className="mx-auto mt-3" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p className="text-sm">
            Tip: Create as many text elements as you need and position them by
            dragging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemeMaker;
