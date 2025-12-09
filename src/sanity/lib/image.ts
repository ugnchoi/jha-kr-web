import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

export const getImageDimensions = (image: SanityImageSource): { width: number; height: number; aspectRatio: number } => {
  // @ts-ignore
  const ref = image?.asset?._ref || image?._ref;
  if (!ref) {
    return { width: 0, height: 0, aspectRatio: 0 };
  }

  const dimensions = ref.split("-")[2]; // asset-id-dimensions-format
  if (!dimensions) {
    return { width: 0, height: 0, aspectRatio: 0 };
  }

  const [width, height] = dimensions.split("x").map(Number);
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
};
