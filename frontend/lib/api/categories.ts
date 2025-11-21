import type {
  CategoryListItem,
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const categoriesApi = {
  async getAll(): Promise<CategoryListItem[]> {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getById(id: string): Promise<CategoryResponse> {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch category');
    return res.json();
  },

  async create(data: CreateCategoryDto): Promise<CategoryResponse> {
    const res = await fetch(`${API_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },

  async update(id: string, data: UpdateCategoryDto): Promise<CategoryResponse> {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete category');
  },

  async bulkDelete(ids: string[]): Promise<void> {
    const res = await fetch(`${API_URL}/api/categories/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete categories');
  },
};
