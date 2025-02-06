import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SelectButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

export const SelectButton = React.forwardRef<
  HTMLButtonElement,
  SelectButtonProps
>(({ className, selected, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "w-full h-auto p-4 flex flex-col items-start gap-2 whitespace-normal break-words",
        selected
          ? "bg-secondary text-black hover:text-white/80 hover:bg-white/10"
          : "border-1/35 border-white text-white/65 bg-black hover:bg-white/10 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

SelectButton.displayName = "SelectButton";
