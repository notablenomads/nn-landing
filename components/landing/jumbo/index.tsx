import React, { useRef } from "react";
import "../styles.css";
import useStore from "../store";
import TopComponent from "./topComponent";
import BottomComponent from "./bottomComponent";
import {useMediaQuery} from "@/hooks/useMediaQuery";

const FirstSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dividerElementRef = useRef<HTMLDivElement>(null);
    const setDividerPosition = useStore((state) => state.setDividerPosition);
    const dividerPosition = useStore((state) => state.dividerPosition);
    const isDraggingRef = useRef(false);

    const isMobile = useMediaQuery("(max-width: 768px)");

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current || !isDraggingRef.current) return;

        const { left, width } = containerRef.current.getBoundingClientRect();
        let newDividerPosition = ((e.clientX - left) / width) * 100;
        newDividerPosition = Math.min(Math.max(newDividerPosition, 0), 99);
        setDividerPosition(newDividerPosition);

        if (dividerElementRef.current) {
            dividerElementRef.current.style.left = `${newDividerPosition}%`;
        }

        if (containerRef.current) {
            containerRef.current.style.setProperty(
                "--divider-position",
                `${newDividerPosition}%`
            );
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
                className="content content-top w-full"
                style={!isMobile ? {
                    clipPath: `polygon(0 0, ${dividerPosition}% 0, ${dividerPosition}% 100%, 0% 100%)`,
                } : undefined}
            >
                <TopComponent />
            </div>

            {!isMobile && (
                <>
                    <div
                        className="content content-bottom"
                        style={{
                            clipPath: `polygon(${dividerPosition}% 0, 100% 0, 100% 100%, ${dividerPosition}% 100%)`,
                        }}
                    >
                        <div className="relative flex flex-col h-[100vh] items-center justify-center bg-black transition-bg opacity-0">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="jumbo absolute -inset-[10px] opacity-50" />
                            </div>
                        </div>
                        <BottomComponent />
                    </div>

                    <div
                        className={`divider-wrap ${isDividerAnimated ? "divider-pulse" : ""}`}
                        style={{ left: `${dividerPosition}%` }}
                    >
                        <div
                            className="divider-text"
                            style={{
                                position: 'absolute',
                                left: '-35px',
                                top: '50%',
                                transform: 'translateY(-50%) rotate(-180deg)',
                                writingMode: 'vertical-rl',
                                textOrientation: 'mixed',
                                color: '#fff',
                                fontSize: '14px',
                                padding: '16px 4px',
                                userSelect: 'none',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                background: 'rgba(40, 40, 40, 0.2)',
                                borderRadius: '4px',
                                boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
                                opacity: isDraggingRef.current ? 0 : 0.8,
                                transition: 'opacity 0.3s ease',
                            }}
                        >
                            Drag to reveal
                        </div>
                        <div
                            className="divider"
                            ref={dividerElementRef}
                            onMouseDown={handleDragStart}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default FirstSection;