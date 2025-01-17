import React from "react";

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


export default Floor;