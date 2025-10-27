"use client";

import { trpc } from "../lib/server/trpc-client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const postsQuery = trpc.posts.list.useQuery({ categoryId: selectedCategory });
  const categoriesQuery = trpc.categories.list.useQuery();

  if (postsQuery.isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const posts = postsQuery.data || [];
  const categories = categoriesQuery.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Blog</h1>
          <p className="text-xl mb-8">Discover amazing stories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Filter by Category</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={selectedCategory === undefined ? "bg-blue-600 text-white px-4 py-2 rounded-full" : "bg-gray-200 text-gray-700 px-4 py-2 rounded-full"}
            >
              All Posts
            </button>
            {categories.map((cat: any) => (
              <button
                key={String(cat.id)}
                onClick={() => setSelectedCategory(cat.id)}
                className={selectedCategory === cat.id ? "bg-blue-600 text-white px-4 py-2 rounded-full" : "bg-gray-200 text-gray-700 px-4 py-2 rounded-full"}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No posts yet</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link key={String(post.id)} href={"/posts/" + post.id}>
                <div className="border rounded-lg p-6 hover:shadow-xl transition bg-white">
                  <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
                  <p className="text-gray-700 mb-4">{post.content.substring(0, 150)}...</p>
                  {post.postCategories && post.postCategories.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {post.postCategories.map((pc: any, idx: number) => (
                        <span key={String(idx)} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {pc.category.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}