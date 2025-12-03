import { defineField, defineType } from "sanity";

export const admissionsPage = defineType({
  name: "admissionsPage",
  title: "Admissions Page",
  type: "document",
  fields: [
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
    }),
    defineField({
      name: "ctaLabel",
      title: "Hero CTA Label",
      type: "string",
      initialValue: "Start Application",
    }),
    defineField({
      name: "ctaLink",
      title: "Hero CTA Link",
      type: "string",
      initialValue: "/admissions/apply",
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "blockContent",
    }),
    defineField({
      name: "checklist",
      title: "Checklist",
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
      name: "timeline",
      title: "Timeline",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Milestone Title",
              type: "string",
            }),
            defineField({
              name: "dateRange",
              title: "Date / Range",
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
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
  ],
});

