import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
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
  const imageUrl = mainImage ? urlFor(mainImage).width(400).height(300).url() : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/news/${slug}`} className="block h-48 overflow-hidden bg-muted">
        {imageUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            이미지 없음
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
          {format(new Date(publishedAt), "yyyy년 M월 d일", { locale: ko })}
        </time>
      </CardFooter>
    </Card>
  );
}

