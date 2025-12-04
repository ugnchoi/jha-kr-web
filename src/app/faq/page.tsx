import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { generalPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";

interface FaqItem {
  question?: string;
  answer?: PortableTextContent;
}

interface FaqPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  body?: PortableTextContent;
  faqItems?: FaqItem[];
}

const PAGE_KEY = "faq";

export default async function FaqPage() {
  const data = await sanityFetch<FaqPageData>({
    query: generalPageQuery,
    params: { pageKey: PAGE_KEY },
    tags: ["generalPage", `generalPage:${PAGE_KEY}`],
  });

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="mt-4 text-muted-foreground">
          Publish the “FAQ Page” document in Sanity Studio to populate this route.
        </p>
      </div>
    );
  }

  return (
    <article>
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-muted">
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
            <PortableText value={data.body} components={portableTextComponents} />
          </section>
        )}

        {data.faqItems?.length ? (
          <section className="mx-auto max-w-3xl space-y-4">
            {data.faqItems.map((faq, index) => (
              <details
                key={`${faq.question ?? "faq"}-${index}`}
                className="rounded-xl border bg-card/70 p-4"
              >
                <summary className="cursor-pointer text-lg font-semibold focus:outline-none">
                  {faq.question}
                </summary>
                {faq.answer && (
                  <div className="prose prose-zinc mt-3 text-sm text-muted-foreground dark:prose-invert">
                    <PortableText value={faq.answer} components={portableTextComponents} />
                  </div>
                )}
              </details>
            ))}
          </section>
        ) : (
          <p className="text-center text-muted-foreground">
            No FAQs yet. Add entries in Sanity to answer common questions.
          </p>
        )}
      </div>
    </article>
  );
}
