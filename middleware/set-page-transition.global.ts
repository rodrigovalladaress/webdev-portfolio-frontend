import type { PageMeta } from "nuxt/dist/app/types";

type OwnPageMeta = PageMeta & {
  order?: number;
};

const getOrder = (meta: OwnPageMeta) => {
  return meta.order ?? 0;
};

// Changes the transition of the pages so they slide left or right depending on its position
// in the nav menu
export default defineNuxtRouteMiddleware((to, from) => {
  const transitionName = getOrder(to.meta) > getOrder(from.meta) ? "slide-left" : "slide-right";

  const transition: typeof to.meta.pageTransition = {
    name: transitionName,

    // Allow the HTML element to scroll again (the overflow-hidden class
    // is added when the NuxtLink is clicked on NavMenu)
    onAfterEnter: () => {
      document.documentElement.classList.remove("overflow-hidden");
    },
  };

  to.meta.pageTransition = {
    ...transition,
  };

  from.meta.pageTransition = {
    ...transition,
  };
});
