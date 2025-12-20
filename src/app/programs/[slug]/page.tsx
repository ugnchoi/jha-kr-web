import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { Button } from "@/components/ui/button";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { programQuery, programSlugsQuery } from "@/lib/cms/queries";
import { SlugDocument, buildStaticSlugParams, normalizeSlugParam } from "@/lib/utils/slug";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/seo/json-ld";
import { courseJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildSeoMetadata, type SeoFieldset, buildCanonicalUrl } from "@/lib/seo/meta";

type SanityImageWithAlt = SanityImageSource & { alt?: string | null };

interface Program {
  title: string;
  titleEn?: string;
  description?: string;
  mainImage?: SanityImageWithAlt;
  content: PortableTextContent;
  slug?: string;
  seo?: SeoFieldset | null;
}

interface Props {
  params: Promise<{ slug?: string | string[] }>;
}

const getProgram = cache(async (slug: string) =>
  sanityFetch<Program>({
    query: programQuery,
    params: { slug },
    tags: ["program"],
  })
);

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const slugParam = normalizeSlugParam(slug);

  if (!slugParam) {
    return {};
  }

  const program = await getProgram(slugParam);

  if (!program) {
    return {};
  }

  return buildSeoMetadata({
    seo: program.seo,
    defaultTitle: program.title,
    defaultDescription: program.description,
    canonicalPath: `/programs/${slugParam}`,
    fallbackOgImage: program.mainImage,
  });
};

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const slugParam = normalizeSlugParam(slug);

  if (!slugParam) {
    notFound();
  }

  const program = await getProgram(slugParam);

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
            <Image
              src={urlFor(program.mainImage).width(1920).height(1080).fit("crop").url()}
              alt={program.mainImage.alt ?? program.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
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
              <h3 className="mb-4 text-lg font-semibold">관심이 있으신가요?</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                입학 절차와 JHA 공동체에 합류하는 방법을 확인해 보세요.
              </p>
              <Button asChild className="w-full">
                <Link href="/admissions">입학 안내 보기</Link>
              </Button>
            </div>
            
            {/* Additional widgets (FAQ, Contact) could go here */}
          </aside>
        </div>
      </div>
      <JsonLd
        data={courseJsonLd({
          name: program.title,
          description: program.description,
          url: buildCanonicalUrl(`/programs/${slugParam}`),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: buildCanonicalUrl("/") },
          { name: "프로그램", url: buildCanonicalUrl("/programs") },
          { name: program.title, url: buildCanonicalUrl(`/programs/${slugParam}`) },
        ])}
      />
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

