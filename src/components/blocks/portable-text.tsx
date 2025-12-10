import Image from "next/image";
import type { PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

export type PortableTextContent = PortableTextBlock[] | PortableTextBlock | null | undefined;

const generateImageAlt = (value?: { alt?: string | null }) => {
  if (value?.alt?.trim()) {
    return value.alt.trim();
  }

  return "Program content image";
};

// Default aspect ratio (16:9) for content images
const DEFAULT_ASPECT_RATIO = 16 / 9;
const DEFAULT_WIDTH = 1600;
const DEFAULT_HEIGHT = Math.round(DEFAULT_WIDTH / DEFAULT_ASPECT_RATIO);

const calculateAspectRatio = (
  value?: {
    asset?: {
      _ref?: string;
      metadata?: {
        dimensions?: {
          width?: number;
          height?: number;
        };
      };
    };
  }
): { width: number; height: number } => {
  // Try to get dimensions from asset metadata
  const dimensions = value?.asset?.metadata?.dimensions;
  
  if (dimensions?.width && dimensions?.height && dimensions.width > 0 && dimensions.height > 0) {
    // Calculate aspect ratio from actual dimensions
    const aspectRatio = dimensions.width / dimensions.height;
    // Use default width, calculate height based on actual aspect ratio
    const height = Math.round(DEFAULT_WIDTH / aspectRatio);
    return { width: DEFAULT_WIDTH, height };
  }

  // Fall back to default 16:9 aspect ratio
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
      // Hotspot is automatically respected when using crop mode
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

