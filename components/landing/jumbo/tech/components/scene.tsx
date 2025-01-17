import React, {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {useFrame, useThree} from "@react-three/fiber";
import {useMediaQuery} from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import Floor from "@/components/landing/jumbo/tech/components/floor";
import SunLight from "@/components/landing/jumbo/tech/components/sunLight";

const PezDuckModel = dynamic(() => import("../../models/PezDucky"), {
    ssr: false,
});

interface AnimatedSceneProps {
    withEffects: boolean;
    isChatOpen?: boolean;
}

const AnimatedScene = ({withEffects = false, isChatOpen = false}: AnimatedSceneProps) => {
    const modelRef = useRef<THREE.Group>(null);
    const {camera} = useThree<{ camera: THREE.PerspectiveCamera }>();
    const initialAnimationRef = useRef(true);
    const animationProgressRef = useRef(0);
    const mousePosition = useRef({x: 0, y: 0});
    const isMobile = useMediaQuery("(max-width:768px)");
    const isClosing = useRef(false);

    const sceneConfig = useMemo(() => ({
        startPos: {x: -25, y: 25, z: 35},
        mouseRotation: {
            intensity: 0.15,
            smoothing: 0.1,
        },
        model: {
            rotation: -6.8,
            targetScale: isMobile ? 0.2 : (isChatOpen ? 0.3 : 0.25),
            targetPosition: isMobile ?
                {x: -6, y: 5, z: 0} :
                {x: isChatOpen ? 6 : 5, y: 0, z: 0},
        },
        camera: {
            position: {x: -12, y: 12, z: 26},
            rotation: {x: -0.2, y: -0.2},
            fov: 54,
            near: 0.1,
            far: 1000,
        },
    }), [isMobile, isChatOpen]);

    useEffect(() => {
        if (!isChatOpen && !isClosing.current) {
            isClosing.current = true;
        } else if (isChatOpen) {
            isClosing.current = false;
        }
    }, [isChatOpen]);

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

    useFrame((state, delta) => {
        if (initialAnimationRef.current) {
            animationProgressRef.current = THREE.MathUtils.lerp(
                animationProgressRef.current,
                1,
                0.1
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

        if (!modelRef.current) return;

        // Base damping factors
        const positionDamping = 4;
        const scaleDamping = 6;
        const rotationDamping = 8;

        // Handle position and scale updates
        const newScale = THREE.MathUtils.damp(
            modelRef.current.scale.x,
            sceneConfig.model.targetScale,
            scaleDamping,
            delta
        );
        modelRef.current.scale.set(newScale, newScale, newScale);

        modelRef.current.position.x = THREE.MathUtils.damp(
            modelRef.current.position.x,
            sceneConfig.model.targetPosition.x,
            positionDamping,
            delta
        );

        modelRef.current.position.y = THREE.MathUtils.damp(
            modelRef.current.position.y,
            sceneConfig.model.targetPosition.y,
            positionDamping,
            delta
        );

        modelRef.current.position.z = THREE.MathUtils.damp(
            modelRef.current.position.z,
            sceneConfig.model.targetPosition.z,
            positionDamping,
            delta
        );

        // Handle rotation with mouse interaction
        const baseRotationY = sceneConfig.model.rotation;
        const mouseRotationX = mousePosition.current.y * sceneConfig.mouseRotation.intensity;
        const mouseRotationY = mousePosition.current.x * sceneConfig.mouseRotation.intensity;

        // Apply mouse rotation regardless of chat state
        modelRef.current.rotation.y = THREE.MathUtils.damp(
            modelRef.current.rotation.y,
            baseRotationY + mouseRotationY,
            rotationDamping,
            delta
        );

        modelRef.current.rotation.x = THREE.MathUtils.damp(
            modelRef.current.rotation.x,
            mouseRotationX,
            rotationDamping,
            delta
        );

        // Camera updates
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
            <group ref={modelRef}>
                <PezDuckModel/>
            </group>
            <Floor/>
            {withEffects && <SunLight/>}
        </>
    );
};

export default AnimatedScene;