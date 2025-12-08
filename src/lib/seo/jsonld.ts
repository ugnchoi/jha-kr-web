type JsonLd = Record<string, unknown>;

const withContext = (data: JsonLd): JsonLd => ({
  "@context": "https://schema.org",
  ...data,
});

export const organizationJsonLd = () =>
  withContext({
    "@type": "Organization",
    name: "JHA (Korea)",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jha.kr",
    sameAs: ["https://www.facebook.com", "https://www.instagram.com"],
    logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://jha.kr"}/favicon.ico`,
  });

export const articleJsonLd = ({
  title,
  description,
  url,
  publishedAt,
  updatedAt,
  image,
}: {
  title: string;
  description?: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}) =>
  withContext({
    "@type": "NewsArticle",
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    image: image ? [image] : undefined,
    publisher: {
      "@type": "Organization",
      name: "JHA (Korea)",
    },
  });

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) =>
  withContext({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });

export const courseJsonLd = ({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}) =>
  withContext({
    "@type": "Course",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "JHA (Korea)",
    },
  });

export const faqJsonLd = (items: { question: string; answer: string }[]) =>
  withContext({
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });


