import React, { ReactNode, useState } from "react";

interface ToggleableInputProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  children: ReactNode;
}

export const ToggleableInput = ({ Icon, label, children }: ToggleableInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <button
        type="button" // Ensure the button is not of type "submit"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Icon className="h-5 w-5" />
        
      </button>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};