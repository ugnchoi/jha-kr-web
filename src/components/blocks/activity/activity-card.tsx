import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ActivityCardProps {
  title: string;
  slug: string;
  category?: string;
  description?: string;
  featuredImage?: SanityImageSource;
}

export function ActivityCard({
  title,
  slug,
  category,
  description,
  featuredImage,
}: ActivityCardProps) {
  const imageUrl = featuredImage
    ? urlFor(featuredImage).width(600).height(400).url()
    : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link
        href={`/activities#${slug}`}
        className="block h-48 overflow-hidden bg-muted"
      >
        {imageUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            이미지 없음
          </div>
        )}
      </Link>
      <CardHeader className="flex gap-3 p-6 pb-3">
        {category && (
          <Badge variant="outline" className="uppercase">
            {category}
          </Badge>
        )}
        <h3 className="text-2xl font-bold leading-tight">{title}</h3>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-2 text-muted-foreground">
        <p className="line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Link
          href={`/activities#${slug}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          자세히 보기
        </Link>
      </CardFooter>
    </Card>
  );
}

