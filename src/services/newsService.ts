import { api } from './api';
import { News, NewsFilters, CreateNewsInput, UpdateNewsInput } from '@/types/news.types';
import { PaginatedResponse } from '@/types/api.types';

class NewsService {
  async getNews(filters?: NewsFilters): Promise<PaginatedResponse<News>> {
    return await api.get<PaginatedResponse<News>>('/news', filters);
  }

  async getNewsById(id: string): Promise<News> {
    return await api.get<News>(`/news/${id}`);
  }

  async createNews(data: CreateNewsInput): Promise<News> {
    return await api.post<News>('/news', data);
  }

  async updateNews(data: UpdateNewsInput): Promise<News> {
    const { id, ...updateData } = data;
    return await api.put<News>(`/news/${id}`, updateData);
  }

  async deleteNews(id: string): Promise<void> {
    await api.delete(`/news/${id}`);
  }

  async likeNews(id: string): Promise<{ likes: number }> {
    return await api.post<{ likes: number }>(`/news/${id}/like`);
  }

  async incrementViews(id: string): Promise<{ views: number }> {
    return await api.post<{ views: number }>(`/news/${id}/views`);
  }

  async searchNews(query: string): Promise<News[]> {
    return await api.get<News[]>('/news/search', { q: query });
  }

  async getTrendingNews(limit: number = 10): Promise<News[]> {
    return await api.get<News[]>('/news/trending', { limit });
  }
}

export const newsService = new NewsService();