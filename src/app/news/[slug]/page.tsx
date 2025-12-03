import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery } from "@/lib/cms/queries";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "@/components/ui/badge";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Post {
  title: string;
  publishedAt: string;
  mainImage?: SanityImageSource;
  body: any;
  author?: {
    name: string;
    image?: SanityImageSource;
  };
  categories?: string[];
}

interface Props {
  params: { slug: string };
}

export default async function PostPage({ params }: Props) {
  const post = await sanityFetch<Post>({
    query: postQuery,
    params: { slug: params.slug },
    tags: ["post"],
  });

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
                 <img
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full object-cover"
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
          <img
            src={urlFor(post.mainImage).width(1200).height(630).url()}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-zinc dark:prose-invert lg:prose-lg mx-auto">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}

