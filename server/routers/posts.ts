import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { db } from "../db";
import { posts, postCategories } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

const slugify = (text: string) => 
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const postsRouter = router({
  // LIST all posts (with optional category filter)
  list: publicProcedure
    .input(z.object({ categoryId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      return db.query.posts.findMany({
        where: input?.categoryId 
          ? eq(posts.id, input.categoryId) 
          : eq(posts.published, true),
        orderBy: desc(posts.createdAt),
        with: { postCategories: { with: { category: true } } },
      });
    }),

  // GET single post by ID
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: { postCategories: { with: { category: true } } },
      });
      if (!post) throw new Error("Post not found");
      return post;
    }),

  // CREATE new post
  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      published: z.boolean(),
      categoryIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      const slug = slugify(input.title);
      const [post] = await db.insert(posts).values({
        title: input.title,
        content: input.content,
        slug,
        published: input.published,
      }).returning();

      if (input.categoryIds?.length) {
        await db.insert(postCategories).values(
          input.categoryIds.map(categoryId => ({ postId: post.id, categoryId }))
        );
      }
      return post;
    }),

  // UPDATE existing post
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      published: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [updated] = await db.update(posts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning();
      return updated;
    }),

  // DELETE post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),
});

