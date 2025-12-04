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

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?._type || value._type !== "image" || !value.asset?._ref) {
        return null;
      }

      const imageUrl = urlFor(value)
        .width(1600)
        .height(900)
        .fit("max")
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
          <img
            src={imageUrl}
            alt={alt}
            className="h-auto w-full object-cover"
            loading="lazy"
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

