import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  coopSlugsQuery,
  postSlugsQuery,
  programSlugsQuery,
} from "@/lib/cms/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jha.kr";

const staticRoutes = [
  "/",
  "/about",
  "/activities",
  "/admissions",
  "/alumni",
  "/coop",
  "/faq",
  "/gallery",
  "/news",
  "/programs",
];

const buildUrl = (path: string) => new URL(path, baseUrl).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, programs, coops] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: postSlugsQuery,
      tags: ["post"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: programSlugsQuery,
      tags: ["program"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: coopSlugsQuery,
      tags: ["coop"],
    }),
  ]);

  const lastModified = new Date();

  const newsEntries = (posts ?? []).map(({ slug }) => ({
    url: buildUrl(`/news/${slug}`),
    lastModified,
  }));
  const programEntries = (programs ?? []).map(({ slug }) => ({
    url: buildUrl(`/programs/${slug}`),
    lastModified,
  }));
  const coopEntries = (coops ?? []).map(({ slug }) => ({
    url: buildUrl(`/coop/${slug}`),
    lastModified,
  }));

  return [
    ...staticRoutes.map((path) => ({
      url: buildUrl(path),
      lastModified,
    })),
    ...newsEntries,
    ...programEntries,
    ...coopEntries,
  ];
}


