import ThreeExperience from "~/experience/ThreeExperience";

export const useThree = () => {
  const experience = ref<null | ThreeExperience>(null);

  const initialize = (canvas: HTMLCanvasElement, firstTickCallback: (() => void) | null = null) => {
    experience.value = new ThreeExperience(canvas, firstTickCallback);
  };

  const animate = (animationName: Parameters<ThreeExperience["animate"]>["0"]) => {
    experience.value?.animate(animationName);
  };

  const destroy = () => {
    experience.value?.destroy();
    experience.value = null;
  };

  return { initialize, destroy, experience, animate };
};
