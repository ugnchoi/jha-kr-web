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
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          Co-op Communities
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground lg:text-lg">
          Explore how our Monday and Saturday co-ops gather families for shared learning,
          discipleship, and community support.
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
            No Co-op hubs yet. Publish content in Sanity to see it here.
          </div>
        )}
      </div>
    </div>
  );
}
