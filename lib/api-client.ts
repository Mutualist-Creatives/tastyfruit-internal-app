/**
 * API Client for TastyFruit Backend
 * Centralized API wrapper with authentication and error handling
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Cookie helpers for token storage (works with middleware)
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Token storage helpers (using cookies for SSR/middleware compatibility)
export const getToken = (): string | null => {
  return getCookie("auth_token");
};

export const setToken = (token: string): void => {
  setCookie("auth_token", token, 7); // 7 days
};

export const removeToken = (): void => {
  deleteCookie("auth_token");
};

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

// Base fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.error?.message || data.message || "An error occurred",
      data
    );
  }

  return data;
}

// ============================================
// Auth API
// ============================================
export interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: string;
    };
    token: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  image?: string | null;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    return fetchApi("/auth/me");
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    return fetchApi("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// Products API
// ============================================
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  nutrition: Record<string, unknown> | null;
  fruitTypes?: FruitType[];
  createdAt: string;
  updatedAt: string;
}

export interface FruitType {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    return fetchApi(`/products?${searchParams}`);
  },

  getById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    return fetchApi(`/products/${id}`);
  },

  create: async (
    data: Partial<Product>
  ): Promise<{ success: boolean; data: Product }> => {
    return fetchApi("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<Product>
  ): Promise<{ success: boolean; data: Product }> => {
    return fetchApi(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchApi(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// ============================================
// FruitTypes API
// ============================================
export const fruitTypesApi = {
  getAll: async (
    productId?: string
  ): Promise<{ success: boolean; data: { fruitTypes: FruitType[] } }> => {
    const params = productId ? `?productId=${productId}` : "";
    return fetchApi(`/fruit-types${params}`);
  },

  getById: async (
    id: string
  ): Promise<{ success: boolean; data: FruitType }> => {
    return fetchApi(`/fruit-types/${id}`);
  },

  create: async (
    data: Partial<FruitType>
  ): Promise<{ success: boolean; data: FruitType }> => {
    return fetchApi("/fruit-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<FruitType>
  ): Promise<{ success: boolean; data: FruitType }> => {
    return fetchApi(`/fruit-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchApi(`/fruit-types/${id}`, {
      method: "DELETE",
    });
  },
};

// ============================================
// Recipes API
// ============================================
export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  servings: string | null;
  cookingTime: string | null;
  author: string;
  difficulty: string;
  ingredients: Array<{ name: string; amount: string; note?: string }>;
  instructions: Array<{ title: string; description: string }>;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const recipesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Recipe>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    return fetchApi(`/recipes?${searchParams}`);
  },

  getById: async (id: string): Promise<{ success: boolean; data: Recipe }> => {
    return fetchApi(`/recipes/${id}`);
  },

  create: async (
    data: Partial<Recipe>
  ): Promise<{ success: boolean; data: Recipe }> => {
    return fetchApi("/recipes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<Recipe>
  ): Promise<{ success: boolean; data: Recipe }> => {
    return fetchApi(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchApi(`/recipes/${id}`, {
      method: "DELETE",
    });
  },
};

// ============================================
// Publications API
// ============================================
export interface Publication {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string;
  category: string;
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const publicationsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<PaginatedResponse<Publication>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category) searchParams.set("category", params.category);
    return fetchApi(`/publications?${searchParams}`);
  },

  getById: async (
    id: string
  ): Promise<{ success: boolean; data: Publication }> => {
    return fetchApi(`/publications/${id}`);
  },

  create: async (
    data: Partial<Publication>
  ): Promise<{ success: boolean; data: Publication }> => {
    return fetchApi("/publications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<Publication>
  ): Promise<{ success: boolean; data: Publication }> => {
    return fetchApi(`/publications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchApi(`/publications/${id}`, {
      method: "DELETE",
    });
  },
};

// ============================================
// Users API
// ============================================
export const usersApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    return fetchApi(`/users?${searchParams}`);
  },

  getById: async (id: string): Promise<{ success: boolean; data: User }> => {
    return fetchApi(`/users/${id}`);
  },

  create: async (
    data: Partial<User> & { password?: string }
  ): Promise<{ success: boolean; data: User }> => {
    return fetchApi("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: string,
    data: Partial<User> & { password?: string }
  ): Promise<{ success: boolean; data: User }> => {
    return fetchApi(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    return fetchApi(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

// ============================================
// Dashboard API
// ============================================
export interface DashboardStats {
  products: number;
  recipes: number;
  publications: number;
  users: number;
}

export const dashboardApi = {
  getStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    return fetchApi("/dashboard/stats");
  },
};

// ============================================
// Upload API
// ============================================
export const uploadApi = {
  uploadImage: async (
    file: File
  ): Promise<{ success: boolean; data: { url: string } }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || "Upload failed",
        data
      );
    }

    return data;
  },
};
