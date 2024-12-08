import { useState, useEffect } from "react";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.cursor = "none";

    const updatePosition = (e: any) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updatePosition);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot {
          mix-blend-mode: difference;
          z-index: 9999;
          pointer-events: none;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
      `}</style>
      <div
        className="cursor-dot fixed"
        style={{
          left: `${position.x - 15}px`,
          top: `${position.y - 15}px`,
        }}
      >
        <div className="rounded-full bg-white w-10 h-10" />
      </div>
    </>
  );
};

export default CustomCursor;
