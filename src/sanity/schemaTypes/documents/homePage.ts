import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      description: "The main headline on the homepage.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 3,
      description: "A brief introductory text below the headline.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroCtaLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "Learn More",
    }),
    defineField({
      name: "heroCtaLink",
      title: "CTA Button Link",
      type: "string",
      description: "Relative path (e.g. /admissions) or absolute URL.",
      initialValue: "/admissions",
    }),
    defineField({
      name: "featuredNews",
      title: "Featured News",
      type: "array",
      of: [{ type: "reference", to: { type: "post" } }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "heroTitle",
    },
    prepare({ title }) {
      return {
        title: title || "Home Page",
        subtitle: "Singleton Document",
      };
    },
  },
});

