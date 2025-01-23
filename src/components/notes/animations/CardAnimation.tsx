import { ReactNode } from "react";

interface CardAnimationProps {
  children: ReactNode;
  index?: number;
  className?: string;
}

export const CardAnimation = ({ children, index = 0, className = "" }: CardAnimationProps) => {
  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={{
        animationDelay: `${index * 0.05}s`,
        animationFillMode: 'backwards'
      }}
    >
      {children}
    </div>
  );
};