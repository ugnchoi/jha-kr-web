import { cache } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { generalPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildSeoMetadata, type SeoFieldset, buildCanonicalUrl } from "@/lib/seo/meta";

type GalleryImage =
  | null
  | undefined
  | (SanityImageSource & {
      caption?: string;
      alt?: string;
    });

type SanityImageWithAlt = SanityImageSource & { alt?: string | null };

interface GalleryPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageWithAlt;
  body?: PortableTextContent;
  gallery?: GalleryImage[];
  seo?: SeoFieldset | null;
}

const PAGE_KEY = "gallery";

const getGalleryPageData = cache(async () => {
  return sanityFetch<GalleryPageData>({
    query: generalPageQuery,
    params: { pageKey: PAGE_KEY },
    tags: ["generalPage", `generalPage:${PAGE_KEY}`],
  });
});

export const generateMetadata = async () => {
  const data = await getGalleryPageData();

  return buildSeoMetadata({
    seo: data?.seo,
    defaultTitle: data?.heroTitle ?? "Gallery",
    defaultDescription: data?.heroSubtitle,
    canonicalPath: "/gallery",
    fallbackOgImage: data?.heroImage,
  });
};

export default async function GalleryPage() {
  const data = await getGalleryPageData();

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">Gallery</h1>
        <p className="mt-4 text-muted-foreground">
          Publish the “Gallery Page” document in Sanity Studio to populate this route.
        </p>
      </div>
    );
  }

  return (
    <article>
      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-muted">
        {data.heroImage && (
          <Image
            src={urlFor(data.heroImage).width(1920).height(800).fit("crop").url()}
            alt={data.heroImage.alt ?? data.heroTitle}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            {data.heroTitle}
          </h1>
          {data.heroSubtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              {data.heroSubtitle}
            </p>
          )}
        </div>
      </section>

      <div className="container space-y-12 py-16">
        {data.body && (
          <section className="prose prose-zinc mx-auto max-w-2xl text-center dark:prose-invert">
            <PortableText value={data.body ?? []} components={portableTextComponents} />
          </section>
        )}

        {data.gallery?.length ? (
          <section>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.gallery.map((image, index) => {
                if (!image || typeof image === "string") {
                  return null;
                }
                const assetRef =
                  typeof image === "object" && "asset" in image
                    ? image.asset?._ref
                    : undefined;
                if (!assetRef) {
                  return null;
                }
                return (
                  <figure
                    key={`${assetRef}-${index}`}
                    className="overflow-hidden rounded-2xl border bg-card/70 shadow-sm"
                  >
                    <Image
                      src={urlFor(image).width(800).height(600).fit("crop").url()}
                      alt={
                        typeof image === "object" ? image.alt || data.heroTitle : data.heroTitle
                      }
                      width={800}
                      height={600}
                      className="h-64 w-full object-cover"
                    />
                    {typeof image === "object" && image.caption && (
                      <figcaption className="px-4 py-3 text-sm text-muted-foreground">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        ) : (
          <p className="text-center text-muted-foreground">
            No gallery entries yet. Upload photos in Sanity to curate this space.
          </p>
        )}
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "홈", url: buildCanonicalUrl("/") },
            { name: data.heroTitle, url: buildCanonicalUrl("/gallery") },
          ])}
        />
      </div>
    </article>
  );
}
