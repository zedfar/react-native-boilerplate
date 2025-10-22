import { User, AuthResponse } from "@/types/auth.types";
import * as db from 'server/db.json'

const users: User[] = [...db.users];
let currentToken: string | null = null;

function fakeTokenFor(user: User) {
  // simple fake token (not JWT). Use real JWT in server example above if needed
  const token = btoa(`${user.id}:${user.email}:${Date.now()}`);
  currentToken = token;
  return token;
}

export const mockApi = {
  post: async <T = any>(url: string, body?: any): Promise<T> => {
    // small artificial delay to mimic network (optional)
    await new Promise(r => setTimeout(r, 150));

    if (url === '/auth/login') {
      const { email, password } = body ?? {};
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) {
        const err: any = new Error('Invalid credentials');
        err.status = 401;
        throw err;
      }
      const { password: _p, ...safeUser } = found;
      const response: AuthResponse = {
        token: fakeTokenFor(found),
        user: safeUser
      };
      return response as unknown as T;
    }


    if (url === '/auth/register') {
      const { email, password, name } = body ?? {};

      if (users.some(u => u.email === email)) {
        const err: any = new Error('Email already exists');
        err.status = 400;
        throw err;
      }

      const newUser: User = {
        id: (users.length + 1).toString(),
        email,
        name,
        password,
        role: "user",
        createdAt: ""
      };

      users.push(newUser);

      const { password: _p, ...safeUser } = newUser;
      const response: AuthResponse = {
        token: fakeTokenFor(newUser),
        user: safeUser
      };

      return response as unknown as T;
    }

    if (url === '/auth/logout') {
      currentToken = null;
      return {} as T;
    }


    if (url === '/auth/refresh') {
      if (!currentToken) {
        const err: any = new Error('No active session');
        err.status = 401;
        throw err;
      }
      // buat token baru
      const newToken = btoa(`refresh:${Date.now()}`);
      currentToken = newToken;
      return { token: newToken } as unknown as T;
    }


    if (url === '/auth/forgot-password') {
      const { email } = body ?? {};
      const exists = users.some(u => u.email === email);
      if (!exists) {
        const err: any = new Error('Email not found');
        err.status = 404;
        throw err;
      }
      return { message: 'Password reset email sent' } as unknown as T;
    }

    if (url === '/auth/reset-password') {
      const { token, password } = body ?? {};
      // dummy token verification (accept any token for mock)
      if (!token) {
        const err: any = new Error('Invalid token');
        err.status = 400;
        throw err;
      }
      // update password user (untuk simplicity update first user)
      if (users.length > 0) {
        users[0].password = password;
      }
      return { message: 'Password successfully reset' } as unknown as T;
    }

    // fallback: simulate 404
    const err: any = new Error('Not found');
    err.status = 404;
    throw err;
  },

  get: async <T = any>(url: string): Promise<T> => {
    await new Promise(r => setTimeout(r, 150));

    // CURRENT USER
    if (url === '/auth/me') {
      if (!currentToken) {
        const err: any = new Error('Not authenticated');
        err.status = 401;
        throw err;
      }
      // ambil user dari token (mock: first user)
      const { password: _p, ...safeUser } = users[0];
      return safeUser as unknown as T;
    }

    const err: any = new Error('Not found');
    err.status = 404;
    throw err;
  }
};