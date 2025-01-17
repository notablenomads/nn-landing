import React, {useEffect, useState} from "react";
import {Canvas} from "@react-three/fiber";
import {Environment} from "@react-three/drei";

import dynamic from "next/dynamic";
import AnimatedScene from "@/components/landing/jumbo/tech/components/scene";

const BackTechBackground = dynamic(
    () => import("@/components/landing/jumbo/tech/backTech"),
    {
        ssr: false,
    }
);


interface TechStackTowerProps {
    withEffects?: boolean;
    isChatOpen?: boolean;
}


const TechStackComponent: React.FC<TechStackTowerProps> = ({
                                                               withEffects = false,
                                                               isChatOpen = false,

                                                           }) => {
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsModelLoaded(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {isModelLoaded && <BackTechBackground activeNeon={withEffects}/>}
            <div className="absolute inset-0">
                <Canvas shadows gl={{antialias: true}}>
                    <AnimatedScene withEffects={withEffects} isChatOpen={isChatOpen}/>
                    <Environment files='/models/potsdamer_platz_1k.hdr'/>
                </Canvas>
            </div>
        </>
    );
};

export default TechStackComponent;
