import React, {useEffect, useRef, useState} from "react";
import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {Environment} from "@react-three/drei";
import * as THREE from "three";
import {ChromaticAberration, EffectComposer, Noise,} from "@react-three/postprocessing";
import {BlendFunction} from "postprocessing";
import useStore from "../../store";

import dynamic from "next/dynamic";
import {useMediaQuery} from "@/hooks/useMediaQuery";

const BackTechBackground = dynamic(
    () => import("@/components/landing/jumbo/tech/backTech"),
    {
        ssr: false,
    }
);
const PezDuckModel = dynamic(() => import("../models/PezDucky"), {
    ssr: false,
});

interface TechStackTowerProps {
    withEffects?: boolean;
}

const Floor = () => {
    const floorProps = {
        floorColor: "#e0e0e0",
        floorSize: 10,
        position: {x: 0, y: -0.1, z: 0},
        roughness: 0.45,
        metalness: 0.1,
    };

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
                floorProps.position.x,
                floorProps.position.y,
                floorProps.position.z,
            ]}
            receiveShadow
        >
            <planeGeometry args={[floorProps.floorSize, floorProps.floorSize]}/>
            <meshStandardMaterial
                color={floorProps.floorColor}
                roughness={floorProps.roughness}
                metalness={floorProps.metalness}
                transparent
                opacity={0.8}
            />
            <shadowMaterial transparent opacity={0.2} color="black"/>
        </mesh>
    );
};

const SunLight = () => {
    const sunProps = {
        position: {x: 20, y: 15, z: 5},
        color: "#ffffff",
        intensity: 1.5,
    };

    return (
        <pointLight
            position={[sunProps.position.x, sunProps.position.y, sunProps.position.z]}
            color={sunProps.color}
            intensity={sunProps.intensity}
        />
    );
};

const AnimatedScene = ({withEffects = false}) => {
    const modelRef = useRef<THREE.Group>(null);
    const {camera} = useThree<{ camera: THREE.PerspectiveCamera }>();
    const initialAnimationRef = useRef(true);
    const animationProgressRef = useRef(0);
    const mousePosition = useRef({x: 0, y: 0});
    const isMobile = useMediaQuery("(max-width:768px)");
    const sceneConfig = {
        startPos: {x: -25, y: 25, z: 35},
        mouseRotation: {
            intensity: 0.15,
            smoothing: 0.1,
        },
        model: {
            rotation: -6.8,
            scale: isMobile ? 0.2 : 0.3,
            position: isMobile ? {x: -6, y: 5, z: 0} : {x: 5, y: 0, z: 0},
        },
        camera: {
            position: {x: -12, y: 12, z: 26},
            rotation: {x: -0.2, y: -0.2},
            fov: 54,
            near: 0.1,
            far: 1000,
        },
    };

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mousePosition.current = {
                x: (event.clientX / window.innerWidth) * 4 - 1,
                y: (event.clientY / window.innerHeight) * 3 - 1,
            };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame(() => {
        if (initialAnimationRef.current) {
            animationProgressRef.current = THREE.MathUtils.lerp(
                animationProgressRef.current,
                1,
                0.02
            );

            const progress = animationProgressRef.current;

            camera.position.x = THREE.MathUtils.lerp(
                sceneConfig.startPos.x,
                sceneConfig.camera.position.x,
                progress
            );
            camera.position.y = THREE.MathUtils.lerp(
                sceneConfig.startPos.y,
                sceneConfig.camera.position.y,
                progress
            );
            camera.position.z = THREE.MathUtils.lerp(
                sceneConfig.startPos.z,
                sceneConfig.camera.position.z,
                progress
            );

            if (progress > 0.99) {
                initialAnimationRef.current = false;
            }
        } else {
            camera.position.set(
                sceneConfig.camera.position.x,
                sceneConfig.camera.position.y,
                sceneConfig.camera.position.z
            );
        }

        const quaternion = new THREE.Quaternion();
        const euler = new THREE.Euler(
            sceneConfig.camera.rotation.x,
            sceneConfig.camera.rotation.y,
            0,
            "XYZ"
        );
        quaternion.setFromEuler(euler);
        camera.quaternion.copy(quaternion);
        camera.fov = sceneConfig.camera.fov;
        camera.near = sceneConfig.camera.near;
        camera.far = sceneConfig.camera.far;
        camera.updateProjectionMatrix();

        if (modelRef.current) {
            const targetRotationY =
                sceneConfig.model.rotation +
                mousePosition.current.x * sceneConfig.mouseRotation.intensity;
            const targetRotationX =
                mousePosition.current.y * sceneConfig.mouseRotation.intensity;

            modelRef.current.rotation.y = THREE.MathUtils.lerp(
                modelRef.current.rotation.y,
                targetRotationY,
                sceneConfig.mouseRotation.smoothing
            );

            modelRef.current.rotation.x = THREE.MathUtils.lerp(
                modelRef.current.rotation.x,
                targetRotationX,
                sceneConfig.mouseRotation.smoothing
            );
        }
    });

    return (
        <>
            <ambientLight intensity={0.1}/>
            <directionalLight
                position={[5, 10, 2]}
                intensity={1.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={50}
                shadow-camera-near={1}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
                shadow-bias={-0.0001}
                shadow-radius={4}
            />
            <group
                ref={modelRef}
                scale={sceneConfig.model.scale}
                position={[
                    sceneConfig.model.position.x,
                    sceneConfig.model.position.y,
                    sceneConfig.model.position.z,
                ]}
            >
                <PezDuckModel/>
            </group>
            <Floor/>
            {withEffects && <SunLight/>}
        </>
    );
};

const Effects: React.FC = () => {
    const dividerPosition = useStore((state) => state.dividerPosition);
    const screenHeight = window.innerHeight;

    const progress = Math.max(
        0,
        Math.min(1, (dividerPosition / screenHeight) * 3)
    );

    const lerp = (start: number, end: number, t: number) => {
        return start * (1 - t) + end * t;
    };

    const noiseOpacity = lerp(0.4, 0, progress);
    const aberrationStrength = lerp(0.008, 0, progress);

    return (
        <EffectComposer multisampling={0}>
            <Noise
                opacity={noiseOpacity}
                blendFunction={BlendFunction.SOFT_LIGHT}
                premultiply={false}
            />
            <ChromaticAberration
                offset={new THREE.Vector2(aberrationStrength)}
                radialModulation={false}
                modulationOffset={0}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    );
};

const TechStackComponent: React.FC<TechStackTowerProps> = ({
                                                               withEffects = false,
                                                           }) => {
    console.log("withEffects", withEffects);
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
                    <AnimatedScene withEffects={withEffects}/>
                    <Environment files='/models/potsdamer_platz_1k.hdr'/>
                    {withEffects && <Effects/>}
                </Canvas>
            </div>
        </>
    );
};

export default TechStackComponent;
