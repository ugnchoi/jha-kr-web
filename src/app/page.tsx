import { sanityFetch } from "@/sanity/lib/fetch";
import { homePageQuery } from "@/lib/cms/queries";
import { Hero } from "@/components/blocks/hero";
import type { SanityImageSource } from "@sanity/image-url";

interface HomePageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage: SanityImageSource;
  heroCtaLabel?: string;
  heroCtaLink?: string;
  featuredNews?: any[]; // We can define strict types later
}

export default async function Home() {
  const data = await sanityFetch<HomePageData>({
    query: homePageQuery,
    tags: ["homePage"],
  });

  // Fallback if no content exists yet (Phase 0 state)
  if (!data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">Welcome to JHA (Korea)</h1>
        <p className="mt-4 text-muted-foreground">
          Please publish the "Home Page" document in Sanity Studio.
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
             data.featuredNews.map((news) => (
               <div key={news.slug?.current} className="rounded-lg border p-4">
                 <h3 className="font-bold">{news.title}</h3>
               </div>
             ))
           ) : (
             <p className="text-muted-foreground">No news yet.</p>
           )}
        </div>
      </section>
    </div>
  );
}
