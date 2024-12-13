import React, { useRef } from "react";

import "../styles.css";
import useStore from "../store";
import TopComponent from "./topComponent";
import BottomComponent from "./bottomComponent";

const FirstSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerElementRef = useRef<HTMLDivElement>(null);
  const setDividerPosition = useStore((state) => state.setDividerPosition);
  const dividerPosition = useStore((state) => state.dividerPosition);
  const isDraggingRef = useRef(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !isDraggingRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const newDividerPosition = ((e.clientX - left) / width) * 100;

    if (newDividerPosition >= 0 && newDividerPosition <= 100) {
      // Update store
      setDividerPosition(newDividerPosition);

      // Update divider position
      if (dividerElementRef.current) {
        dividerElementRef.current.style.left = `${newDividerPosition}%`;
      }

      // Update container style
      if (containerRef.current) {
        containerRef.current.style.setProperty(
          "--divider-position",
          `${newDividerPosition}%`
        );
      }
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  const isDividerAnimated = dividerPosition >= 90;

  return (
    <div className="overlap-container" ref={containerRef}>
      <div
        className="content content-top"
        style={{
          clipPath: `polygon(0 0, ${dividerPosition}% 0, ${dividerPosition}% 100%, 0% 100%)`,
        }}
      >
        <TopComponent />
      </div>
      <div
        className="content content-bottom"
        style={{
          clipPath: `polygon(${dividerPosition}% 0, 100% 0, 100% 100%, ${dividerPosition}% 100%)`,
        }}
      >
        <div className="relative flex flex-col h-[100vh] items-center justify-centerbg-black transition-bg opacity-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="jumbo absolute -inset-[10px] opacity-50" />
          </div>
        </div>
        <BottomComponent />
      </div>
      <div
        className={`divider ${isDividerAnimated ? "divider-pulse" : ""}`}
        ref={dividerElementRef}
        style={{ left: `${dividerPosition}%` }}
        onMouseDown={handleDragStart}
      />
    </div>
  );
};

export default FirstSection;
