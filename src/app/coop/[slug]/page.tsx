import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityFetch } from "@/sanity/lib/fetch";
import { coopQuery, coopSlugsQuery } from "@/lib/cms/queries";
import { SlugDocument, buildStaticSlugParams, normalizeSlugParam } from "@/lib/utils/slug";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/badge";
import { ActivityCard } from "@/components/blocks/activity/activity-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildSeoMetadata, type SeoFieldset, buildCanonicalUrl } from "@/lib/seo/meta";

interface CoopData {
  title: string;
  slug?: string;
  day?: string;
  description?: string;
  heroImage?: SanityImageSource;
  announcements?: {
    title: string;
    slug?: string;
    publishedAt?: string;
  }[];
  activities?: {
    title: string;
    slug: string;
    category?: string;
    description?: string;
    featuredImage?: SanityImageSource;
  }[];
  seo?: SeoFieldset | null;
}

interface CoopPageProps {
  params: Promise<{ slug?: string | string[] }>;
}

const getCoop = cache(async (slug: string) =>
  sanityFetch<CoopData>({
    query: coopQuery,
    params: { slug },
    tags: ["coop"],
  })
);

export const generateMetadata = async ({ params }: CoopPageProps) => {
  const { slug } = await params;
  const slugParam = normalizeSlugParam(slug);

  if (!slugParam) {
    return {};
  }

  const data = await getCoop(slugParam);

  if (!data) {
    return {};
  }

  return buildSeoMetadata({
    seo: data.seo,
    defaultTitle: data.title,
    defaultDescription: data.description,
    canonicalPath: `/coop/${slugParam}`,
    fallbackOgImage: data.heroImage,
  });
};

export default async function CoopDetailPage({ params }: CoopPageProps) {
  const { slug } = await params;
  const slugParam = normalizeSlugParam(slug);

  if (!slugParam) {
    notFound();
  }

  const data = await getCoop(slugParam);

  if (!data) {
    notFound();
  }

  return (
    <article>
      <div className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden bg-muted">
        {data.heroImage && (
          <Image
            src={urlFor(data.heroImage).width(1920).height(800).url()}
            alt={data.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 text-center text-white">
          {data.day && (
            <Badge
              variant="secondary"
              className="mx-auto mb-4 w-fit uppercase text-sm tracking-wide"
            >
              {data.day}
            </Badge>
          )}
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            {data.title}
          </h1>
          {data.description && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              {data.description}
            </p>
          )}
        </div>
      </div>

      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <section>
            <h2 className="mb-6 text-3xl font-semibold">Activities</h2>
            {data.activities?.length ? (
              <div className="grid gap-6 md:grid-cols-2">
                {data.activities.map((activity) => (
                  <ActivityCard
                    key={activity.slug}
                    title={activity.title}
                    slug={activity.slug}
                    category={activity.category}
                    description={activity.description}
                    featuredImage={activity.featuredImage}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No featured activities yet. Add them in Sanity.
              </p>
            )}
          </section>

          <aside className="space-y-8">
            <section className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">Announcements</h3>
              {data.announcements?.length ? (
                <ul className="space-y-4 text-sm">
                  {data.announcements.map((announcement) => (
                    <li key={announcement.slug}>
                      <Link
                        href={announcement.slug ? `/news/${announcement.slug}` : "/news"}
                        className="font-medium text-primary hover:underline"
                      >
                        {announcement.title}
                      </Link>
                      {announcement.publishedAt && (
                        <p className="text-muted-foreground">
                          {new Date(announcement.publishedAt).toLocaleDateString()}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No announcements yet. Reference News posts in Sanity to feature them here.
                </p>
              )}
            </section>
            <section className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-semibold">Join the Co-op</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Want to participate? Reach out through our admissions page to find the best
                pathway for your family.
              </p>
              <Link
                href="/admissions"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Admissions &rarr;
              </Link>
            </section>
          </aside>
        </div>
      </div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: buildCanonicalUrl("/") },
          { name: "코업", url: buildCanonicalUrl("/coop") },
          { name: data.title, url: buildCanonicalUrl(`/coop/${slugParam}`) },
        ])}
      />
    </article>
  );
}

export async function generateStaticParams() {
  const coops = await sanityFetch<SlugDocument[]>({
    query: coopSlugsQuery,
    tags: ["coop"],
  });

  return buildStaticSlugParams(coops);
}

