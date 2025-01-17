import React from "react";

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
export default SunLight;