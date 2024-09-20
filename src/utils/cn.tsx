import { ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge((config) => {
  delete config.conflictingClassGroups["font-size"];
  return config;
});

/**
 * className 병합 & 순서 정렬
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
