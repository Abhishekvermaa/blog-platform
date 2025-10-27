"use client";

import { trpc } from "../../../../lib/server/trpc-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const postId = parseInt(id);

  const { data: post, isLoading } = trpc.posts.byId.useQuery({ id: postId });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
    }
  }, [post]);

  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => router.push("/dashboard"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ id: postId, title, content, published });
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!post) return <div className="p-8 text-center">Post not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Edit Post</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-64"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Published
              </span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}