import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { Button } from "@/components/ui/button";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { admissionsPageQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";

interface ChecklistItem {
  title?: string;
  description?: string;
}

interface TimelineItem {
  title?: string;
  dateRange?: string;
  description?: string;
}

interface AdmissionsPageData {
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: SanityImageSource;
  ctaLabel?: string;
  ctaLink?: string;
  overview?: PortableTextContent;
  checklist?: ChecklistItem[];
  timeline?: TimelineItem[];
  contactEmail?: string;
  contactPhone?: string;
}

const DEFAULT_CTA_LINK = "/contact";

export default async function AdmissionsPage() {
  const data = await sanityFetch<AdmissionsPageData>({
    query: admissionsPageQuery,
    tags: ["admissionsPage"],
  });

  if (!data) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">Admissions Information Coming Soon</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Publish the "Admissions Page" document in Sanity Studio to populate this page with hero,
          overview, checklist, and timeline content.
        </p>
      </section>
    );
  }

  const heroImage = data.heroImage ? urlFor(data.heroImage).width(1920).height(960).url() : null;
  const ctaLabel = data.ctaLabel ?? "입학 지원 시작하기";
  const ctaHref = data.ctaLink ?? DEFAULT_CTA_LINK;

  return (
    <article className="flex flex-col">
      <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-muted">
        {heroImage && (
          <img src={heroImage} alt={data.heroTitle} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="container relative z-10 text-center text-white">
          <p className="text-sm uppercase tracking-[0.4em] text-white/70">Admissions</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight lg:text-5xl">{data.heroTitle}</h1>
          {data.heroSubtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{data.heroSubtitle}</p>
          )}
          <div className="mt-10 flex items-center justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container space-y-16 py-16">
        {data.overview && (
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight">Overview</h2>
            <div className="prose prose-zinc mx-auto dark:prose-invert">
              <PortableText value={data.overview ?? []} components={portableTextComponents} />
            </div>
          </section>
        )}

        {data.checklist?.length ? (
          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Checklist
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">Prepare your application</h2>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {data.checklist.map((item, index) => (
                <div
                  key={`${item.title ?? "check"}-${index}`}
                  className="rounded-2xl border bg-card/70 p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {data.timeline?.length ? (
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Timeline
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Key dates & milestones</h2>

            <div className="mt-10 space-y-8 border-l-2 border-border pl-6">
              {data.timeline.map((milestone, index) => (
                <div key={`${milestone.title ?? "milestone"}-${index}`} className="relative pl-6">
                  <span className="absolute -left-[29px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                    {milestone.dateRange}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">{milestone.title}</h3>
                  {milestone.description && (
                    <p className="mt-2 text-muted-foreground">{milestone.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {(data.contactEmail || data.contactPhone) && (
          <section className="rounded-3xl border bg-muted/30 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Contact Admissions
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">We&rsquo;re here to help</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Reach out to our admissions team with any questions about applications, tuition, or campus visits.
            </p>
            <div className="mt-8 flex flex-col gap-4 text-lg text-foreground sm:flex-row sm:items-center sm:justify-center">
              {data.contactEmail && (
                <Link
                  href={`mailto:${data.contactEmail}`}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {data.contactEmail}
                </Link>
              )}
              {data.contactPhone && (
                <Link
                  href={`tel:${data.contactPhone}`}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {data.contactPhone}
                </Link>
              )}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}