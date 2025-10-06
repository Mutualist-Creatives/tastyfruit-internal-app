"use client";

import PublicationDetail from "../web-clients/article/publication-detail";
import { PublicationData } from "../web-clients/types";

interface PublicationPreviewProps {
  publication: {
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    category: string;
    imageUrl?: string;
    isPublished: boolean;
    publishedAt?: string;
    createdAt: string;
  };
  viewMode?: "desktop" | "mobile";
}

export default function PublicationPreview({
  publication,
  viewMode = "desktop",
}: PublicationPreviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert publication data to match web client format
  const articleData: PublicationData = {
    id: publication.title.toLowerCase().replace(/\s+/g, "-"),
    title: publication.title,
    content: publication.content,
    excerpt: publication.excerpt,
    author: publication.author,
    category: publication.category as
      | "Event"
      | "Activities"
      | "Product"
      | "Information",
    image: publication.imageUrl || "/assets/default-article.jpg",
    date: formatDate(publication.publishedAt || publication.createdAt),
    isPublished: publication.isPublished,
    publishedAt: publication.publishedAt,
    createdAt: publication.createdAt,
  };

  // Mock next article for navigation
  const nextArticle: PublicationData = {
    id: "next-article",
    title: "Next Article",
    content: "",
    author: "TastyFruit Team",
    category: "Information",
    image: "/assets/default-article.jpg",
    date: formatDate(new Date().toISOString()),
    isPublished: true,
    createdAt: new Date().toISOString(),
  };

  return (
    <PublicationDetail
      article={articleData}
      nextArticle={nextArticle}
      sanitizedContent={publication.content}
      viewMode={viewMode}
    />
  );
}
