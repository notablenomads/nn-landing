import * as THREE from "three";
import type { RootState } from "@react-three/fiber";

/** Use PCFShadowMap — PCFSoftShadowMap is deprecated in three r184+. */
export function configureCanvasRenderer({ gl }: Pick<RootState, "gl">) {
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFShadowMap;
}
