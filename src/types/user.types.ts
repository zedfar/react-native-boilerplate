export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  avatar: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserFilters {
  search?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
  sortBy?: 'latest' | 'oldest' | 'name';
  limit?: number;
  page?: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
  avatar?: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: string;
}
