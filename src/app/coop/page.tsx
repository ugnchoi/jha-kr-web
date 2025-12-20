import { sanityFetch } from "@/sanity/lib/fetch";
import { coopsQuery } from "@/lib/cms/queries";
import { CoopCard, type CoopCardProps } from "@/components/blocks/coop/coop-card";

export default async function CoopPage() {
  const coops = await sanityFetch<CoopCardProps[]>({
    query: coopsQuery,
    tags: ["coop"],
  });

  return (
    <div className="container py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">코업 커뮤니티</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground lg:text-lg">
          월요일·토요일 코업이 가족들이 함께 배우고 제자훈련하며 서로를 돕는 방법을 살펴보세요.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {coops.length ? (
          coops.map((coop) => (
            <CoopCard
              key={coop.slug}
              title={coop.title}
              slug={coop.slug}
              day={coop.day}
              description={coop.description}
              heroImage={coop.heroImage}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            아직 등록된 코업이 없습니다. Sanity에 콘텐츠를 게시해 주세요.
          </div>
        )}
      </div>
    </div>
  );
}
