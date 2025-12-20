import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CoopCardProps {
  title: string;
  slug: string;
  day?: string;
  description?: string;
  heroImage?: SanityImageSource;
}

export function CoopCard({
  title,
  slug,
  day,
  description,
  heroImage,
}: CoopCardProps) {
  const imageUrl = heroImage ? urlFor(heroImage).width(600).height(400).url() : null;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/coop/${slug}`} className="block h-48 overflow-hidden bg-muted">
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
      <CardHeader className="flex gap-3 p-6 pb-3">
        {day && (
          <Badge variant="secondary" className="w-fit uppercase">
            {day}
          </Badge>
        )}
        <Link href={`/coop/${slug}`}>
          <h3 className="text-2xl font-bold leading-tight hover:underline">
            {title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-2 text-muted-foreground">
        <p className="line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6">
        <Link
          href={`/coop/${slug}`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          코업 자세히 보기
        </Link>
      </CardFooter>
    </Card>
  );
}

