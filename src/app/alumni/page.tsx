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

interface Highlight {
  title?: string;
  description?: string;
}

type SanityImageWithAlt = SanityImageSource & { alt?: string | null };

interface AlumniPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageWithAlt;
  body?: PortableTextContent;
  highlights?: Highlight[];
  seo?: SeoFieldset | null;
}

const PAGE_KEY = "alumni";

const getAlumniPageData = cache(async () => {
  return sanityFetch<AlumniPageData>({
    query: generalPageQuery,
    params: { pageKey: PAGE_KEY },
    tags: ["generalPage", `generalPage:${PAGE_KEY}`],
  });
});

export const generateMetadata = async () => {
  const data = await getAlumniPageData();

  return buildSeoMetadata({
    seo: data?.seo,
    defaultTitle: data?.heroTitle ?? "동문",
    defaultDescription: data?.heroSubtitle,
    canonicalPath: "/alumni",
    fallbackOgImage: data?.heroImage,
  });
};

export default async function AlumniPage() {
  const data = await getAlumniPageData();

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">동문 네트워크</h1>
        <p className="mt-4 text-muted-foreground">
          Sanity Studio에서 “Alumni Page” 문서를 게시해 주세요.
        </p>
      </div>
    );
  }

  return (
    <article>
      <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-muted">
        {data.heroImage && (
          <Image
            src={urlFor(data.heroImage).width(1920).height(900).fit("crop").url()}
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

      <div className="container space-y-16 py-16">
        {data.body && (
          <section className="prose prose-zinc mx-auto max-w-3xl text-center dark:prose-invert">
            <PortableText value={data.body ?? []} components={portableTextComponents} />
          </section>
        )}

        {data.highlights?.length ? (
          <section>
            <h2 className="mb-8 text-3xl font-semibold text-center">JHA 가족 이야기</h2>
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
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "홈", url: buildCanonicalUrl("/") },
            { name: data.heroTitle, url: buildCanonicalUrl("/alumni") },
          ])}
        />
      </div>
    </article>
  );
}
