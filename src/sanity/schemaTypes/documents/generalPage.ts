import { defineField, defineType } from "sanity";

const marketingPageKeys = [
  { title: "About", value: "about" },
  { title: "Alumni", value: "alumni" },
  { title: "FAQ", value: "faq" },
  { title: "Gallery", value: "gallery" },
];

export const generalPage = defineType({
  name: "generalPage",
  title: "General Page",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      title: "Page Key",
      type: "string",
      hidden: true,
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Describe the image for accessibility.",
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      description: "Use for About/Alumni pages to showcase key pillars or stories.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "blockContent",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery Media",
      description: "Populate the gallery page with curated images.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "heroTitle", subtitle: "pageKey" },
    prepare({ title, subtitle }) {
      const label =
        marketingPageKeys.find((entry) => entry.value === subtitle)?.title ??
        subtitle;
      return {
        title: title || "Untitled page",
        subtitle: label ?? "General Page",
      };
    },
  },
});

