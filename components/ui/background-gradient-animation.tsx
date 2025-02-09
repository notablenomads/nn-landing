"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(17, 24, 39)", // Dark background
  gradientBackgroundEnd = "rgb(2, 6, 23)", // Darker background
  mainGlowColor = "255, 255, 255", // White glow
  secondaryGlowColor = "180, 185, 190", // Subtle secondary glow
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  mainGlowColor?: string;
  secondaryGlowColor?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    container.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    container.style.setProperty("--main-glow", mainGlowColor);
    container.style.setProperty("--secondary-glow", secondaryGlowColor);
  }, []);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return;
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX
      )}%, ${Math.round(curY)}%)`;
    }

    move();
  }, [tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      const scaleX = (x / containerRect.width) * 100;
      const scaleY = (y / containerRect.height) * 100;

      setTgX(scaleX);
      setTgY(scaleY);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      {/* Strong black shadows at top and bottom */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

      {/* Center the content */}
      <div
        className={cn(
          "relative z-10 flex items-center min-h-full py-16",
          className
        )}
      >
        <div className="container mx-auto px-4">{children}</div>
      </div>

      {/* Main glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            "[background:radial-gradient(circle_at_center,_rgba(var(--main-glow),_0.15)_0%,_rgba(var(--main-glow),_0.1)_25%,_transparent_70%)_no-repeat]",
            "[mix-blend-mode:screen]",
            "animate-first opacity-100"
          )}
        />

        {/* Subtle secondary glow */}
        <div
          className={cn(
            "absolute inset-0",
            "[background:radial-gradient(circle_at_center,_rgba(var(--secondary-glow),_0.1)_0%,_rgba(var(--secondary-glow),_0.05)_45%,_transparent_70%)_no-repeat]",
            "[mix-blend-mode:screen]",
            "animate-second opacity-70"
          )}
        />

        {/* Interactive glow effect */}
        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              "absolute w-[200%] h-[200%] -top-1/2 -left-1/2",
              "[background:radial-gradient(circle_at_center,_rgba(var(--main-glow),_0.1)_0%,_rgba(var(--main-glow),_0.05)_25%,_transparent_70%)_no-repeat]",
              "[mix-blend-mode:screen]",
              "bg-cover bg-center opacity-100"
            )}
          />
        )}
      </div>
    </div>
  );
};
