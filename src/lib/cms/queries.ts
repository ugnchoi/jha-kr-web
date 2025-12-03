import { groq } from "next-sanity";

// Post list query
export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "categories": categories[]->title
  }
`;

// Single post query
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
