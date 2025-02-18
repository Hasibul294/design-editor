"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, Circle, Rect, Triangle } from "fabric";
import { FaRegSquareFull } from "react-icons/fa6";
import { FiCircle } from "react-icons/fi";
import { IoTriangleOutline } from "react-icons/io5";
import ShapeButton from "./ShapeButton";

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  //   const fabricCanvasRef = useRef<Canvas | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
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
    }

    // return () => {
    //   if (fabricCanvasRef.current) {
    //     fabricCanvasRef.current.dispose();
    //   }
    // };
  }, []);

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
      const rect = new Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill: "#780C28",
      });

      canvas.add(rect);
    }
  };

  const addTriangle = () => {
    if (canvas) {
      const rect = new Triangle({
        top: 100,
        left: 300,
        width: 100,
        height: 100,
        fill: "#638C6D",
      });

      canvas.add(rect);
    }
  };

  return (
    <div className="font-sans text-center flex flex-col justify-start items-center px-[16px] py-[100px] bg-gray-300 min-h-[100vh] h-full">
      <div className="flex flex-col gap-3 bg-slate-800 py-4 rounded-[4px] fixed top-[50%] left-4 -translate-y-1/2 empty:hidden">
        <ShapeButton icon={<FaRegSquareFull />} onClick={addRectangle} />
        <ShapeButton icon={<FiCircle />} onClick={addCircle} />
        <ShapeButton icon={<IoTriangleOutline />} onClick={addTriangle} />
      </div>
      <canvas className="border border-gray-400 z-10" ref={canvasRef} />;
    </div>
  );
};

export default CanvasEditor;
