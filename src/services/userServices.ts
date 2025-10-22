import { api } from './api';
// import { mockApi } from './mockApi';
import { API_CONFIG } from '@utils/constants';
import {
    User,
    CreateUserInput,
    UpdateUserInput,
    UserFilters
} from '@/types/user.types';
import { mockApi } from './mockApi';

class UserService {
    async getAll(filters?: UserFilters): Promise<User[]> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.get<User[]>('/users', { params: filters });
        }
        return await api.get<User[]>('/users', { params: filters });
    }

    async getById(id: string): Promise<User> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.get<User>(`/users/${id}`);
        }
        return await api.get<User>(`/users/${id}`);
    }

    async create(data: CreateUserInput): Promise<User> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.post<User>('/users', data);
        }
        return await api.post<User>('/users', data);
    }

    async update(data: UpdateUserInput): Promise<User> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.put<User>(`/users/${data.id}`, data);
        }
        return await api.put<User>(`/users/${data.id}`, data);
    }

    async delete(id: string): Promise<{ message: string }> {
        if (API_CONFIG.MOCK_API) {
            return await mockApi.delete<{ message: string }>(`/users/${id}`);
        }
        return await api.delete<{ message: string }>(`/users/${id}`);
    }
}

export const userService = new UserService();
