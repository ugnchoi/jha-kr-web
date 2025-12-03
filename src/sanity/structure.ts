import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Filter out schema types that are handled by dedicated menu items
      // ...S.documentTypeListItems(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["media.tag", "settings"].includes(listItem.getId() || "")
      ),
    ]);

