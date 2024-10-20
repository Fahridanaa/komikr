import type { CollectionEntry } from "astro:content";

export type ComicMeta = CollectionEntry<"comics">["data"];
export type Comic = CollectionEntry<"comics">;
