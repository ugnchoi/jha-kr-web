import { cache } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { generalPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { buildSeoMetadata, type SeoFieldset, buildCanonicalUrl } from "@/lib/seo/meta";
import { portableTextToPlain } from "@/lib/sanity/text";

interface FaqItem {
  question?: string;
  answer?: PortableTextContent;
}

type SanityImageWithAlt = SanityImageSource & { alt?: string | null };

interface FaqPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageWithAlt;
  body?: PortableTextContent;
  faqItems?: FaqItem[];
  seo?: SeoFieldset | null;
}

const PAGE_KEY = "faq";

const getFaqPageData = cache(async () => {
  return sanityFetch<FaqPageData>({
    query: generalPageQuery,
    params: { pageKey: PAGE_KEY },
    tags: ["generalPage", `generalPage:${PAGE_KEY}`],
  });
});

export const generateMetadata = async () => {
  const data = await getFaqPageData();

  return buildSeoMetadata({
    seo: data?.seo,
    defaultTitle: data?.heroTitle ?? "자주 묻는 질문",
    defaultDescription: data?.heroSubtitle,
    canonicalPath: "/faq",
    fallbackOgImage: data?.heroImage,
  });
};

export default async function FaqPage() {
  const data = await getFaqPageData();

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">자주 묻는 질문</h1>
        <p className="mt-4 text-muted-foreground">
          Sanity Studio에서 “FAQ Page” 문서를 게시해 주세요.
        </p>
      </div>
    );
  }

  return (
    <article>
      <section className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-muted">
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
                    <PortableText value={faq.answer ?? []} components={portableTextComponents} />
                  </div>
                )}
              </details>
            ))}
          </section>
        ) : (
          <p className="text-center text-muted-foreground">
            아직 등록된 FAQ가 없습니다. 자주 묻는 질문을 Sanity에 추가해 주세요.
          </p>
        )}
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "홈", url: buildCanonicalUrl("/") },
            { name: data.heroTitle, url: buildCanonicalUrl("/faq") },
          ])}
        />
        <JsonLd
          data={
            data.faqItems?.length
              ? faqJsonLd(
                  data.faqItems
                    .map((faq) => {
                      const answerText = portableTextToPlain(faq.answer);

                      if (!faq.question || !answerText) {
                        return null;
                      }

                      return {
                        question: faq.question,
                        answer: answerText,
                      };
                    })
                    .filter((item): item is { question: string; answer: string } => !!item)
                )
              : null
          }
        />
      </div>
    </article>
  );
}
