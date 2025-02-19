import React from "react";

interface ShapeButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
  disabled?: boolean; // Add the disabled prop
}

const ShapeButton = ({
  icon,
  onClick,
  tooltip,
  disabled,
}: ShapeButtonProps) => {
  return (
    <div className="relative group">
      <button
        className={`px-4 text-white cursor-pointer hover:text-yellow-400 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={onClick}
        disabled={disabled} // Pass the disabled prop to the button
      >
        {icon}
      </button>
      {tooltip && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default ShapeButton;
