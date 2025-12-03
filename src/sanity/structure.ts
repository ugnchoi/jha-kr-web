import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singleton: Home Page
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
        ),
        
      S.divider(),

      // Filter out schema types that are handled by dedicated menu items
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["media.tag", "settings", "homePage"].includes(listItem.getId() || "")
      ),
    ]);

