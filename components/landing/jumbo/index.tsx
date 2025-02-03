import React, { useRef } from "react";
import "../styles.css";
import TopComponent from "./topComponent";

const FirstSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="overlap-container" ref={containerRef}>
      <TopComponent />
    </div>
  );
};

export default FirstSection;
