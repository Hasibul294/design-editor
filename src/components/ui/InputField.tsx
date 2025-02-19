import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-white">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {/* Color Preview Box (Only Shows for Valid Hex Colors) */}
        {type === "text" && /^#([0-9A-Fa-f]{3}){1,2}$/.test(value) && (
          <div
            className="min-w-8 h-9 rounded border border-gray-300"
            style={{ backgroundColor: value }}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
