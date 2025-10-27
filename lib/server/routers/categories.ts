import { z } from "zod";
import { publicProcedure, router } from "./trpc-server";
import { prisma } from "../../prisma";

export const categoriesRouter = router({
  // List all categories
  list: publicProcedure.query(async () => {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  }),

  // Get single category
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async (opts) => {
      const category = await prisma.category.findUnique({
        where: { id: opts.input.id },
        include: {
          posts: true,
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  // Get category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async (opts) => {
      const category = await prisma.category.findUnique({
        where: { slug: opts.input.slug },
        include: {
          posts: {
            where: { published: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    }),

  // Create category
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const category = await prisma.category.create({
        data: {
          name: opts.input.name,
          slug: opts.input.slug,
        },
      });

      return category;
    }),

  // Update category
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const updateData: Record<string, unknown> = {};

      if (opts.input.name !== undefined) {
        updateData.name = opts.input.name;
      }
      if (opts.input.slug !== undefined) {
        updateData.slug = opts.input.slug;
      }

      const category = await prisma.category.update({
        where: { id: opts.input.id },
        data: updateData,
      });

      return category;
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (opts) => {
      await prisma.category.delete({
        where: { id: opts.input.id },
      });

      return { success: true };
    }),
});