import React from "react";
import { useGLTF } from "@react-three/drei";

export default function CatModel(props) {
  const { nodes, materials } = useGLTF("./cat-transformed.glb");
  return (
    <group {...props} dispose={null}>
      <group position={[0, 0.295, 0]}>
        <mesh
          geometry={nodes.Untitled001.geometry}
          material={materials.BaseSwitch}
        />
        <mesh
          geometry={nodes.Untitled001_1.geometry}
          material={materials.Base}
        />
        <mesh
          geometry={nodes.Untitled001_2.geometry}
          material={materials.BaseText}
        />
      </group>
      <mesh
        geometry={nodes.Body.geometry}
        material={materials.Body}
        position={[0, 0.295, 0]}
      />
    </group>
  );
}

useGLTF.preload("/cat-transformed.glb");
