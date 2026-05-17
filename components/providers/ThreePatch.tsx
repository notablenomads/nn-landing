"use client";

import "@/lib/three/patchClock";

/** Side-effect import wrapper so THREE.Clock is patched before any R3F Canvas mounts. */
export default function ThreePatch({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
