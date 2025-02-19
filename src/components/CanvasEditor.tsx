"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, Circle, Rect, Triangle } from "fabric";
import { FaRegSquareFull } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { IoTriangleOutline } from "react-icons/io5";
import { FiSave } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
import { LuImageDown } from "react-icons/lu";
import ShapeButton from "./ui/ShapeButton";
import Setting from "./Setting";

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 500,
    });
    initCanvas.backgroundColor = "#fff";
    initCanvas.renderAll();

    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      const designJSON = localStorage.getItem("canvasDesign");
      if (designJSON) {
        canvas.loadFromJSON(JSON.parse(designJSON), () => {
          canvas.renderAll();
          canvas.requestRenderAll(); // 🔹 Force re-render
        });
      }
    }
  }, [canvas]);

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#4635B1",
      });

      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill: "#780C28",
      });

      canvas.add(circle);
    }
  };

  const addTriangle = () => {
    if (canvas) {
      const triangle = new Triangle({
        top: 100,
        left: 300,
        width: 100,
        height: 100,
        fill: "#638C6D",
      });

      canvas.add(triangle);
    }
  };

  // Save design to localStorage
  const saveDesign = () => {
    if (!canvas) return;
    if (canvas.getObjects().length === 0) {
      alert("Canvas is empty. Add shapes before saving.");
      return;
    }

    try {
      const design = canvas.toJSON();
      localStorage.setItem("canvasDesign", JSON.stringify(design));
      alert("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      alert("Failed to save design. Local storage might be full.");
    }
  };

  // Load design from localStorage
  const loadDesign = () => {
    if (!canvas) return;

    const designJSON = localStorage.getItem("canvasDesign");
    if (!designJSON) {
      alert("No saved design found!");
      return;
    }

    try {
      canvas.clear();
      canvas.loadFromJSON(JSON.parse(designJSON), () => {
        canvas.renderAll();
        alert("Design loaded successfully!");
      });
    } catch (error) {
      console.error("Error loading design:", error);
      alert("Failed to load design. Corrupted data.");
    }
  };

  // Download as PNG
  const downloadImage = () => {
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0,
      multiplier: 1,
    });

    const link = document.createElement("a");
    link.download = "canvas-design.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="font-sans text-center flex flex-col justify-start items-center px-[16px] py-[100px] bg-gray-300 min-h-[100vh] h-full">
      {/* Shape Buttons */}
      <div className="flex flex-col gap-3 bg-slate-800 py-4 rounded-[4px] fixed top-[50%] left-4 -translate-y-1/2 empty:hidden">
        <ShapeButton icon={<FiSave />} onClick={saveDesign} tooltip="Save" />
        <ShapeButton
          icon={<FiUpload />}
          onClick={loadDesign}
          tooltip="Load Image"
        />
        <ShapeButton
          icon={<LuImageDown />}
          onClick={downloadImage}
          tooltip="Download"
        />
        <ShapeButton
          icon={<FaRegSquareFull />}
          onClick={addRectangle}
          tooltip="Add Rectangle"
        />
        <ShapeButton
          icon={<FiCircle />}
          onClick={addCircle}
          tooltip="Add Circle"
        />
        <ShapeButton
          icon={<IoTriangleOutline />}
          onClick={addTriangle}
          tooltip="Add Triangle"
        />
      </div>

      {/* Canvas */}
      <canvas className="border border-gray-400 z-10" ref={canvasRef} />

      {/* Settings Panel */}
      <Setting canvas={canvas} />
    </div>
  );
};

export default CanvasEditor;
