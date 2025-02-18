import { Canvas, Rect, Circle, Triangle, ActiveSelection } from "fabric";
import React, { useEffect, useState } from "react";

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

    if (object instanceof Rect) {
      setWidth(Math.round((object.width || 0) * (object.scaleX || 1)));
      setHeight(Math.round((object.height || 0) * (object.scaleY || 1)));
      setColor(object.fill as string);
      setDiameter("");
    } else if (object instanceof Circle) {
      setDiameter(Math.round((object.radius || 0) * 2 * (object.scaleX || 1)));
      setColor(object.fill as string);
      setWidth("");
      setHeight("");
    } else if (object instanceof Triangle) {
      setWidth(Math.round((object.width || 0) * (object.scaleX || 1)));
      setHeight(Math.round((object.height || 0) * (object.scaleY || 1)));
      setColor(object.fill as string);
      setDiameter("");
    }
  };

  const clearSetting = () => {
    setSelectedObject(null);
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
  };

  return <div>{selectedObject && selectedObject instanceof Rect}</div>;
};

export default Setting;
