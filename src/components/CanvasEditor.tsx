"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, Circle, Rect, Triangle } from "fabric";
import { FaUndo, FaRedo } from "react-icons/fa";
import { FaRegSquareFull } from "react-icons/fa6";
import { FiCircle, FiSave } from "react-icons/fi";
import { IoTriangleOutline } from "react-icons/io5";
import { LuImageDown } from "react-icons/lu";
import ShapeButton from "./ui/ShapeButton";
import Setting from "./Setting";
import Dialog from "./ui/Dialog";
import useCanvasReducer from "@/hooks/useCanvasReducer";

const CanvasEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, dispatch } = useCanvasReducer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = new Canvas(canvasRef.current, {
      width: 500,
      height: 500,
    });
    initCanvas.backgroundColor = "#fff";
    initCanvas.renderAll();

    dispatch({ type: "SET_CANVAS", payload: initCanvas });

    return () => {
      initCanvas.dispose();
    };
  }, [dispatch]);

  useEffect(() => {
    if (state.canvas) {
      const designJSON = localStorage.getItem("canvasDesign");
      if (designJSON) {
        setIsDialogOpen(true);
      }
    }
  }, [state.canvas]);

  const handleRestore = () => {
    if (!state.canvas) return;

    const designJSON = localStorage.getItem("canvasDesign");
    if (designJSON) {
      state.canvas.loadFromJSON(JSON.parse(designJSON), () => {
        state.canvas!.renderAll();
        state.canvas!.requestRenderAll();
      });
    }
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    localStorage.removeItem("canvasDesign");
    setIsDialogOpen(false);
  };

  const addRectangle = () => {
    if (state.canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#4635B1",
      });

      state.canvas.add(rect);
      dispatch({ type: "SAVE_STATE" });
    }
  };

  const addCircle = () => {
    if (state.canvas) {
      const circle = new Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill: "#780C28",
      });

      state.canvas.add(circle);
      dispatch({ type: "SAVE_STATE" });
    }
  };

  const addTriangle = () => {
    if (state.canvas) {
      const triangle = new Triangle({
        top: 100,
        left: 300,
        width: 100,
        height: 100,
        fill: "#638C6D",
      });

      state.canvas.add(triangle);
      dispatch({ type: "SAVE_STATE" });
    }
  };

  const undo = () => {
    dispatch({ type: "UNDO" });
  };

  const redo = () => {
    dispatch({ type: "REDO" });
  };

  const saveDesign = () => {
    if (!state.canvas) return;
    if (state.canvas.getObjects().length === 0) {
      alert("Canvas is empty. Add shapes before saving.");
      return;
    }

    try {
      const design = state.canvas.toJSON();
      localStorage.setItem("canvasDesign", JSON.stringify(design));
      alert("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      alert("Failed to save design. Local storage might be full.");
    }
  };

  const downloadImage = () => {
    if (!state.canvas) return;

    const dataURL = state.canvas.toDataURL({
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
    <div className="font-sans text-center flex flex-col justify-start items-center px-[16px] py-[150px] bg-gray-300 min-h-[100vh] h-full">
      <Dialog
        open={isDialogOpen}
        onClose={handleCancel}
        title="Restore Previous Version!"
      >
        <p>
          A previous version of the canvas was found. Do you want to restore it?
        </p>
        <div className="flex justify-between items-center mt-6">
          <button
            className="text-white px-4 py-2 bg-gray-800 rounded mr-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleRestore}
          >
            Restore
          </button>
        </div>
      </Dialog>

      {/* Shape Buttons */}
      <div className="flex flex-col gap-3 bg-slate-800 py-4 rounded-[4px] fixed top-[50%] left-4 -translate-y-1/2 empty:hidden">
        <ShapeButton icon={<FiSave />} onClick={saveDesign} tooltip="Save" />
        <ShapeButton
          icon={<LuImageDown />}
          onClick={downloadImage}
          tooltip="Download Image"
        />
        <ShapeButton
          icon={<FaUndo />}
          onClick={undo}
          tooltip="Undo"
          disabled={state.undoStack.length === 0}
        />
        <ShapeButton
          icon={<FaRedo />}
          onClick={redo}
          tooltip="Redo"
          disabled={state.redoStack.length === 0}
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
      <div className="relative p-2 rounded-lg shadow-lg bg-white bg-opacity-20 backdrop-blur-lg border border-white/30">
        <canvas className="border border-gray-400 z-10" ref={canvasRef} />
      </div>

      {/* Settings Panel */}
      <Setting canvas={state.canvas} />
    </div>
  );
};

export default CanvasEditor;
