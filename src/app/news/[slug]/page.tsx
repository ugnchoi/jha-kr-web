import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { Badge } from "@/components/ui/badge";
import { portableTextComponents, type PortableTextContent } from "@/components/blocks/portable-text";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, postSlugsQuery } from "@/lib/cms/queries";
import { SlugDocument, buildStaticSlugParams, normalizeSlugParam } from "@/lib/utils/slug";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/seo/json-ld";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildSeoMetadata, type SeoFieldset, buildCanonicalUrl } from "@/lib/seo/meta";

interface Post {
  title: string;
  publishedAt: string;
  mainImage?: SanityImageSource;
  body: PortableTextContent;
  author?: {
    name: string;
    image?: SanityImageSource;
  };
  categories?: string[];
  slug?: string;
  seo?: SeoFieldset | null;
}

interface Props {
  params: Promise<{ slug?: string | string[] }>;
}

const getPost = cache(async (slug: string) =>
  sanityFetch<Post>({
    query: postQuery,
    params: { slug },
    tags: ["post"],
  })
);

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const slugParam = normalizeSlugParam(slug);

  if (!slugParam) {
    return {};
  }

  const post = await getPost(slugParam);

  if (!post) {
    return {};
  }

  return buildSeoMetadata({
    seo: post.seo,
    defaultTitle: post.title,
    defaultDescription: post.categories?.join(", "),
    canonicalPath: `/news/${slugParam}`,
    fallbackOgImage: post.mainImage,
  });
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const slugParam = normalizeSlugParam(slug);

  if (!slugParam) {
    notFound();
  }

  const post = await getPost(slugParam);

  if (!post) {
    notFound();
  }

  return (
    <article className="container max-w-3xl py-16">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center gap-2">
          {post.categories?.map((category) => (
            <Badge key={category} variant="secondary">
              {category}
            </Badge>
          ))}
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight lg:text-5xl">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(80).height(80).url()}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <span>{post.author.name}</span>
            </div>
          )}
          <time dateTime={post.publishedAt}>
            {format(new Date(post.publishedAt), "MMMM d, yyyy")}
          </time>
        </div>
      </div>

      {post.mainImage && (
        <div className="mb-10 overflow-hidden rounded-lg border bg-muted">
          <Image
            src={urlFor(post.mainImage).width(1200).height(630).url()}
            alt={post.title}
            width={1200}
            height={630}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      )}

      {post.body ? (
        <div className="prose prose-zinc dark:prose-invert lg:prose-lg mx-auto">
          <PortableText value={post.body ?? []} components={portableTextComponents} />
        </div>
      ) : (
        <p className="mx-auto max-w-2xl text-center text-muted-foreground">
          This story is coming soon—check back shortly.
        </p>
      )}
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.categories?.join(", "),
          url: buildCanonicalUrl(`/news/${slugParam}`),
          publishedAt: post.publishedAt,
          image: post.mainImage
            ? urlFor(post.mainImage).width(1200).height(630).url()
            : undefined,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: buildCanonicalUrl("/") },
          { name: "소식", url: buildCanonicalUrl("/news") },
          { name: post.title, url: buildCanonicalUrl(`/news/${slugParam}`) },
        ])}
      />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await sanityFetch<SlugDocument[]>({
    query: postSlugsQuery,
    tags: ["post"],
  });

  return buildStaticSlugParams(posts);
}

