import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ProgramCardProps {
  title: string;
  titleEn?: string;
  slug: string;
  description?: string;
  mainImage?: SanityImageSource;
}

export function ProgramCard({ title, titleEn, slug, description, mainImage }: ProgramCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/programs/${slug}`} className="block h-56 overflow-hidden bg-muted">
        {mainImage ? (
          <img
            src={urlFor(mainImage).width(600).height(400).url()}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            No Image
          </div>
        )}
      </Link>
      <CardHeader className="p-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        {titleEn && <p className="text-sm font-medium text-muted-foreground">{titleEn}</p>}
      </CardHeader>
      <CardContent className="flex-1 px-6 pb-2">
        <p className="line-clamp-3 text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-4">
        <Button asChild className="w-full">
          <Link href={`/programs/${slug}`}>프로그램 살펴보기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

