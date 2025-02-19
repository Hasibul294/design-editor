import React, { useState } from "react";
import { SketchPicker } from "react-color";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: InputFieldProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleColorChange = (color: any) => {
    onChange(color.hex);
  };

  return (
    <div className="flex flex-col space-y-1 relative">
      <label className="text-sm font-medium text-white">{label}</label>

      <div className="flex items-center space-x-2">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Color Preview & Picker Trigger */}
        {type === "text" && /^#([0-9A-Fa-f]{3}){1,2}$/.test(value) && (
          <div
            className="min-w-8 h-9 rounded border border-gray-300 cursor-pointer"
            style={{ backgroundColor: value }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
        )}
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="absolute z-10 top-full mt-2 left-0 shadow-lg bg-white p-2 rounded">
          <SketchPicker color={value} onChange={handleColorChange} />
          <button
            onClick={() => setShowColorPicker(false)}
            className="mt-2 text-xs text-gray-600 hover:text-black"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default InputField;
