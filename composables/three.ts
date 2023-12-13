import ThreeExperience from "~/experience/ThreeExperience";

export const useThree = (canvasSelector = "#three", firstTickCallback: (() => void) | null = null) => {
  const canvas = document.querySelector<HTMLCanvasElement>(canvasSelector);
  if (!canvas) {
    throw new Error(`Canvas with query selector '${canvasSelector}' not found`);
  }

  const threeExperience = new ThreeExperience(canvas, firstTickCallback);

  return threeExperience;
};
