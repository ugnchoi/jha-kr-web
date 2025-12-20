import { sanityFetch } from "@/sanity/lib/fetch";
import { postsQuery } from "@/lib/cms/queries";
import { PostCard, type PostCardProps } from "@/components/blocks/post/post-card";

export default async function NewsPage() {
  const posts = await sanityFetch<PostCardProps[]>({
    query: postsQuery,
    tags: ["post"],
  });

  return (
    <div className="container py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          소식 및 공지
        </h1>
        <p className="text-muted-foreground lg:text-lg">
          커뮤니티의 최신 공지, 이벤트, 이야기들을 확인하세요.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.slug}
              title={post.title}
              slug={post.slug}
              publishedAt={post.publishedAt}
              mainImage={post.mainImage}
              categories={post.categories}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            아직 등록된 소식이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
