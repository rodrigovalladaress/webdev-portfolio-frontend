import { initializeThree } from "~/three/three";

export const useThree = (canvasSelector = "#three") => {
  initializeThree(canvasSelector);

  return ref();
};
