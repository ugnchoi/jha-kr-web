import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityFetch } from "@/sanity/lib/fetch";
import { admissionsPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";

interface AdmissionsPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  ctaLabel?: string;
  ctaLink?: string;
  overview?: any;
  checklist?: { title?: string; description?: string }[];
  timeline?: { title?: string; dateRange?: string; description?: string }[];
  contactEmail?: string;
  contactPhone?: string;
}

export default async function AdmissionsPage() {
  const data = await sanityFetch<AdmissionsPageData>({
    query: admissionsPageQuery,
    tags: ["admissionsPage"],
  });

  if (!data) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">Admissions</h1>
        <p className="mt-4 text-muted-foreground">
          Publish the “Admissions Page” document in Sanity Studio to populate this route.
        </p>
      </div>
    );
  }

  return (
    <article>
      <section className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden bg-muted">
        {data.heroImage && (
          <img
            src={urlFor(data.heroImage).width(1920).height(900).url()}
            alt={data.heroTitle}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            {data.heroTitle}
          </h1>
          {data.heroSubtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              {data.heroSubtitle}
            </p>
          )}
          {data.ctaLabel && data.ctaLink && (
            <Link
              href={data.ctaLink}
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              {data.ctaLabel}
            </Link>
          )}
        </div>
      </section>

      <div className="container space-y-16 py-16">
        {data.overview && (
          <section className="prose prose-zinc max-w-none dark:prose-invert">
            <PortableText value={data.overview} />
          </section>
        )}

        {data.checklist?.length ? (
          <section>
            <h2 className="mb-6 text-3xl font-semibold">Checklist</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {data.checklist.map((item, index) => (
                <div
                  key={`${item.title ?? "item"}-${index}`}
                  className="rounded-xl border bg-card p-6"
                >
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.timeline?.length ? (
          <section>
            <h2 className="mb-6 text-3xl font-semibold">Admissions Timeline</h2>
            <ol className="space-y-6 border-l pl-6">
              {data.timeline.map((milestone, index) => (
                <li key={`${milestone.title ?? "milestone"}-${index}`} className="space-y-2">
                  <div className="text-sm font-semibold text-primary">
                    {milestone.dateRange}
                  </div>
                  <h3 className="text-xl font-semibold">{milestone.title}</h3>
                  {milestone.description && (
                    <p className="text-muted-foreground">{milestone.description}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {(data.contactEmail || data.contactPhone) && (
          <section className="rounded-2xl border bg-muted/50 p-8">
            <h2 className="mb-3 text-2xl font-semibold">Need Help?</h2>
            <p className="text-muted-foreground">
              Our admissions team is ready to guide you each step of the way.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              {data.contactEmail && (
                <p>
                  <span className="font-semibold">Email: </span>
                  <a href={`mailto:${data.contactEmail}`} className="text-primary hover:underline">
                    {data.contactEmail}
                  </a>
                </p>
              )}
              {data.contactPhone && (
                <p>
                  <span className="font-semibold">Phone: </span>
                  <a href={`tel:${data.contactPhone}`} className="text-primary hover:underline">
                    {data.contactPhone}
                  </a>
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
