import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homePageQuery } from "@/lib/cms/queries";
import { Hero } from "@/components/blocks/hero";
import { JsonLd } from "@/components/seo/json-ld";
import type { SanityImageSource } from "@sanity/image-url";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { buildSeoMetadata, type SeoFieldset } from "@/lib/seo/meta";
import Link from "next/link";
import { PostCard } from "@/components/blocks/post/post-card";
import { FeaturedVideo } from "@/components/blocks/featured-video";

type FeaturedNewsItem = {
  title: string;
  slug?: string;
  publishedAt?: string;
  mainImage?: SanityImageSource;
  categories?: string[];
};

type SanityImageWithAlt = SanityImageSource & { alt?: string | null };

type FeaturedVideoItem = {
  title?: string;
  youtubeUrl?: string;
};

interface HomePageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage: SanityImageWithAlt;
  heroCtaLabel?: string;
  heroCtaLink?: string;
  featuredNews?: FeaturedNewsItem[];
  featuredVideo?: FeaturedVideoItem | null;
  seo?: SeoFieldset | null;
}

const getHomePageData = cache(async () => {
  return sanityFetch<HomePageData>({
    query: homePageQuery,
    tags: ["homePage"],
  });
});

export const generateMetadata = async () => {
  const data = await getHomePageData();

  return buildSeoMetadata({
    seo: data?.seo,
    defaultTitle: data?.heroTitle ?? "JHA (Korea)",
    defaultDescription: data?.heroSubtitle,
    canonicalPath: "/",
    fallbackOgImage: data?.heroImage,
  });
};

export default async function Home() {
  const data = await getHomePageData();

  // Fallback if no content exists yet (Phase 0 state)
  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">JHA (Korea)에 오신 것을 환영합니다</h1>
        <p className="mt-4 text-muted-foreground">
          Sanity Studio에서 &ldquo;Home Page&rdquo; 문서를 게시해 주세요.
        </p>
      </div>
    );
  }

  const featuredNews = (data.featuredNews ?? []).filter(
    (item): item is Required<Pick<FeaturedNewsItem, "title" | "slug" | "publishedAt">> &
      Omit<FeaturedNewsItem, "title" | "slug" | "publishedAt"> =>
      Boolean(item?.title) && Boolean(item?.slug) && Boolean(item?.publishedAt)
  );

  const featuredVideo =
    data.featuredVideo?.title && data.featuredVideo.youtubeUrl
      ? { title: data.featuredVideo.title, youtubeUrl: data.featuredVideo.youtubeUrl }
      : null;

  return (
    <div className="flex flex-col">
      <Hero
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        image={data.heroImage}
        ctaLabel={data.heroCtaLabel}
        ctaLink={data.heroCtaLink}
      />

      <section className="container py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">최신 소식</h2>
          <Link
            href="/news"
            className="rounded-sm text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            전체 보기
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredNews.length > 0 ? (
            featuredNews.map((news) => (
              <PostCard
                key={news.slug}
                title={news.title}
                slug={news.slug}
                publishedAt={news.publishedAt}
                mainImage={news.mainImage}
                categories={news.categories}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              아직 등록된 소식이 없습니다.
            </div>
          )}
        </div>
      </section>

      {featuredVideo ? (
        <FeaturedVideo title={featuredVideo.title} youtubeUrl={featuredVideo.youtubeUrl} />
      ) : null}
      <JsonLd data={organizationJsonLd()} />
    </div>
  );
}
