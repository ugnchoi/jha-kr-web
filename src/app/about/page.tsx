import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityFetch } from "@/sanity/lib/fetch";
import { generalPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";

interface Highlight {
  title?: string;
  description?: string;
}

interface AboutPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  body?: any;
  highlights?: Highlight[];
}

const PAGE_KEY = "about";

export default async function AboutPage() {
  const data = await sanityFetch<AboutPageData>({
    query: generalPageQuery,
    params: { pageKey: PAGE_KEY },
    tags: ["generalPage", `generalPage:${PAGE_KEY}`],
  });

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">About JHA</h1>
        <p className="mt-4 text-muted-foreground">
          Publish the “About Page” document in Sanity Studio to populate this route.
        </p>
      </div>
    );
  }

  return (
    <article>
      <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-muted">
        {data.heroImage && (
          <img
            src={urlFor(data.heroImage).width(1920).height(900).url()}
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

      <div className="container space-y-16 py-16">
        {data.body && (
          <section className="prose prose-zinc mx-auto max-w-3xl dark:prose-invert lg:prose-lg">
            <PortableText value={data.body} />
          </section>
        )}

        {data.highlights?.length ? (
          <section>
            <h2 className="mb-8 text-3xl font-semibold tracking-tight">
              What Sets Us Apart
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.highlights.map((highlight, index) => (
                <div
                  key={`${highlight.title ?? "highlight"}-${index}`}
                  className="rounded-2xl border bg-card/60 p-6 text-left shadow-sm"
                >
                  <h3 className="text-xl font-semibold">{highlight.title}</h3>
                  {highlight.description && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {highlight.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
