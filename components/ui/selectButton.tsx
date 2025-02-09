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
        "w-full h-auto p-3 flex flex-col gap-0 items-start whitespace-normal break-words text-lg",
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
