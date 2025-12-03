import Link from "next/link";
import { format } from "date-fns";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PostCardProps {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  mainImage?: SanityImageSource;
  categories?: string[];
}

export function PostCard({ title, slug, publishedAt, mainImage, categories }: PostCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/news/${slug}`} className="block h-48 overflow-hidden bg-muted">
        {mainImage ? (
          <img
            src={urlFor(mainImage).width(400).height(300).url()}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </Link>
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        <Link href={`/news/${slug}`}>
          <h3 className="line-clamp-2 text-xl font-bold leading-tight hover:underline">
            {title}
          </h3>
        </Link>
      </CardHeader>
      <CardFooter className="mt-auto p-4 pt-0 text-sm text-muted-foreground">
        <time dateTime={publishedAt}>
          {format(new Date(publishedAt), "MMMM d, yyyy")}
        </time>
      </CardFooter>
    </Card>
  );
}

