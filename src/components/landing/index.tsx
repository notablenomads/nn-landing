"use client";
import React, { useRef } from "react";
import TopComponent from "./topComponent";
import BottomComponent from "./bottomComponent";
import useStore from "./store";
import "./styles.css";

const Landing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerElementRef = useRef<HTMLDivElement>(null);
  const setDividerPosition = useStore((state) => state.setDividerPosition);
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

  return (
    <>
      <div className="overlap-container" ref={containerRef}>
        <div
          className="content content-top"
          style={{
            clipPath: `polygon(0 0, var(--divider-position, 50%) 0, var(--divider-position, 50%) 100%, 0% 100%)`,
          }}
        >
          <TopComponent />
        </div>
        <div
          className="content content-bottom"
          style={{
            clipPath: `polygon(var(--divider-position, 50%) 0, 100% 0, 100% 100%, var(--divider-position, 50%) 100%)`,
          }}
        >
          <BottomComponent />
        </div>
        <div
          className="divider"
          ref={dividerElementRef}
          style={{ left: `var(--divider-position, 50%)` }}
          onMouseDown={handleDragStart}
        />
      </div>
    </>
  );
};

export default Landing;
