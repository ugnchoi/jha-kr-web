import { groq } from "next-sanity";

// ... existing queries ...

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "categories": categories[]->title
  }
`;

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    body,
    "author": author->{name, image},
    "categories": categories[]->title,
    seo
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroTitle,
    heroSubtitle,
    heroImage,
    heroCtaLabel,
    heroCtaLink,
    featuredNews[]->{
      title,
      "slug": slug.current,
      publishedAt,
      mainImage,
      "categories": categories[]->title
    },
    seo
  }
`;

// Programs
export const programsQuery = groq`
  *[_type == "program" && defined(slug.current)] | order(title asc) {
    title,
    titleEn,
    "slug": slug.current,
    description,
    mainImage
  }
`;

export const programQuery = groq`
  *[_type == "program" && slug.current == $slug][0] {
    title,
    titleEn,
    "slug": slug.current,
    description,
    mainImage,
    content,
    seo
  }
`;

export const programSlugsQuery = groq`
  *[_type == "program" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const admissionsPageQuery = groq`
  *[_type == "admissionsPage" && _id == "admissionsPage"][0]{
    heroTitle,
    heroSubtitle,
    heroImage,
    ctaLabel,
    ctaLink,
    overview,
    checklist,
    timeline,
    contactEmail,
    contactPhone,
    seo
  }
`;

export const coopsQuery = groq`
  *[_type == "coop" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current,
    day,
    description,
    heroImage
  }
`;

export const coopQuery = groq`
  *[_type == "coop" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    day,
    description,
    heroImage,
    announcements[]->{
      title,
      "slug": slug.current,
      publishedAt
    },
    activities[]->{
      title,
      "slug": slug.current,
      category,
      description,
      featuredImage
    },
    seo
  }
`;

export const coopSlugsQuery = groq`
  *[_type == "coop" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const activitiesQuery = groq`
  *[_type == "activity" && defined(slug.current)] | order(title asc) {
    title,
    "slug": slug.current,
    category,
    description,
    featuredImage
  }
`;

export const generalPageQuery = groq`
  *[_type == "generalPage" && pageKey == $pageKey][0] {
    pageKey,
    heroTitle,
    heroSubtitle,
    heroImage,
    body,
    highlights,
    faqItems[]{
      question,
      answer
    },
    gallery,
    seo
  }
`;
