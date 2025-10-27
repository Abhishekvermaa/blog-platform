"use client";

import Link from "next/link";
import { trpc } from "../../lib/server/trpc-client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const postsQuery = trpc.posts.list.useQuery({});
  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => {
      postsQuery.refetch();
    },
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (postsQuery.isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ fontSize: "20px" }}>Loading dashboard...</div>
      </div>
    );
  }

  const posts = postsQuery.data || [];
  const published = posts.filter((p) => p.published).length;
  const drafts = posts.length - published;

  function handleDelete(id) {
    if (confirm("Delete this post?")) {
      deletePost.mutate({ id: id });
    }
  }

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  };

  const mainStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: isMobile ? "16px" : "32px",
  };

  const headerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    marginBottom: "32px",
    gap: isMobile ? "16px" : "0",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "350px 1fr",
    gap: isMobile ? "24px" : "32px",
  };

  return (
    <div style={containerStyle}>
      <div style={mainStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h1 style={{ fontSize: isMobile ? "24px" : "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>Dashboard</h1>
            <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px", margin: 0 }}>Manage your blog posts</p>
          </div>
          <Link 
            href="/dashboard/new" 
            style={{ 
              padding: isMobile ? "10px 20px" : "12px 24px", 
              backgroundColor: "#2563eb", 
              color: "white", 
              borderRadius: "8px", 
              fontWeight: "500", 
              textDecoration: "none",
              display: "inline-block",
              fontSize: isMobile ? "14px" : "16px"
            }}
          >
            + New Post
          </Link>
        </div>

        {/* Layout */}
        <div style={gridStyle}>
          {/* Stats Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Total Posts */}
            <div style={{ borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", padding: isMobile ? "24px" : "32px", backgroundColor: "#3b82f6", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div style={{ fontSize: isMobile ? "36px" : "48px", fontWeight: "bold" }}>{posts.length}</div>
              </div>
              <div style={{ fontSize: "18px", fontWeight: "600" }}>Total Posts</div>
              <div style={{ fontSize: "14px", opacity: "0.8", marginTop: "4px" }}>All your content</div>
            </div>

            {/* Published */}
            <div style={{ borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", padding: isMobile ? "24px" : "32px", backgroundColor: "#10b981", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div style={{ fontSize: isMobile ? "36px" : "48px", fontWeight: "bold" }}>{published}</div>
              </div>
              <div style={{ fontSize: "18px", fontWeight: "600" }}>Published</div>
              <div style={{ fontSize: "14px", opacity: "0.8", marginTop: "4px" }}>Live on site</div>
            </div>

            {/* Drafts */}
            <div style={{ borderRadius: "12px", boxShadow: "0 10px 15px rgba(0,0,0,0.1)", padding: isMobile ? "24px" : "32px", backgroundColor: "#f59e0b", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ padding: "12px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div style={{ fontSize: isMobile ? "36px" : "48px", fontWeight: "bold" }}>{drafts}</div>
              </div>
              <div style={{ fontSize: "18px", fontWeight: "600" }}>Drafts</div>
              <div style={{ fontSize: "14px", opacity: "0.8", marginTop: "4px" }}>Work in progress</div>
            </div>
          </div>

          {/* Posts Table */}
          <div>
            <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ padding: isMobile ? "16px 20px" : "24px 32px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                <h2 style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: "bold", color: "#111827", margin: 0 }}>Your Posts</h2>
                <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px", margin: "4px 0 0 0" }}>{posts.length} total posts</p>
              </div>

              {posts.length === 0 ? (
                <div style={{ padding: isMobile ? "32px 16px" : "64px", textAlign: "center" }}>
                  <div style={{ color: "#6b7280", fontSize: "18px", marginBottom: "16px" }}>No posts yet</div>
                  <p style={{ color: "#9ca3af", marginBottom: "24px" }}>Start creating content</p>
                  <Link 
                    href="/dashboard/new" 
                    style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "white", borderRadius: "8px", display: "inline-block", fontWeight: "500", textDecoration: "none" }}
                  >
                    Create First Post
                  </Link>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f9fafb" }}>
                      <tr>
                        <th style={{ padding: isMobile ? "12px 16px" : "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "bold", color: "#374151", textTransform: "uppercase" }}>Title</th>
                        <th style={{ padding: isMobile ? "12px 16px" : "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "bold", color: "#374151", textTransform: "uppercase" }}>Status</th>
                        {!isMobile && <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "bold", color: "#374151", textTransform: "uppercase" }}>Date</th>}
                        <th style={{ padding: isMobile ? "12px 16px" : "16px 24px", textAlign: "right", fontSize: "12px", fontWeight: "bold", color: "#374151", textTransform: "uppercase" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post, index) => {
                        const dateStr = new Date(post.createdAt).toLocaleDateString();
                        const editUrl = "/dashboard/edit/" + post.id;
                        
                        return (
                          <tr key={post.id} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                            <td style={{ padding: isMobile ? "12px 16px" : "16px 24px" }}>
                              <div style={{ fontWeight: "600", color: "#111827", fontSize: isMobile ? "14px" : "16px" }}>{post.title}</div>
                              {!isMobile && <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>{post.content.substring(0, 50)}...</div>}
                            </td>
                            <td style={{ padding: isMobile ? "12px 16px" : "16px 24px" }}>
                              {post.published ? (
                                <span style={{ padding: "6px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: "600", backgroundColor: "#d1fae5", color: "#065f46", whiteSpace: "nowrap" }}>
                                  ● {isMobile ? "Pub" : "Published"}
                                </span>
                              ) : (
                                <span style={{ padding: "6px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: "600", backgroundColor: "#fef3c7", color: "#92400e", whiteSpace: "nowrap" }}>
                                  ● Draft
                                </span>
                              )}
                            </td>
                            {!isMobile && (
                              <td style={{ padding: "16px 24px" }}>
                                <div style={{ fontSize: "14px", color: "#4b5563" }}>{dateStr}</div>
                              </td>
                            )}
                            <td style={{ padding: isMobile ? "12px 16px" : "16px 24px", textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: isMobile ? "4px" : "8px" }}>
                                <Link 
                                  href={editUrl} 
                                  style={{ padding: isMobile ? "6px 10px" : "8px 16px", borderRadius: "8px", fontSize: isMobile ? "12px" : "14px", fontWeight: "500", backgroundColor: "#dbeafe", color: "#1e40af", textDecoration: "none" }}
                                >
                                  {isMobile ? "✏" : "✏ Edit"}
                                </Link>
                                <button 
                                  onClick={() => handleDelete(post.id)} 
                                  style={{ padding: isMobile ? "6px 10px" : "8px 16px", borderRadius: "8px", fontSize: isMobile ? "12px" : "14px", fontWeight: "500", backgroundColor: "#fee2e2", color: "#991b1b", border: "none", cursor: "pointer" }}
                                >
                                  {isMobile ? "🗑" : "🗑 Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}