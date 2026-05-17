/**
 * Suppress THREE.Clock deprecation noise from @react-three/fiber until v10 uses Timer.
 * @see https://github.com/pmndrs/react-three-fiber/issues/3741
 */
import { setConsoleFunction } from "three";

let patched = false;

function patchThreeClockWarning() {
  if (patched) return;
  patched = true;

  setConsoleFunction((type, message, ...params) => {
    if (
      type === "warn" &&
      typeof message === "string" &&
      message.includes("THREE.Clock") &&
      message.includes("deprecated")
    ) {
      return;
    }

    switch (type) {
      case "warn":
        console.warn(message, ...params);
        break;
      case "error":
        console.error(message, ...params);
        break;
      case "log":
        console.log(message, ...params);
        break;
    }
  });
}

patchThreeClockWarning();
