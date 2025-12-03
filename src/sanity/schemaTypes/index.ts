import { type SchemaTypeDefinition } from "sanity";

import { blockContent } from "./objects/blockContent";
import { category } from "./documents/category";
import { post } from "./documents/post";
import { author } from "./documents/author";
import { program } from "./documents/program";
import { homePage } from "./documents/homePage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, author, category, program, blockContent, homePage],
};

