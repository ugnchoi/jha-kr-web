import type { SchemaTypeDefinition, Template } from "sanity";

import { blockContent } from "./objects/blockContent";
import { seoFields } from "./objects/seoFields";
import { category } from "./documents/category";
import { post } from "./documents/post";
import { author } from "./documents/author";
import { program } from "./documents/program";
import { homePage } from "./documents/homePage";
import { admissionsPage } from "./documents/admissionsPage";
import { coop } from "./documents/coop";
import { activity } from "./documents/activity";
import { generalPage } from "./documents/generalPage";

const types: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  program,
  blockContent,
  seoFields,
  homePage,
  admissionsPage,
  coop,
  activity,
  generalPage,
];

const generalPageSingletonTemplate: Template = {
  id: "generalPageByKey",
  title: "General Page Singleton",
  schemaType: "generalPage",
  parameters: [
    {
      name: "pageKey",
      type: "string",
    },
  ],
  value: (params: { pageKey?: string }) => ({
    pageKey: params?.pageKey,
  }),
};

export const schema = {
  types,
  templates: (prev: Template[]) => [...prev, generalPageSingletonTemplate],
};

