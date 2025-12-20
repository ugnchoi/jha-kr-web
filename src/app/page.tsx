import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homePageQuery } from "@/lib/cms/queries";
import { Hero } from "@/components/blocks/hero";
import { JsonLd } from "@/components/seo/json-ld";
import type { SanityImageSource } from "@sanity/image-url";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import { buildSeoMetadata, type SeoFieldset } from "@/lib/seo/meta";

type FeaturedNewsItem = {
  _id?: string;
  title: string;
  slug?: string | null;
};

type SanityImageWithAlt = SanityImageSource & { alt?: string | null };

interface HomePageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage: SanityImageWithAlt;
  heroCtaLabel?: string;
  heroCtaLink?: string;
  featuredNews?: FeaturedNewsItem[];
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
        <h1 className="text-4xl font-bold">Welcome to JHA (Korea)</h1>
        <p className="mt-4 text-muted-foreground">
          Please publish the &ldquo;Home Page&rdquo; document in Sanity Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Hero
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        image={data.heroImage}
        ctaLabel={data.heroCtaLabel}
        ctaLink={data.heroCtaLink}
      />
      
      {/* Featured News Section Placeholder */}
      <section className="container py-16">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">Latest News</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
           {data.featuredNews?.length ? (
            data.featuredNews.map((news, index) => (
              <div
                key={news.slug ?? news._id ?? `featured-news-${index}`}
                className="rounded-lg border p-4"
              >
                 <h3 className="font-bold">{news.title}</h3>
               </div>
             ))
           ) : (
             <p className="text-muted-foreground">No news yet.</p>
           )}
        </div>
      </section>
      <JsonLd data={organizationJsonLd()} />
    </div>
  );
}
