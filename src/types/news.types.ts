export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  categoryId: string;
  category?: Category;
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface NewsFilters {
  categoryId?: string;
  search?: string;
  sortBy?: 'latest' | 'popular' | 'oldest';
  limit?: number;
  page?: number;
}

export interface CreateNewsInput {
  title: string;
  content: string;
  excerpt: string;
  image: string;
  categoryId: string;
}

export interface UpdateNewsInput extends Partial<CreateNewsInput> {
  id: string;
}