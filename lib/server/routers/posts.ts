import { z } from "zod";
import { publicProcedure, router } from "./trpc-server";
import { prisma } from "../../prisma";

export const postsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        categoryId: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async (opts) => {
      const skip = (opts.input.page - 1) * opts.input.limit;
      const where: any = {};

      if (opts.input.categoryId) {
        where.categories = {
          some: { id: opts.input.categoryId },
        };
      }

      if (opts.input.search) {
        where.OR = [
          { title: { contains: opts.input.search, mode: "insensitive" } },
          { content: { contains: opts.input.search, mode: "insensitive" } },
        ];
      }

      const posts = await prisma.post.findMany({
        where,
        skip,
        take: opts.input.limit,
        include: { categories: true },
        orderBy: { createdAt: "desc" },
      });

      const total = await prisma.post.count({ where });

      return {
        posts,
        total,
        pages: Math.ceil(total / opts.input.limit),
        currentPage: opts.input.page,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async (opts) => {
      return await prisma.post.findUnique({
        where: { id: opts.input.id },
        include: { categories: true },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        published: z.boolean().default(false),
        categoryIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async (opts) => {
      return await prisma.post.create({
        data: {
          title: opts.input.title,
          content: opts.input.content,
          published: opts.input.published,
          categories: opts.input.categoryIds
            ? { connect: opts.input.categoryIds.map((id) => ({ id })) }
            : undefined,
        },
        include: { categories: true },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
        categoryIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async (opts) => {
      return await prisma.post.update({
        where: { id: opts.input.id },
        data: {
          title: opts.input.title,
          content: opts.input.content,
          published: opts.input.published,
          categories: opts.input.categoryIds
            ? { set: opts.input.categoryIds.map((id) => ({ id })) }
            : undefined,
        },
        include: { categories: true },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async (opts) => {
      return await prisma.post.delete({
        where: { id: opts.input.id },
      });
    }),
});