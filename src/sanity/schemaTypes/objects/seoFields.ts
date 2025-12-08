import { defineField, defineType } from "sanity";

export const seoFields = defineType({
  name: "seo",
  title: "SEO Metadata",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Keep under 60 characters.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Keep between 110-160 characters.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph Title",
      type: "string",
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL Override",
      type: "url",
    }),
    defineField({
      name: "noindex",
      title: "No Index",
      type: "boolean",
      description: "If true, adds noindex to robots meta.",
    }),
  ],
});


