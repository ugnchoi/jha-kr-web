import { sanityFetch } from "@/sanity/lib/fetch";
import { programsQuery } from "@/lib/cms/queries";
import { ProgramCard, type ProgramCardProps } from "@/components/blocks/program/program-card";

export default async function ProgramsPage() {
  const programs = await sanityFetch<ProgramCardProps[]>({
    query: programsQuery,
    tags: ["program"],
  });

  return (
    <div className="container py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          프로그램 소개
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground lg:text-lg">
          신앙과 인격, 지성을 함께 키우는 전인적 교육 과정을 만나보세요.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {programs.length > 0 ? (
          programs.map((program) => (
            <ProgramCard
              key={program.slug}
              title={program.title}
              titleEn={program.titleEn}
              slug={program.slug}
              description={program.description}
              mainImage={program.mainImage}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            아직 등록된 프로그램이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
