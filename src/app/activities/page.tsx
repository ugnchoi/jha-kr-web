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
          Activities & Enrichment
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground lg:text-lg">
          Programs that cultivate creativity, leadership, service, and worship within the JHA community.
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
            No activities yet. Publish Activity documents in Sanity to see them here.
          </div>
        )}
      </div>
    </div>
  );
}
