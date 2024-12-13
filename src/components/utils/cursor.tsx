/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState, useEffect, useRef} from "react";
import useStore from '../landing/store'

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isNearDivider, setIsNearDivider] = useState(false);
  const dividerPosition = useStore((state) => state.dividerPosition);

  useEffect(() => {
    document.body.style.cursor = "none";

    const updatePosition = (e: MouseEvent) => {
      if (!cursorRef.current) return;

      // Use transform for better performance
      cursorRef.current.style.transform = `translate3d(${e.clientX - 15}px, ${
        e.clientY - 15
      }px, 0)`;

      // Check divider proximity
      const container = document.querySelector(".overlap-container");
      if (container) {
        const { left, width } = container.getBoundingClientRect();
        const dividerX = left + (width * dividerPosition) / 100;
        const isNear = Math.abs(e.clientX - dividerX) <= 10;

        // Only update state if the proximity changes
        if (isNear !== isNearDivider) {
          setIsNearDivider(isNear);
        }
      }
    };

    // Use requestAnimationFrame for smoother updates
    let rafId: number;
    const smoothUpdate = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => updatePosition(e));
    };

    window.addEventListener("mousemove", smoothUpdate);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", smoothUpdate);
      cancelAnimationFrame(rafId);
    };
  }, [dividerPosition, isNearDivider]);

  return (
    <>
      <style>{`
        .cursor-dot {
          mix-blend-mode: difference;
          z-index: 9999;
          pointer-events: none;
          position: fixed;
          left: 0;
          top: 0;
          will-change: transform;
        }
        
        .cursor-inner {
          transition: transform 0.15s ease-out;
        }
        
        .near-divider .cursor-inner {
          transform: scale(1.2);
        }
      `}</style>
      <div className="cursor-dot" ref={cursorRef}>
        <div
          className={`cursor-inner rounded-full bg-white w-10 h-10 ${
            isNearDivider ? "near-divider" : ""
          }`}
        />
      </div>
    </>
  );
};

export default CustomCursor;
