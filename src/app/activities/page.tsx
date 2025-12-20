import { sanityFetch } from "@/sanity/lib/fetch";
import { activitiesQuery } from "@/lib/cms/queries";
import { ActivityCard, type ActivityCardProps } from "@/components/blocks/activity/activity-card";

export default async function ActivitiesPage() {
  const activities = await sanityFetch<ActivityCardProps[]>({
    query: activitiesQuery,
    tags: ["activity"],
  });

  return (
    <div className="container py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          활동 및 배움
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground lg:text-lg">
          JHA 공동체 안에서 창의성, 리더십, 섬김, 예배를 기르는 다양한 프로그램을 만나보세요.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {activities.length ? (
          activities.map((activity) => (
            <ActivityCard
              key={activity.slug}
              title={activity.title}
              slug={activity.slug}
              category={activity.category}
              description={activity.description}
              featuredImage={activity.featuredImage}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            아직 등록된 활동이 없습니다. Sanity에서 Activity 문서를 게시해 주세요.
          </div>
        )}
      </div>
    </div>
  );
}
