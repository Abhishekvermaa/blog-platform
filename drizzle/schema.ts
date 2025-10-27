
import { pgTable, text, varchar, boolean, timestamp, serial, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  slug: varchar("slug", { length: 250 }).notNull().unique(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const postCategories = pgTable("post_categories", {
  postId: serial("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  categoryId: serial("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.categoryId] }),
}));

export const postsRelations = relations(posts, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  postCategories: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, { fields: [postCategories.postId], references: [posts.id] }),
  category: one(categories, { fields: [postCategories.categoryId], references: [categories.id] }),
}));