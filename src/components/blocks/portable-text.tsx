import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

export type PortableTextContent = PortableTextBlock[] | PortableTextBlock | null | undefined;

const generateImageAlt = (value?: { alt?: string | null }) => {
  if (value?.alt?.trim()) {
    return value.alt.trim();
  }

  return "프로그램 콘텐츠 이미지";
};

// Default aspect ratio (16:9) for content images
// This matches the hotspot previews defined in the schema
const DEFAULT_ASPECT_RATIO = 16 / 9;
const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = Math.round(DEFAULT_WIDTH / DEFAULT_ASPECT_RATIO);

const parseAssetDimensionsFromRef = (
  ref?: string
): { width: number; height: number; aspectRatio: number } | null => {
  if (!ref) {
    return null;
  }

  // Sanity image asset refs contain the original dimensions, e.g.
  // "image-<hash>-2236x1078-png"
  const match = ref.match(/-(\d+)x(\d+)-/);

  if (!match) {
    return null;
  }

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  return { width, height, aspectRatio: width / height };
};

/**
 * Calculate aspect ratio for image rendering.
 * 
 * Note: Asset metadata dimensions are stored in the asset document (not the image field),
 * so they would need to be queried separately via GROQ asset expansion.
 * For now, we use a sensible default that matches our hotspot previews.
 * 
 * The hotspot data (x, y, width, height) is stored on the image field itself
 * and is automatically respected by Sanity's image-url builder when using fit("crop").
 * 
 * @see https://www.sanity.io/docs/studio/image-type#ec0774235d77
 */
const calculateAspectRatio = (
  value?: {
    asset?: {
      _ref?: string;
      // Asset metadata would be available if queried with asset-> expansion in GROQ
      metadata?: {
        dimensions?: {
          width?: number;
          height?: number;
          aspectRatio?: number;
        };
      };
    };
  }
): { width: number; height: number } => {
  // Try to get dimensions from asset metadata (if available from GROQ query)
  const dimensions = value?.asset?.metadata?.dimensions;
  
  if (dimensions?.width && dimensions?.height && dimensions.width > 0 && dimensions.height > 0) {
    // Use the aspectRatio from metadata if available, otherwise calculate it
    const aspectRatio = dimensions.aspectRatio ?? dimensions.width / dimensions.height;
    // Use default width, calculate height based on actual aspect ratio
    const height = Math.round(DEFAULT_WIDTH / aspectRatio);
    return { width: DEFAULT_WIDTH, height };
  }

  // If metadata isn't present, parse intrinsic dimensions from the Sanity asset ref.
  // This avoids forcing a 16:9 fallback in cases where we didn't expand asset metadata.
  const refDimensions = parseAssetDimensionsFromRef(value?.asset?._ref);
  if (refDimensions) {
    const height = Math.round(DEFAULT_WIDTH / refDimensions.aspectRatio);
    return { width: DEFAULT_WIDTH, height };
  }

  // Fall back to default 16:9 aspect ratio (matches hotspot preview)
  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
};

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?._type || value._type !== "image" || !value.asset?._ref) {
        return null;
      }

      const { width, height } = calculateAspectRatio(value);

      // Use fit("crop") to leverage hotspot for proper cropping
      // When fit("crop") is used, Sanity automatically respects:
      // - The hotspot focal point (x, y) to center the crop
      // - The crop boundaries (top, bottom, left, right) if set
      // The hotspot data is stored on the image field itself
      // @see https://www.sanity.io/docs/studio/image-type#ec0774235d77
      const imageUrl = urlFor(value)
        .width(width)
        .height(height)
        .fit("crop")
        .auto("format")
        .url();

      if (!imageUrl) {
        return null;
      }

      const alt = generateImageAlt(value);

      return (
        <figure
          className="my-8 overflow-hidden rounded-2xl border bg-muted/40"
          tabIndex={0}
          role="img"
          aria-label={alt}
        >
          <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full object-cover"
          />
          {value.alt && (
            <figcaption className="bg-background/80 px-4 py-2 text-center text-sm text-muted-foreground">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      if (!value?.href) {
        return children;
      }

      const isExternal = value.href.startsWith("http");

      return (
        <a
          href={value.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 text-3xl font-bold leading-tight tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-2xl font-semibold leading-snug tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary/60 pl-6 text-lg italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-8 ml-6 list-disc space-y-2 text-muted-foreground">{children}</ul>
    ),
  },
};

