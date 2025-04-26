import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Function that merges duplicate tailwind classes + integrates with clsx
 * for constructing classNames conditionally.
 */
export const tailwindMerge = (...inputs: Array<ClassValue>) => {
  return twMerge(clsx(inputs));
};
