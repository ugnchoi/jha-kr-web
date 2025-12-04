import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityFetch } from "@/sanity/lib/fetch";
import { generalPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";

type GalleryImage =
  | null
  | undefined
  | (SanityImageSource & {
      caption?: string;
      alt?: string;
    });

interface GalleryPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  body?: any;
  gallery?: GalleryImage[];
}

const PAGE_KEY = "gallery";

export default async function GalleryPage() {
  const data = await sanityFetch<GalleryPageData>({
    query: generalPageQuery,
    params: { pageKey: PAGE_KEY },
    tags: ["generalPage", `generalPage:${PAGE_KEY}`],
  });

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
          <img
            src={urlFor(data.heroImage).width(1920).height(800).url()}
            alt={data.heroTitle}
            className="absolute inset-0 h-full w-full object-cover"
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
            <PortableText value={data.body} />
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
                    <img
                      src={urlFor(image).width(800).height(600).fit("crop").url()}
                      alt={typeof image === "object" ? image.alt || data.heroTitle : data.heroTitle}
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
      </div>
    </article>
  );
}
