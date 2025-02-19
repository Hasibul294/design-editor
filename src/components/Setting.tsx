import { Canvas, Rect, Circle, Triangle, ActiveSelection } from "fabric";
import React, { useEffect, useState } from "react";
import InputField from "./ui/InputField";

type SettingProps = {
  canvas: Canvas | null;
};

const Setting: React.FC<SettingProps> = ({ canvas }) => {
  const [selectedObject, setSelectedObject] = useState<
    Rect | Circle | Triangle | null
  >(null);
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [diameter, setDiameter] = useState<number | string>("");
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    if (!canvas) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelection = (event: any) => {
      const selected = event.selected?.[0] || event.target;
      handleObjectSelection(selected);
    };

    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", () => clearSetting());
    canvas.on("object:modified", handleSelection);
    canvas.on("object:scaling", handleSelection);

    return () => {
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", clearSetting);
      canvas.off("object:modified", handleSelection);
      canvas.off("object:scaling", handleSelection);
    };
  }, [canvas]);

  const handleObjectSelection = (
    object: Rect | Circle | Triangle | ActiveSelection | null
  ) => {
    if (!object || object instanceof ActiveSelection) return;

    setSelectedObject(object);

    if (object instanceof Rect || object instanceof Triangle) {
      setWidth(Math.round((object.width || 0) * (object.scaleX || 1)));
      setHeight(Math.round((object.height || 0) * (object.scaleY || 1)));
      setColor(object.fill as string);
      setDiameter("");
    } else if (object instanceof Circle) {
      setDiameter(Math.round((object.radius || 0) * 2 * (object.scaleX || 1)));
      setColor(object.fill as string);
      setWidth("");
      setHeight("");
    }
  };

  const clearSetting = () => {
    setSelectedObject(null);
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(e.target.value, 10) || 0;
    setWidth(intValue);

    if (selectedObject instanceof Rect || selectedObject instanceof Triangle) {
      selectedObject.set({ width: intValue / (selectedObject.scaleX || 1) });
      canvas?.renderAll();
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(e.target.value, 10) || 0;
    setHeight(intValue);

    if (selectedObject instanceof Rect || selectedObject instanceof Triangle) {
      selectedObject.set({ height: intValue / (selectedObject.scaleY || 1) });
      canvas?.renderAll();
    }
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const intValue = parseInt(e.target.value, 10) || 0;
    setDiameter(intValue);

    if (selectedObject instanceof Circle) {
      selectedObject.set({
        radius: intValue / 2 / (selectedObject.scaleX || 1),
      });
      canvas?.renderAll();
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas?.renderAll();
    }
  };

  return (
    <div className="fixed right-4 top-[50%] -translate-y-1/2 gap-2 flex flex-col bg-slate-800 px-2 py-6 rounded text-left empty:p-0">
      {selectedObject && (
        <>
          {selectedObject instanceof Rect ||
          selectedObject instanceof Triangle ? (
            <>
              <InputField
                label="Width"
                value={String(width)}
                onChange={handleWidthChange}
              />
              <InputField
                label="Height"
                value={String(height)}
                onChange={handleHeightChange}
              />
            </>
          ) : selectedObject instanceof Circle ? (
            <InputField
              label="Diameter"
              value={String(diameter)}
              onChange={handleDiameterChange}
            />
          ) : null}
          <InputField
            label="Color Code"
            value={color}
            onChange={handleColorChange}
          />
        </>
      )}
    </div>
  );
};

export default Setting;
