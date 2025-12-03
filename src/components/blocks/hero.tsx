import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "@/components/ui/button";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface HeroProps {
  title: string;
  subtitle?: string;
  image: SanityImageSource;
  ctaLabel?: string;
  ctaLink?: string;
}

export function Hero({ title, subtitle, image, ctaLabel, ctaLink }: HeroProps) {
  return (
    <section className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-black/40" />
        {image && (
          <img
            src={urlFor(image).width(1920).height(1080).quality(80).url()}
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="container relative z-20 flex flex-col items-center text-center text-white">
        <h1 className="mb-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:leading-[1.1]">
          {title}
        </h1>
        {subtitle && (
          <p className="mb-8 max-w-2xl text-lg text-white/90 sm:text-xl">
            {subtitle}
          </p>
        )}
        {ctaLabel && ctaLink && (
          <Button asChild size="lg" className="text-base font-semibold">
            <Link href={ctaLink}>{ctaLabel}</Link>
          </Button>
        )}
      </div>
    </section>
  );
}

