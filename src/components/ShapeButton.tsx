import React from "react";

interface ShapeButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
}

const ShapeButton: React.FC<ShapeButtonProps> = ({ icon, onClick }) => {
  return (
    <button
      className="px-4 text-white cursor-pointer hover:text-yellow-400"
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default ShapeButton;