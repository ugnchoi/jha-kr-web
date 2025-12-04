import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
const generalPageSingletons = [
  { title: "About Page", id: "aboutPage", pageKey: "about" },
  { title: "Alumni Page", id: "alumniPage", pageKey: "alumni" },
  { title: "FAQ Page", id: "faqPage", pageKey: "faq" },
  { title: "Gallery Page", id: "galleryPage", pageKey: "gallery" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
        ),
      ...generalPageSingletons.map((page) =>
        S.listItem()
          .title(page.title)
          .id(page.id)
          .child(
            S.document()
              .schemaType("generalPage")
              .documentId(page.id)
              .initialValueTemplate("generalPageByKey", { pageKey: page.pageKey })
          )
      ),
      S.listItem()
        .title("Admissions Page")
        .id("admissionsPage")
        .child(
          S.document()
            .schemaType("admissionsPage")
            .documentId("admissionsPage")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !["media.tag", "settings", "homePage", "generalPage", "admissionsPage"].includes(
            listItem.getId() || ""
          )
      ),
    ]);

