import React, {useRef} from "react";
import "../styles.css";
import useStore from "../store";
import TopComponent from "./topComponent";
import {useMediaQuery} from "@/hooks/useMediaQuery";

const FirstSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dividerPosition = useStore((state) => state.dividerPosition);

    const isMobile = useMediaQuery("(max-width: 768px)");


    return (
        <div className="overlap-container" ref={containerRef}>
            <div
                className="content content-top w-full"
                style={!isMobile ? {
                    clipPath: `polygon(0 0, ${dividerPosition}% 0, ${dividerPosition}% 100%, 0% 100%)`,
                } : undefined}
            >
                <TopComponent/>
            </div>

        </div>
    );
};

export default FirstSection;