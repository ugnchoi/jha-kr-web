import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { Button } from "@/components/ui/button";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { programQuery, programSlugsQuery } from "@/lib/cms/queries";
import { SlugDocument, buildStaticSlugParams, normalizeSlugParam } from "@/lib/utils/slug";
import { urlFor } from "@/sanity/lib/image";

interface Program {
  title: string;
  titleEn?: string;
  description?: string;
  mainImage?: SanityImageSource;
  content: PortableTextContent;
}

interface Props {
  params: Promise<{ slug?: string | string[] }>;
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const slugParam = normalizeSlugParam(slug);

  if (!slugParam) {
    notFound();
  }

  const program = await sanityFetch<Program>({
    query: programQuery,
    params: { slug: slugParam },
    tags: ["program"],
  });

  if (!program) {
    notFound();
  }

  return (
    <article>
      {/* Hero Section */}
      <div className="relative flex min-h-[400px] w-full items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-black/50" />
          {program.mainImage && (
            <img
              src={urlFor(program.mainImage).width(1920).height(1080).url()}
              alt={program.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="container relative z-20 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {program.title}
          </h1>
          {program.titleEn && (
            <p className="text-xl font-medium text-white/80 sm:text-2xl">
              {program.titleEn}
            </p>
          )}
        </div>
      </div>

      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Main Content */}
          <div>
            {program.description && (
              <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                {program.description}
              </p>
            )}
            <div className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
              <PortableText
                value={program.content ?? []}
                components={portableTextComponents}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="rounded-lg border bg-muted/50 p-6">
              <h3 className="mb-4 text-lg font-semibold">Interested?</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Learn more about our admissions process and how to join the JHA community.
              </p>
              <Button asChild className="w-full">
                <Link href="/admissions">Admissions Info</Link>
              </Button>
            </div>
            
            {/* Additional widgets (FAQ, Contact) could go here */}
          </aside>
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const programs = await sanityFetch<SlugDocument[]>({
    query: programSlugsQuery,
    tags: ["program"],
  });

  return buildStaticSlugParams(programs);
}

