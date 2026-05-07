import type { AspectRatio, ObjectFit, VerticalAlignment } from "../global-types";

const DEFAULT_ASPECT_RATIO: AspectRatio = "Square";
const DEFAULT_OBJECT_FIT: ObjectFit = "Cover";
const DEFAULT_VERTICAL_ALIGNMENT: VerticalAlignment = "Middle";

const ASPECT_RATIO_MAP: Record<AspectRatio, string> = {
  Square: "1 / 1",
  Portrait: "3 / 4",
  Landscape: "4 / 3",
  Video: "16 / 9",
};

const OBJECT_FIT_MAP: Record<ObjectFit, string> = {
  Fill: "fill",
  Cover: "cover",
  Contain: "contain",
};

const ALIGNMENT_MAP: Record<VerticalAlignment, string> = {
  Top: "flex-start",
  Middle: "center",
  Bottom: "flex-end",
};

export function resolveAspectRatio(value?: AspectRatio): string {
  return ASPECT_RATIO_MAP[value ?? DEFAULT_ASPECT_RATIO];
}

export function resolveObjectFit(value?: ObjectFit): string {
  return OBJECT_FIT_MAP[value ?? DEFAULT_OBJECT_FIT];
}

export function resolveVerticalAlignment(value?: VerticalAlignment): string {
  return ALIGNMENT_MAP[value ?? DEFAULT_VERTICAL_ALIGNMENT];
}
