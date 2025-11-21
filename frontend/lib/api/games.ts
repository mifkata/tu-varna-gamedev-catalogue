import type { GameResponse, CreateGameDto, UpdateGameDto } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const gamesApi = {
  async getAll(): Promise<GameResponse[]> {
    const res = await fetch(`${API_URL}/api/games`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch games');
    return res.json();
  },

  async getById(id: string): Promise<GameResponse> {
    const res = await fetch(`${API_URL}/api/games/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch game');
    return res.json();
  },

  async create(data: CreateGameDto): Promise<GameResponse> {
    const res = await fetch(`${API_URL}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create game');
    return res.json();
  },

  async update(id: string, data: UpdateGameDto): Promise<GameResponse> {
    const res = await fetch(`${API_URL}/api/games/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update game');
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/games/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete game');
  },

  async bulkDelete(ids: string[]): Promise<void> {
    const res = await fetch(`${API_URL}/api/games/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to bulk delete games');
  },
};
