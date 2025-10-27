import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { categories } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const slugify = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const categoriesRouter = router({
  list: publicProcedure.query(async () => {
    return db.query.categories.findMany();
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const slug = slugify(input.name);
      const [category] = await db.insert(categories).values({
        name: input.name,
        description: input.description,
        slug,
      }).returning();
      return category;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(100),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const slug = slugify(input.name);
      const [updated] = await db.update(categories)
        .set({ name: input.name, description: input.description, slug })
        .where(eq(categories.id, input.id))
        .returning();
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});