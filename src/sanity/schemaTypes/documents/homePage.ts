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
      initialValue: "더 알아보기",
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
      name: "featuredVideo",
      title: "Featured Video",
      type: "object",
      description: "A single featured YouTube video shown on the landing page.",
      fields: [
        defineField({
          name: "title",
          title: "Video Title",
          type: "string",
          description: "Displayed as the section title on the landing page.",
        }),
        defineField({
          name: "youtubeUrl",
          title: "YouTube URL",
          type: "url",
          description:
            "Full YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).",
        }),
      ],
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) {
            return true;
          }

          const maybeValue = value as { title?: unknown; youtubeUrl?: unknown };
          const title = typeof maybeValue.title === "string" ? maybeValue.title.trim() : "";
          const youtubeUrl =
            typeof maybeValue.youtubeUrl === "string" ? maybeValue.youtubeUrl.trim() : "";

          if (!title && !youtubeUrl) {
            return true;
          }

          if (!title) {
            return "Video Title is required when Featured Video is set.";
          }

          if (!youtubeUrl) {
            return "YouTube URL is required when Featured Video is set.";
          }

          return true;
        }),
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

