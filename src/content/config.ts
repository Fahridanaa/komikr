import { defineCollection, z } from "astro:content";

const comicCollection = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        author: z.string(),
        type: z.enum(["manga", "manhwa", "manhua"]),
        chapter: z.number().default(0),
        release: z.coerce.date(),
        updatedOn: z.coerce.date(),
        status: z.enum(["ongoing", "completed"]),
        genres: z.array(z.string()),
        synopsis: z.string(),
    }),
});

export const collections = {
    comics: comicCollection,
};
