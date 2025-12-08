import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextContent } from "@/components/blocks/portable-text";

export const portableTextToPlain = (content?: PortableTextContent): string => {
  if (!content) {
    return "";
  }

  const blocks: PortableTextBlock[] = Array.isArray(content)
    ? content.filter((block): block is PortableTextBlock => !!block && typeof block === "object")
    : [content].filter((block): block is PortableTextBlock => !!block && typeof block === "object");

  return blocks
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }

      return block.children.map((child) => ("text" in child ? child.text : "")).join("");
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
};


