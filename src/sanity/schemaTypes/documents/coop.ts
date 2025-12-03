import { defineField, defineType } from "sanity";

export const coop = defineType({
  name: "coop",
  title: "Co-op Hub",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "day",
      title: "Co-op Day",
      type: "string",
      options: {
        list: [
          { title: "Monday", value: "monday" },
          { title: "Saturday", value: "saturday" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "description",
      title: "Overview",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "announcements",
      title: "Featured Announcements",
      type: "array",
      of: [{ type: "reference", to: { type: "post" } }],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "activities",
      title: "Featured Activities",
      type: "array",
      of: [{ type: "reference", to: { type: "activity" } }],
      validation: (rule) => rule.max(6),
    }),
  ],
});

