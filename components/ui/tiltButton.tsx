import React from 'react';
import { Button, type ButtonProps } from "@/components/ui/button";
import { Camera } from "lucide-react";

type CustomSize = 'sm' | 'md' | 'lg';

interface CustomButtonProps extends Omit<ButtonProps, 'size'> {
  icon?: React.ReactNode;
  size?: CustomSize;
  children: React.ReactNode;
}

const CustomButton = ({ 
  children, 
  icon = <Camera className="h-6 w-6" />,
  size = 'md',
  ...props 
}: CustomButtonProps) => {
  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const iconElement = icon as React.ReactElement<{ className?: string }>;

  return (
    <Button
      {...props}
      className={`
        rounded-none
        bg-black text-white 
        hover:bg-black hover:text-white
        ${sizeClasses[size]}
        p-0 flex flex-col items-center justify-center gap-2
        transition-all duration-300 ease-in-out
        border-2 border-white
        hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]
        ${props.className || ''}
      `}
    >
      {React.cloneElement(iconElement, {
        className: `${iconSizes[size]} ${iconElement.props.className || ""}`,
      })}
      <span className="text-sm">{children}</span>
    </Button>
  );
};

export default CustomButton;