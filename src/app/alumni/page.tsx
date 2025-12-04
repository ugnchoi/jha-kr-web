import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { generalPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";

interface Highlight {
  title?: string;
  description?: string;
}

interface AlumniPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  body?: PortableTextContent;
  highlights?: Highlight[];
}

const PAGE_KEY = "alumni";

export default async function AlumniPage() {
  const data = await sanityFetch<AlumniPageData>({
    query: generalPageQuery,
    params: { pageKey: PAGE_KEY },
    tags: ["generalPage", `generalPage:${PAGE_KEY}`],
  });

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">Alumni Network</h1>
        <p className="mt-4 text-muted-foreground">
          Publish the “Alumni Page” document in Sanity Studio to populate this route.
        </p>
      </div>
    );
  }

  return (
    <article>
      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-muted">
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
          <section className="prose prose-zinc mx-auto max-w-3xl text-center dark:prose-invert">
            <PortableText value={data.body} components={portableTextComponents} />
          </section>
        )}

        {data.highlights?.length ? (
          <section>
            <h2 className="mb-8 text-3xl font-semibold text-center">
              Stories From the JHA Family
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {data.highlights.map((story, index) => (
                <div
                  key={`${story.title ?? "story"}-${index}`}
                  className="rounded-2xl border bg-card/60 p-6 shadow-sm"
                >
                  <h3 className="text-xl font-semibold">{story.title}</h3>
                  {story.description && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      {story.description}
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
