import { ReactNode } from "react";
import { RxCross2 } from "react-icons/rx";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Dialog = ({ open, onClose, title, children }: DialogProps) => {
  if (!open) return null;

  console.log("this is open", open);

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex items-center mb-6">
          <h2 className="flex-grow text-lg font-semibold">{title}</h2>
          <button
            className="p-1 bg-white shadow-lg backdrop-blur-lg border rounded-md cursor-pointer"
            onClick={onClose}
          >
            <RxCross2 className="w-6 h-6 hover:text-red-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
