// Type definitions for web client components

export interface PublicationData {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category: "Event" | "Activities" | "Product" | "Information";
  image: string;
  date: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface RecipeData {
  id: string;
  name: string;
  image: string;
  author: string;
  servings: string;
  time: string;
  ingredients: Array<{
    name: string;
    amount: string;
    note?: string;
  }>;
  instructions: Array<{
    title: string;
    description: string;
  }>;
  difficulty?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ArticleCardProps {
  publication?: PublicationData;
  recipe?: RecipeData;
}

export interface PublicationDetailProps {
  article: PublicationData;
  nextArticle: PublicationData;
  sanitizedContent: string;
}

export interface RecipeDetailProps {
  recipe: RecipeData;
}
