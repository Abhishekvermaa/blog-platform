"use client";

import { trpc } from "../../../lib/server/trpc-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  
  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => router.push("/dashboard"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title, content, published });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Create New Post</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mr-2 w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Publish immediately
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}