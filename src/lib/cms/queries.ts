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
    publishedAt,
    mainImage,
    body,
    "author": author->{name, image},
    "categories": categories[]->title
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
    }
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
    description,
    mainImage,
    content
  }
`;
