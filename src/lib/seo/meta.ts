import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jha.kr";

export const siteMetadata = {
  siteName: "JHA (Korea)",
  baseUrl: defaultSiteUrl,
  description: "SEO-first, CMS-driven website for Jubilee Homeschool Academy in Korea.",
  locale: "ko-KR",
  twitterHandle: "@jhakorea",
};

export const buildCanonicalUrl = (path = "/") => {
  try {
    const url = new URL(path, siteMetadata.baseUrl);

    return url.toString();
  } catch {
    return siteMetadata.baseUrl;
  }
};

export const buildDefaultMetadata = (): Metadata => ({
  metadataBase: new URL(siteMetadata.baseUrl),
  title: {
    default: siteMetadata.siteName,
    template: `%s | ${siteMetadata.siteName}`,
  },
  description: siteMetadata.description,
  applicationName: siteMetadata.siteName,
  authors: [{ name: siteMetadata.siteName }],
  alternates: {
    canonical: buildCanonicalUrl(),
  },
  keywords: [
    "홈스쿨",
    "코업",
    "JHA",
    "Jubilee Homeschool Academy",
    "Christian Education",
    "입학 안내",
  ],
  openGraph: {
    title: siteMetadata.siteName,
    description: siteMetadata.description,
    url: siteMetadata.baseUrl,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: siteMetadata.twitterHandle,
    site: siteMetadata.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
});

export type SeoFieldset = {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SanityImageSource;
  canonical?: string;
  noindex?: boolean;
};

type BuildSeoMetadataParams = {
  seo?: SeoFieldset | null;
  defaultTitle?: string | null;
  defaultDescription?: string | null;
  canonicalPath?: string;
  fallbackOgImage?: SanityImageSource | null;
};

const buildOgImageUrl = (image?: SanityImageSource | null) => {
  if (!image) {
    return undefined;
  }

  return urlFor(image).width(1200).height(630).fit("crop").auto("format").url();
};

export const buildSeoMetadata = ({
  seo,
  defaultTitle,
  defaultDescription,
  canonicalPath = "/",
  fallbackOgImage,
}: BuildSeoMetadataParams): Metadata => {
  const title = seo?.metaTitle ?? defaultTitle ?? siteMetadata.siteName;
  const description = seo?.metaDescription ?? defaultDescription ?? siteMetadata.description;
  const canonical = seo?.canonical ?? buildCanonicalUrl(canonicalPath);
  const baseMetadata = buildDefaultMetadata();
  const ogImageUrl = buildOgImageUrl(seo?.ogImage ?? fallbackOgImage);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url: canonical,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    robots: seo?.noindex
      ? {
          index: false,
          follow: false,
        }
      : baseMetadata.robots,
  };
};


